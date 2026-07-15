import React, { useEffect, useRef, useState, useMemo } from "react";
import { Mic, MicOff, Video, VideoOff, Clock, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingLobbyProps {
    lobbySecondsLeft: number;
    consultation: any;
    onLeave: () => void;
}

export function MeetingLobby({ lobbySecondsLeft, consultation, onLeave }: MeetingLobbyProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [micEnabled, setMicEnabled] = useState(true);

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
    const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");

    const mins = Math.floor(lobbySecondsLeft / 60);
    const secs = lobbySecondsLeft % 60;
    const countdownStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const scheduledTime = consultation.scheduledTime || "";
    const timezone = consultation.timezone || "";

    // Extract Dentist details
    const dentistUser = consultation.dentist?.user;
    const dentistDirectory = consultation.dentist?.dentistDirectory || consultation.directoryEntry;
    const doctorName = dentistUser
        ? `Dr. ${dentistUser.firstName} ${dentistUser.lastName}`.trim()
        : (dentistDirectory?.name ? `Dr. ${dentistDirectory.name}` : "Dentist");
    const doctorSpecialty = dentistDirectory?.specialty || "General Dentist";
    const doctorImage = dentistUser?.image || dentistDirectory?.image || "/images/dentist.png";

    // Extract Patient details
    const patientUser = consultation.patient?.user;
    const patientName = patientUser
        ? `${patientUser.firstName} ${patientUser.lastName}`.trim()
        : "Patient";
    const patientImage = patientUser?.image || "/images/man-avatar.png";

    useEffect(() => {
        let activeStream: MediaStream | null = null;

        async function initLobbyMedia() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                activeStream = stream;
                localStreamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                const allDevices = await navigator.mediaDevices.enumerateDevices();
                setDevices(allDevices);

                const firstCam = allDevices.find((d) => d.kind === "videoinput");
                const firstMic = allDevices.find((d) => d.kind === "audioinput");
                if (firstCam) setSelectedVideoDevice(firstCam.deviceId);
                if (firstMic) setSelectedAudioDevice(firstMic.deviceId);
            } catch (err) {
                console.error("Error initializing lobby media:", err);
                try {
                    const allDevices = await navigator.mediaDevices.enumerateDevices();
                    setDevices(allDevices);
                } catch (_) { }
            }
        }

        initLobbyMedia();

        return () => {
            if (activeStream) {
                activeStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const videoDevices = useMemo(() => devices.filter((d) => d.kind === "videoinput"), [devices]);
    const audioDevices = useMemo(() => devices.filter((d) => d.kind === "audioinput"), [devices]);

    const toggleCamera = () => {
        const nextVal = !cameraEnabled;
        setCameraEnabled(nextVal);
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach((track) => {
                track.enabled = nextVal;
            });
        }
    };

    const toggleMic = () => {
        const nextVal = !micEnabled;
        setMicEnabled(nextVal);
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach((track) => {
                track.enabled = nextVal;
            });
        }
    };

    const switchVideoDevice = async (deviceId: string) => {
        setSelectedVideoDevice(deviceId);
        if (!cameraEnabled) return;
        try {
            if (localStreamRef.current) {
                const currentVideoTrack = localStreamRef.current.getVideoTracks()[0];
                if (currentVideoTrack) {
                    currentVideoTrack.stop();
                    localStreamRef.current.removeTrack(currentVideoTrack);
                }
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } },
            });
            const newVideoTrack = newStream.getVideoTracks()[0];
            if (newVideoTrack && localStreamRef.current) {
                localStreamRef.current.addTrack(newVideoTrack);
                if (videoRef.current) {
                    videoRef.current.srcObject = localStreamRef.current;
                }
            }
        } catch (err) {
            console.error("Failed to switch video device:", err);
        }
    };

    const switchAudioDevice = async (deviceId: string) => {
        setSelectedAudioDevice(deviceId);
        if (!micEnabled) return;
        try {
            if (localStreamRef.current) {
                const currentAudioTrack = localStreamRef.current.getAudioTracks()[0];
                if (currentAudioTrack) {
                    currentAudioTrack.stop();
                    localStreamRef.current.removeTrack(currentAudioTrack);
                }
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: { exact: deviceId } },
            });
            const newAudioTrack = newStream.getAudioTracks()[0];
            if (newAudioTrack && localStreamRef.current) {
                localStreamRef.current.addTrack(newAudioTrack);
            }
        } catch (err) {
            console.error("Failed to switch audio device:", err);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start lg:justify-center bg-linear-to-br from-[#0B0F19] via-[#0F172A] to-[#0A0D14] pt-6 pb-12 px-4 sm:px-6 md:px-8 text-white font-sans overflow-y-auto">
            <div className="w-full max-w-6xl flex flex-col space-y-6">
                {/* Header or back link */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[#113254]/40 border border-[#113254] flex items-center justify-center">
                            <span className="text-white font-black text-sm tracking-widest">RD</span>
                        </div>
                        <h1 className="text-lg font-bold text-slate-100">RatedDocs Consultation</h1>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                        Lobby Active
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Video Preview and Controls */}
                    <div className="lg:col-span-7 flex flex-col space-y-5">
                        <div className="relative aspect-video w-full rounded-2xl border border-slate-800 bg-[#070A11] overflow-hidden shadow-2xl flex items-center justify-center group">
                            {/* Video stream */}
                            {cameraEnabled ? (
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover scale-x-[-1] rounded-2xl"
                                    autoPlay
                                    playsInline
                                    muted
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="size-28 rounded-full border-2 border-slate-800 bg-[#0E1320] overflow-hidden flex items-center justify-center shadow-2xl">
                                        <img
                                            src={patientImage}
                                            alt={patientName}
                                            className="size-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "/images/man-avatar.png";
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium">Camera is turned off</p>
                                </div>
                            )}

                            {/* Overlay floating controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-800/80 shadow-lg z-20">
                                <button
                                    onClick={toggleMic}
                                    className={`size-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${micEnabled
                                        ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                        }`}
                                    title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                                >
                                    {micEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}
                                </button>
                                <button
                                    onClick={toggleCamera}
                                    className={`size-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${cameraEnabled
                                        ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                                        : "bg-red-500 hover:bg-red-600 text-white"
                                        }`}
                                    title={cameraEnabled ? "Turn off Camera" : "Turn on Camera"}
                                >
                                    {cameraEnabled ? <Video className="size-5" /> : <VideoOff className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Device select options */}
                        <div className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 items-center gap-1">
                                    <Video className="size-3" /> Camera Source
                                </label>
                                <select
                                    value={selectedVideoDevice}
                                    onChange={(e) => switchVideoDevice(e.target.value)}
                                    className="w-full h-9 rounded-lg border border-slate-800 bg-[#0E1320] px-3 text-[12px] text-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer"
                                >
                                    {videoDevices.map((d) => (
                                        <option key={d.deviceId} value={d.deviceId} className="bg-[#0B0F19]">
                                            {d.label || `Camera ${d.deviceId.slice(0, 5)}`}
                                        </option>
                                    ))}
                                    {videoDevices.length === 0 && <option value="" className="bg-[#0B0F19]">No camera detected</option>}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 items-center gap-1">
                                    <Mic className="size-3" /> Microphone Source
                                </label>
                                <select
                                    value={selectedAudioDevice}
                                    onChange={(e) => switchAudioDevice(e.target.value)}
                                    className="w-full h-9 rounded-lg border border-slate-800 bg-[#0E1320] px-3 text-[12px] text-slate-300 focus:border-blue-500 focus:outline-none cursor-pointer"
                                >
                                    {audioDevices.map((d) => (
                                        <option key={d.deviceId} value={d.deviceId} className="bg-[#0B0F19]">
                                            {d.label || `Microphone ${d.deviceId.slice(0, 5)}`}
                                        </option>
                                    ))}
                                    {audioDevices.length === 0 && <option value="" className="bg-[#0B0F19]">No microphone detected</option>}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Room Details and Countdown card */}
                    <div className="lg:col-span-5 flex flex-col space-y-6">
                        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col space-y-6">
                            {/* Dentist Card info */}
                            <div className="flex items-center gap-4 bg-slate-950/40 border border-slate-850/50 p-4 rounded-xl">
                                <img
                                    src={doctorImage}
                                    alt={doctorName}
                                    className="size-14 rounded-full border border-slate-700 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/images/dentist.png";
                                    }}
                                />
                                <div>
                                    <h3 className="font-bold text-slate-100">{doctorName}</h3>
                                    <p className="text-xs text-slate-400">{doctorSpecialty}</p>
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-100">Ready to join?</h2>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    The consultation room is not open yet. Check your hardware settings on the left.
                                </p>
                            </div>

                            {/* Circular Digital Countdown */}
                            <div className="flex flex-col items-center justify-center py-4 relative">
                                <div className="size-36 rounded-full border-[6px] border-slate-800 border-t-blue-500 animate-[spin_60s_linear_infinite] absolute inset-0 m-auto" />
                                <div className="size-32 rounded-full bg-[#0E1320] flex flex-col items-center justify-center shadow-inner z-10">
                                    <span className="text-3xl font-black text-blue-400 tabular-nums tracking-tight">
                                        {countdownStr}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">
                                        Remaining
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-850/50 px-4 py-3 rounded-lg text-xs">
                                    <Clock className="size-4 text-blue-400 shrink-0" />
                                    <div className="text-left text-slate-300">
                                        Starts at <span className="text-white font-semibold">{scheduledTime}</span> ({timezone})
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 py-2.5 rounded-lg">
                                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                                    Waiting for meeting to start...
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    variant="outline"
                                    onClick={onLeave}
                                    className="w-full h-11 border-slate-800 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white transition-all rounded-lg flex items-center justify-center gap-2 text-xs font-bold"
                                >
                                    <LogOut className="size-4" /> Leave Lobby
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}