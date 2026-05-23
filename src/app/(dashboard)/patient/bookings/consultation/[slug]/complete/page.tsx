import { redirect } from "next/navigation";

export default function LegacyConsultationCompleteRedirect({
  params,
}: {
  params: { slug: string };
}) {
  redirect(`/consultation/${params.slug}/complete`);
}
