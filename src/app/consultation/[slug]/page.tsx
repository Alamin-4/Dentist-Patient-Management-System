"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";

import { useSession } from "@/hooks/auth/useAuth";
import { useConsultationSession } from "@/hooks/consultation/useConsultationSession";
import { MeetingLobby } from "../components/meeting/MeetingLobby";
import { MeetingDetails } from "../components/meeting/MeetingDetails";
import { MeetingError } from "../components/meeting/MeetingError";
import { ConsultationVideoSession } from "../components/meeting/ConsultationVideoSession";


export default function ConsultationMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionQuery = useSession();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const userId = sessionQuery.data?.user?.id || sessionQuery.data?.id;
  const isDetailsMode = searchParams.get("mode") === "details";

  const { loading, error, token, serverUrl, consultation, lobbySecondsLeft } =
    useConsultationSession(slug, userId, isDetailsMode);

  // 1. Lobby State
  if (!loading && !error && consultation && lobbySecondsLeft > 0) {
    return (
      <MeetingLobby
        lobbySecondsLeft={lobbySecondsLeft}
        consultation={consultation}
        onLeave={() => router.back()}
      />
    );
  }

  // 2. Details Mode State
  if (!loading && !error && consultation && isDetailsMode) {
    return (
      <MeetingDetails
        consultation={consultation}
        userId={userId!}
        onBack={() => router.back()}
      />
    );
  }

  // 3. Error State
  if (error || (!loading && !consultation)) {
    return (
      <MeetingError
        error={error}
        onBack={() => router.push("/patient")}
      />
    );
  }

  // 4. Loading State
  if (!token || !serverUrl || !consultation) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center bg-[#F8FAFB] text-slate-800">
        <p className="font-medium">Loading consultation...</p>
      </div>
    );
  }

  // 5. Active Meeting State
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      className="flex flex-col flex-1 h-full w-full bg-[#F8FAFB] font-sans text-slate-800 antialiased overflow-hidden"
    >
      <ConsultationVideoSession
        consultation={consultation}
        slug={slug}
        userId={userId!}
      />
    </LiveKitRoom>
  );
}