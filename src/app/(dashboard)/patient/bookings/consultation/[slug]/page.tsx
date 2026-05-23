import { redirect } from "next/navigation";

export default function LegacyConsultationRedirect({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/consultation/${params.slug}`);
}
