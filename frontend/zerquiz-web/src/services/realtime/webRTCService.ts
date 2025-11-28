export type CallType = "audio" | "video";

export interface WebRTCSessionEvents {
  connected: () => void;
  disconnected: () => void;
  "local-stream": (stream: MediaStream) => void;
  "remote-stream": (stream: MediaStream) => void;
  error: (error: Error) => void;
}

type EventKeys = keyof WebRTCSessionEvents;

class SimpleEmitter {
  private listeners = new Map<string, Set<(...args: any[]) => void>>();

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    return this;
  }

  off(event: string, listener: (...args: any[]) => void) {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((listener) => listener(...args));
  }
}

export class WebRTCSession extends SimpleEmitter {
  private peer: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private callType: CallType = "audio";
  private isActive = false;

  constructor() {
    super();
  }

  async start(callType: CallType = "audio") {
    this.callType = callType;
    try {
      this.peer = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });

      this.peer.addEventListener("iceconnectionstatechange", () => {
        if (!this.peer) return;
        if (this.peer.iceConnectionState === "connected") {
          this.emit("connected");
        }
        if (
          ["disconnected", "failed", "closed"].includes(
            this.peer.iceConnectionState
          )
        ) {
          this.end();
        }
      });

      this.peer.addEventListener("track", (event) => {
        const [stream] = event.streams;
        if (stream) {
          this.remoteStream = stream;
          this.emit("remote-stream", stream);
        }
      });

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });

      this.localStream.getTracks().forEach((track) => {
        this.peer?.addTrack(track, this.localStream!);
      });

      this.emit("local-stream", this.localStream);

      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(offer);

      // Loopback for demo – set remote description to same offer
      await this.peer.setRemoteDescription(offer);

      this.isActive = true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.emit("error", err);
      this.end();
    }
  }

  toggleTrack(kind: "audio" | "video", enabled: boolean) {
    const tracks =
      kind === "audio"
        ? this.localStream?.getAudioTracks()
        : this.localStream?.getVideoTracks();
    tracks?.forEach((track) => {
      track.enabled = enabled;
    });
  }

  async switchCamera() {
    if (this.callType !== "video") return;
    if (!this.localStream) return;
    this.localStream.getVideoTracks().forEach((track) => track.stop());
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const videoTrack = newStream.getVideoTracks()[0];
    const sender = this.peer
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    sender?.replaceTrack(videoTrack);

    this.localStream.removeTrack(this.localStream.getVideoTracks()[0]);
    this.localStream.addTrack(videoTrack);
    this.emit("local-stream", this.localStream);
  }

  end() {
    if (!this.isActive) return;
    this.isActive = false;
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.localStream = null;
    this.remoteStream = null;
    this.peer?.close();
    this.peer = null;
    this.emit("disconnected");
  }

  override on<T extends EventKeys>(event: T, listener: WebRTCSessionEvents[T]) {
    return super.on(event, listener);
  }

  emit<T extends EventKeys>(event: T, ...args: Parameters<WebRTCSessionEvents[T]>) {
    super.emit(event, ...(args as []));
  }
}

export const webRTCService = {
  createSession() {
    return new WebRTCSession();
  },
};

