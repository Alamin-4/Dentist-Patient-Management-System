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
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B0F19] text-white">
        <p>Loading consultation...</p>
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
      className="flex flex-col h-screen max-h-screen w-screen bg-[#070A13] font-sans text-slate-100 antialiased overflow-hidden"
    >
      <ConsultationVideoSession
        consultation={consultation}
        slug={slug}
        userId={userId!}
      />
    </LiveKitRoom>
  );
}