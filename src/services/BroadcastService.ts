import { Track } from "@/api/tracks/useTracksFetch";

type StateUpdatePayload = {
  isPlaying: boolean;
  trackId: string | null;
  track?: Track;
  isLooping: boolean;
  remainingTime: number;
};

type BroadcastMessage =
  | { type: "PLAY_REQUEST"; payload?: { trackId: string | null } }
  | { type: "PAUSE_REQUEST" }
  | { type: "STOP_REQUEST" }
  | { type: "LOAD_TRACK_REQUEST"; payload: { track: Track; autoplay: boolean } }
  | { type: "STATE_UPDATE"; payload: StateUpdatePayload }
  | { type: "SET_OWNER" }
  | { type: "WHO_IS_OWNER" }
  | { type: "I_AM_OWNER" };

type BroadcastListener = (message: BroadcastMessage) => void;

class BroadcastService {
  private channel: BroadcastChannel;
  private listeners: BroadcastListener[] = [];
  private isOpen: boolean = true;

  constructor(channelName: string) {
    this.channel = new BroadcastChannel(channelName);
    this.channel.onmessage = this.handleMessage;
  }

  // Broadcast a message to all tabs
  broadcast(message: BroadcastMessage) {
    if (this.isOpen) {
      this.channel.postMessage(message);
    }
  }

  // Subscribe to incoming messages
  subscribe(listener: BroadcastListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Close the channel
  close() {
    this.channel.close();
    this.isOpen = false;
  }

  // Handle incoming messages
  private handleMessage = (event: MessageEvent) => {
    const message: BroadcastMessage = event.data;
    this.listeners.forEach((listener) => listener(message));
  };
}

export default BroadcastService;
export type { BroadcastMessage, StateUpdatePayload };