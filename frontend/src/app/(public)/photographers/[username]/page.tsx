import { PublicProfilePage } from "@/features/public-profile/PublicProfilePage";

export default function PhotographerPage({
  params,
}: {
  params: { username: string };
}) {
  return <PublicProfilePage username={params.username} />;
}
