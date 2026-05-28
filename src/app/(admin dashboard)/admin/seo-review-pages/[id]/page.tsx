import { notFound } from "next/navigation";
import SEOPageDetail from "@/app/(admin dashboard)/modules/seo-review-page/components/seo-page-detail";
import seoPagesData from "@/lib/seo-pages-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SEOReviewDetailPage({ params }: Props) {
  const { id } = await params;
  const page = seoPagesData.pages.find((p) => p.id === id);
  if (!page) notFound();
  return <SEOPageDetail page={page} />;
}
