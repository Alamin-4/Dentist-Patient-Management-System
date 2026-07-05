import { useEffect, useState, useRef } from "react";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";

export function useConsultationSession(slug: string, userId: string | undefined, isDetailsMode: boolean) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [serverUrl, setServerUrl] = useState<string | null>(null);
    const [consultation, setConsultation] = useState<any>(null); // Replace 'any' with your Consultation type
    const [lobbySecondsLeft, setLobbySecondsLeft] = useState<number>(0);
    const lobbyIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!slug) return;

        async function fetchToken(consultationId: string) {
            try {
                const tokenRes = await api.get(endpoints.consultations.token(consultationId));
                const tokenData = tokenRes.data?.data;
                if (!tokenData?.token) throw new Error("Could not fetch video room token.");
                setToken(tokenData.token);
                setServerUrl(tokenData.serverUrl);
                setLoading(false);
            } catch (err: any) {
                const backendMsg = err?.response?.data?.message || err?.message || "Failed to join consultation session.";
                setError(backendMsg);
                setLoading(false);
            }
        }

        async function initSession() {
            try {
                setLoading(true);
                setError(null);

                const detailsRes = await api.get(endpoints.consultations.byId(slug));
                const data = detailsRes.data?.data;
                if (!data) throw new Error("Could not find consultation record.");
                setConsultation(data);

                if (isDetailsMode) {
                    setLoading(false);
                    return;
                }

                const scheduledUtc = data.scheduledDate ? new Date(data.scheduledDate).getTime() : null;
                const nowUtc = Date.now();
                const earlyMs = 5 * 60 * 1000;

                if (scheduledUtc && nowUtc < scheduledUtc && nowUtc >= scheduledUtc - earlyMs) {
                    const secsLeft = Math.ceil((scheduledUtc - nowUtc) / 1000);
                    setLobbySecondsLeft(secsLeft);
                    setLoading(false);

                    lobbyIntervalRef.current = setInterval(() => {
                        setLobbySecondsLeft((prev) => {
                            const next = prev - 1;
                            if (next <= 0) {
                                clearInterval(lobbyIntervalRef.current!);
                                lobbyIntervalRef.current = null;
                                fetchToken(data.id);
                                return 0;
                            }
                            return next;
                        });
                    }, 1000);
                } else {
                    await fetchToken(data.id);
                }
            } catch (err: any) {
                console.error("Initialization error:", err);
                const backendMsg = err?.response?.data?.message || err?.message || "Failed to join consultation session.";
                setError(backendMsg);
                setLoading(false);
            }
        }

        if (userId) {
            initSession();
        }

        return () => {
            if (lobbyIntervalRef.current) clearInterval(lobbyIntervalRef.current);
        };
    }, [slug, userId, isDetailsMode]);

    return { loading, error, token, serverUrl, consultation, lobbySecondsLeft };
}