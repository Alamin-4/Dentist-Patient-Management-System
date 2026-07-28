"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import SEOPageDetail from "@/app/(admin-dashboard)/modules/seo-review-page/components/seo-page-detail";

export default function SEOReviewDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: detailData, isLoading, error } = useQuery({
    queryKey: ["seo-review-page-detail", id],
    queryFn: async () => {
      const res = await apiClient.admin.getSeoReviewPageDetail(id);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-text border-t-transparent" />
      </div>
    );
  }

  if (error || !detailData) {
    notFound();
  }

  return <SEOPageDetail page={detailData} />;
}
