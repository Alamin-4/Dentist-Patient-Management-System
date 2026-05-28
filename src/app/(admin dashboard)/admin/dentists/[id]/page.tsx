import DentistDetailPage from "@/app/(admin dashboard)/modules/dentists/dentist-detail-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <DentistDetailPage dentistId={id} />;
}
