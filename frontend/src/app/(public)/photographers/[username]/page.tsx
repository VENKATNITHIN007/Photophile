import { PhotographerProfilePage } from "@/features/photographer-profile/PhotographerProfilePage";

export default function PhotographerPage({
  params,
}: {
  params: { username: string };
}) {
  return <PhotographerProfilePage username={params.username} />;
}
