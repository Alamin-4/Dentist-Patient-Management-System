"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";

import { useSession, useMe } from "@/hooks/auth/useAuth";
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
  const { user } = useMe();

  const slug = typeof params.slug === "string" ? params.slug : "";
  const userId = sessionQuery.data?.user?.id || sessionQuery.data?.id;
  const isDetailsMode = searchParams.get("mode") === "details";

  const { loading, error, token, serverUrl, consultation, lobbySecondsLeft } =
    useConsultationSession(slug, userId, isDetailsMode);

  const isDentist = user?.role === "DENTIST";
  const homePath = isDentist ? "/dentist" : "/patient";

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
        onBack={() => router.push(homePath)}
      />
    );
  }

  // 4. Loading State
  if (!token || !serverUrl || !consultation) {
    return (
      <div className="flex flex-col items-center justify-center h-dvh w-screen bg-[#F8FAFB] text-slate-800">
        <div className="flex flex-col items-center gap-4 max-w-sm p-8 rounded-2xl bg-white border border-[#E2E8F0]/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in zoom-in duration-300">
          <div className="h-10 w-10 border-4 border-[#113254] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-center space-y-1 mt-1">
            <p className="font-bold text-text text-base">Loading Session</p>
            <p className="text-xs text-gray-500 font-medium">Setting up your secure video connection...</p>
          </div>
        </div>
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