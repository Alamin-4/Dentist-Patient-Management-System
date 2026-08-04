import DentistDetailPageComponent from "@/app/(admin-dashboard)/modules/dentists/components/dentist-profile-components/DentistDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <DentistDetailPageComponent dentistId={id as string} />
}
