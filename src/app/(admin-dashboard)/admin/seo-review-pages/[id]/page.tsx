"use client";

import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import SEOPageDetail from "@/app/(admin-dashboard)/modules/seo-review-page/components/seo-page-detail";

import { SEOReviewDetailSkeleton } from "@/components/skeletons/SEOReviewDetailSkeleton";

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
    return <SEOReviewDetailSkeleton />;
  }

  if (error || !detailData) {
    notFound();
  }

  return <SEOPageDetail page={detailData} />;
}
