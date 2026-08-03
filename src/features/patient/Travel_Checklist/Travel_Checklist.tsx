"use client";

import React, { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Check, PlaneTakeoff, HeartHandshake, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

import { ErrorState } from "@/components/shared/error-state";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  section: "before" | "after";
}

export default function TravelChecklistPageComponent() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, isError, refetch } = useQuery<ChecklistItem[]>({
    queryKey: ["patient-travel-checklist"],
    queryFn: async () => {
      const response = await apiClient.patients.getTravelChecklist();
      const apiData = response?.data || response;
      return Array.isArray(apiData) ? apiData : [];
    },
    staleTime: 1000 * 60 * 5, // Keep cached data fresh for 5 mins
  });

  const toggleMutation = useMutation({
    mutationFn: async (payload: { id: string; completed: boolean }) => {
      return await apiClient.patients.updateTravelChecklist({
        items: [{ id: payload.id, completed: payload.completed }],
      });
    },
    onMutate: async (payload) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["patient-travel-checklist"] });

      // Snapshot previous items
      const previousItems = queryClient.getQueryData<ChecklistItem[]>(["patient-travel-checklist"]);

      // Optimistically update to the new value immediately
      if (previousItems) {
        queryClient.setQueryData<ChecklistItem[]>(["patient-travel-checklist"], (old = []) =>
          old.map((item) =>
            item.id === payload.id ? { ...item, completed: payload.completed } : item
          )
        );
      }

      return { previousItems };
    },
    onError: (err: any, _variables, context) => {
      // Rollback to previous items snapshot on error
      if (context?.previousItems) {
        queryClient.setQueryData(["patient-travel-checklist"], context.previousItems);
      }
      toast.error(err?.response?.data?.message || err?.message || "Failed to update checklist item");
    },
    onSettled: () => {
      // Soft background invalidation to maintain consistency with server
      queryClient.invalidateQueries({ queryKey: ["patient-travel-checklist"] });
    },
  });

  const beforeItems = useMemo(() => {
    return items.filter((item) => item.section === "before");
  }, [items]);

  const afterItems = useMemo(() => {
    return items.filter((item) => item.section === "after");
  }, [items]);

  const totalCount = items.length;
  const completedCount = useMemo(() => items.filter((i) => i.completed).length, [items]);
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const beforeCompleted = useMemo(() => beforeItems.filter((i) => i.completed).length, [beforeItems]);
  const afterCompleted = useMemo(() => afterItems.filter((i) => i.completed).length, [afterItems]);

  const toggleItem = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate({ id, completed: !currentStatus });
  };

  if (isError) {
    return (
      <ErrorState
        title="Checklist Unavailable"
        message="Could not load your travel checklist. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-56 bg-slate-200 rounded-md" />
          <div className="h-4 w-80 bg-slate-100 rounded-md" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="h-5 w-40 bg-slate-200 rounded-md" />
          <div className="h-3 w-full bg-slate-100 rounded-full" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="h-6 w-44 bg-slate-200 rounded-md mb-4" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="size-5 rounded-md border-2 border-slate-200 bg-slate-100 shrink-0" />
              <div className={`h-4 bg-slate-200 rounded-md ${idx % 2 === 0 ? "w-2/3" : "w-1/2"}`} />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
          <div className="h-6 w-44 bg-slate-200 rounded-md mb-4" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="size-5 rounded-md border-2 border-slate-200 bg-slate-100 shrink-0" />
              <div className={`h-4 bg-slate-200 rounded-md ${idx % 2 === 0 ? "w-1/2" : "w-3/4"}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          Travel Checklist
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Keep track of your dental trip preparations and post-treatment recovery steps.
        </p>
      </div>

      {items.length > 0 && (
        <div className="bg-linear-to-br from-[#0F3659] to-[#1E4F7C] rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                <CheckCircle2 className="size-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Completion Status</h2>
                <p className="text-xs text-slate-200">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-white">{progressPercent}%</span>
              {progressPercent === 100 && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full border border-emerald-400/30 font-medium">
                  <Sparkles className="size-3" /> All Done!
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 rounded-2xl bg-white p-12">
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <PlaneTakeoff className="size-6 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700">No checklist items created yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Your travel checklist items will show up here once generated by the system.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Before you travel Section */}
          {beforeItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-[#0F3659] rounded-lg">
                    <PlaneTakeoff className="size-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    Before you travel
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {beforeCompleted} / {beforeItems.length}
                </span>
              </div>
              <div className="space-y-2">
                {beforeItems.map((item) => (
                  <CheckRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id, item.completed)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* After you travel Section */}
          {afterItems.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <HeartHandshake className="size-5" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-slate-900">
                    After you travel
                  </h2>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                  {afterCompleted} / {afterItems.length}
                </span>
              </div>
              <div className="space-y-2">
                {afterItems.map((item) => (
                  <CheckRow
                    key={item.id}
                    item={item}
                    onToggle={() => toggleItem(item.id, item.completed)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const CheckRow = ({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void;
}) => (
  <div
    className="flex items-start gap-4 p-3 -mx-3 rounded-xl hover:bg-slate-50/80 cursor-pointer transition-all duration-150 group select-none"
    onClick={onToggle}
  >
    <div
      className={cn(
        "mt-0.5 size-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0",
        item.completed
          ? "bg-[#0F3659] border-[#0F3659] scale-100 shadow-sm"
          : "border-slate-300 bg-white group-hover:border-[#0F3659] group-hover:scale-105"
      )}
    >
      {item.completed && <Check className="size-3.5 text-white stroke-[3px] animate-in zoom-in-50 duration-150" />}
    </div>
    <span
      className={cn(
        "text-base md:text-lg font-medium transition-all duration-200 leading-snug",
        item.completed
          ? "text-slate-400 line-through decoration-slate-300"
          : "text-slate-700 group-hover:text-slate-900"
      )}
    >
      {item.text}
    </span>
  </div>
);
