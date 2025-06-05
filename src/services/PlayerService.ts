import BroadcastService, { BroadcastMessage, StateUpdatePayload } from "@/services/BroadcastService";
import { isCacheStale, loadFromLocalStorage, saveToLocalStorage } from "@/utils/chrome-storage";

import { Howl } from "howler";
import ListenerManager from "@/utils/ListenerManager";
import TimerService from "@/services/TimerService";
import { Track } from "@/api/tracks/useTracksFetch";

/**
 * PlayerService - A singleton audio player service built on top of Howler.js
 *
 * Manages audio playback with play/pause and looping functionality.
 */
class PlayerService {
  private static instance: PlayerService;

  private timerService = new TimerService();
  private broadcastService = new BroadcastService("player_channel");

  private playbackListeners = new ListenerManager<boolean>();
  private loopListeners = new ListenerManager<boolean>();
  private timerListeners = new ListenerManager<number>();

  private sound: Howl | null = null;
  private currentTrackId: string | null = null;
  private currentTrack: Track | null = null;
  private isLooping = false;
  private _isPlaying = false;

  private timerRemainingSeconds = 0;
  private isOwner = false;
  private ownerCheckTimeout: number | null = null;

  private constructor() {
    this.timerService.subscribe((remainingSeconds) => {
      this.timerRemainingSeconds = remainingSeconds;
      this.timerListeners.notify(remainingSeconds);
      if (this.isOwner) this.syncState();
    });

    this.broadcastService.subscribe(this.handleBroadcastMessage);
    this.initializeState();
    this.setupOwnerCheck();
    this.setupUnloadListener();
  }

  /**
   * Returns the singleton instance of the PlayerService.
   */
  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  /**
   * Broadcasts and saves the current playback state.
   */
  private syncState() {
    const state = this.currentState;
    saveToLocalStorage("player_state", { timestamp: Date.now(), data: state });
    this.broadcastService.broadcast({ type: "STATE_UPDATE", payload: state });
  }

  private get currentState(): StateUpdatePayload {
    return {
      isPlaying: this._isPlaying,
      trackId: this.currentTrackId,
      track: this.currentTrack || undefined,
      isLooping: this.isLooping,
      remainingTime: this.timerRemainingSeconds,
    };
  }

  /**
   * Initializes playback state from cache if available and fresh.
   * Also broadcasts a request to discover the owner tab.
   */
  private initializeState() {
    loadFromLocalStorage<{ timestamp: number, data: StateUpdatePayload }>("player_state").then((cached) => {
      if (cached && !isCacheStale(cached.timestamp, 5 * 60 * 1000)) {
        const { isPlaying, trackId, track, isLooping, remainingTime } = cached.data;
        Object.assign(this, { _isPlaying: isPlaying, currentTrackId: trackId, currentTrack: track, isLooping });
        this.timerService.setRemainingTime(remainingTime || 0);
        this.notifyAllListeners();
      }
    });
    this.broadcastService.broadcast({ type: "WHO_IS_OWNER" });
  }

  private setupOwnerCheck() {
    this.ownerCheckTimeout = window.setTimeout(() => {
      if (!this.isOwner) this.becomeOwner();
    }, 1000);
  }

  private becomeOwner() {
    this.isOwner = true;
    this.broadcastService.broadcast({ type: "SET_OWNER" });
    if (this.currentTrack) this.loadTrackInternal(this.currentTrack, this._isPlaying);
  }

  private setupUnloadListener() {
    window.addEventListener("beforeunload", () => {
      if (this.isOwner) {
        this.broadcastService.broadcast({ type: "STOP_REQUEST" });
      }
    });
  }

  /**
   * Handles incoming messages from other tabs.
   * Includes ownership negotiation, track control, and state updates.
   */
  private handleBroadcastMessage = (message: BroadcastMessage) => {
    switch (message.type) {
      case "WHO_IS_OWNER":
        if (this.isOwner) this.broadcastService.broadcast({ type: "I_AM_OWNER" });
        break;
      case "I_AM_OWNER":
      case "SET_OWNER":
        this.clearOwnerCheckTimeout();
        this.isOwner = false;
        break;
      case "PLAY_REQUEST":
        if (this.isOwner && message.payload?.trackId === this.currentTrackId) this.playInternal();
        break;
      case "PAUSE_REQUEST":
        if (this.isOwner) this.pauseInternal();
        break;
      case "STOP_REQUEST":
        if (this.isOwner) this.stopInternal();
        break;
      case "LOAD_TRACK_REQUEST":
        if (this.isOwner && message.payload) this.loadTrackInternal(message.payload.track, message.payload.autoplay);
        break;
      case "STATE_UPDATE":
        if (message.payload) this.updateStateFromMessage(message.payload);
        break;
    }
  };

  /**
   * Loads the given track.
   * Broadcasts load request if not owner; otherwise loads it directly.
   */  
  loadTrack(track: Track, autoplay = true) {
    this.currentTrack = track;
    if(this.isOwner) {
       this.loadTrackInternal(track, autoplay)
    } else {
      this.broadcastService.broadcast({ type: "LOAD_TRACK_REQUEST", payload: { track, autoplay } });
    }
  }

  /**
   * Starts playback. If not owner, sends a play request.
   */
  play() {
    if (this.isOwner) this.playInternal();
    this.broadcastService.broadcast({ type: "PLAY_REQUEST", payload: { trackId: this.currentTrackId } });
  }

  /**
   * Pauses playback. If not owner, sends a pause request.
   */  
  pause() {
    if (this.isOwner) this.pauseInternal();
    this.broadcastService.broadcast({ type: "PAUSE_REQUEST" });
  }

  /**
   * Stops playback and resets state. If not owner, sends a stop request.
   */  
  stop() {
    if (this.isOwner) this.stopInternal();
    this.broadcastService.broadcast({ type: "STOP_REQUEST" });
  }

  private loadTrackInternal(track: Track, autoplay: boolean) {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }

    this.resetState();
    this.sound = this.createHowl(track);
    this.currentTrackId = track.id;
    this.currentTrack = track;

    if(autoplay) { 
      this.playInternal() 
    } else { 
      this.updatePlayingState(false);
    }
  }

  private createHowl(track: Track): Howl {
    return new Howl({
      src: [track.stream_url],
      html5: true,
      preload: true,
      autoplay: false,
      loop: false,
      onplay: this.handlePlay,
      onpause: this.handlePause,
      onstop: this.handleStop,
      onend: this.handleEnd,
      onloaderror: (_, err) => console.error("Error loading audio:", err),
    });
  }

  private handlePlay = () => {
    this.updatePlayingState(true);
    if (this.timerRemainingSeconds > 0) this.timerService.start();
  };

  private handlePause = () => {
    this.updatePlayingState(false);
    this.timerService.stop();
  };

  private handleStop = () => {
    this.updatePlayingState(false);
    this.setRemainingTime(null);
  };

  private handleEnd = () => {
    if (this.isLooping && this.sound) this.sound.play();
    else {
      this.updatePlayingState(false);
      this.setRemainingTime(null);
    }
  };

  private playInternal() {
    if (this.sound && !this.sound.playing()) this.sound.play();
  }

  private pauseInternal() {
    if (this.sound?.playing()) this.sound.pause();
  }

  private stopInternal() {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    this.resetState();
  }

  private resetState() {
    this.currentTrackId = null;
    this.currentTrack = null;
    this.isLooping = false;
    this.updatePlayingState(false);
    this.timerService.setRemainingTime(0);
    this.loopListeners.notify(false);
  }

  private updatePlayingState(isPlaying: boolean) {
    this._isPlaying = isPlaying;
    this.playbackListeners.notify(isPlaying);
    this.syncState();
  }

  private updateStateFromMessage(payload: StateUpdatePayload) {
    Object.assign(this, {
      _isPlaying: payload.isPlaying,
      currentTrackId: payload.trackId,
      currentTrack: payload.track,
      isLooping: payload.isLooping,
    });
    this.timerService.setRemainingTime(payload.remainingTime);
    this.notifyAllListeners();

    if (this.isOwner) {
      if(payload.isPlaying && payload.remainingTime > 0) {
         this.timerService.start()
      } else {
        this.timerService.stop();
      }
    }
  }

  /**
   * Updates the timer and syncs/broadcasts remaining time.
   * 
   * @param seconds - New remaining time in seconds.
   */  
  setRemainingTime(seconds: number | null) {
    const time = seconds && seconds > 0 ? seconds : 0;
    this.timerService.setRemainingTime(time);

    if (this._isPlaying && this.isOwner && time > 0) {
      this.timerService.start();
    } else {
      this.timerService.stop();
    }

    if (this.isOwner) {
      this.syncState();
    } else {
      this.broadcastService.broadcast({
        type: "STATE_UPDATE",
        payload: this.currentState,
      });
    }
  }

  /**
   * Returns the current remaining time from the timer.
   */
  getRemainingTime() {
    return this.timerService.getRemainingTime();
  }

  /**
   * Enables or disables looping. Syncs state if owner.
   *
   * @param loop - Whether looping is enabled
   */
  setLoop(loop: boolean) {
    this.isLooping = loop;
    if (this.sound) this.sound.loop(loop);
    this.loopListeners.notify(loop);
    if (this.isOwner) this.syncState();
  }

  /**
   * Returns whether the track is currently playing.
   */
  isPlaying() {
    return this._isPlaying;
  }

  /**
   * Returns the ID of the currently loaded track.
   */
  getCurrentTrackId() {
    return this.currentTrackId;
  }

  /**
   * Returns whether looping is currently enabled.
   */
  isLoopingEnabled() {
    return this.isLooping;
  }

  private clearOwnerCheckTimeout() {
    if (this.ownerCheckTimeout) {
      clearTimeout(this.ownerCheckTimeout);
      this.ownerCheckTimeout = null;
    }
  }

  private notifyAllListeners() {
    this.playbackListeners.notify(this._isPlaying);
    this.loopListeners.notify(this.isLooping);
    this.timerListeners.notify(this.timerRemainingSeconds);
  }

  /**
   * Subscribes to play/pause state changes.
   */
  subscribeToPlayback(listener: (isPlaying: boolean) => void) {
    return this.playbackListeners.subscribe(listener);
  }

  /**
   * Subscribes to looping state changes.
   */
  subscribeToLoop(listener: (isLooping: boolean) => void) {
    return this.loopListeners.subscribe(listener);
  }

  /**
   * Subscribes to timer countdown updates.
   */
  subscribeToTimer(listener: (remainingSeconds: number) => void) {
    return this.timerListeners.subscribe(listener);
  }

  /**
   * Cleans up the player, stops audio and timers, and removes event listeners.
   */
  destroy() {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    this.timerService.stop();
    this.clearOwnerCheckTimeout();
    this.playbackListeners.notify(false);
    this.loopListeners.notify(false);
    this.timerListeners.notify(0);
    this.broadcastService.close();
  }
}

export default PlayerService.getInstance();
