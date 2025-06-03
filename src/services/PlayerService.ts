import { Howl } from "howler";
import { Track } from "@/api/tracks/useTracksFetch";

/**
 * PlayerService - A singleton audio player service built on top of Howler.js
 *
 * Manages audio playback with play/pause and looping functionality.
 */
class PlayerService {
  private static instance: PlayerService;
  private sound: Howl | null = null;
  private currentTrackId: string | null = null;
  private isLooping: boolean = false;
  private remainingTime: number | null = null;
  private timerInterval: NodeJS.Timeout | null = null; 
  private _isPlaying: boolean = false;
  private playbackStateListeners: ((isPlaying: boolean) => void)[] = []; 
  private loopListeners: ((isLooping: boolean) => void)[] = []; 
  private timerListeners: ((remainingTime: number | null) => void)[] = []; 

  private constructor() {}

  /**
   * Gets the singleton instance of PlayerService
   * @returns {PlayerService} The singleton instance
   */
  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  /**
   * Loads and plays a new audio track
   * @param {Track} track - The track object containing audio metadata and URL
   * @param {boolean} autoplay - Whether to automatically play the track after loading
   * @returns {Howl} The Howl instance for the loaded track
   */
  loadTrack(track: Track, autoplay = true) {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
    }

    this.sound = new Howl({
      src: [track.stream_url],
      html5: true,
      preload: true,
      autoplay,
      loop: this.isLooping,
      onplay: () => this.updatePlayingState(true),
      onpause: () => this.updatePlayingState(false),
      onstop: () => this.updatePlayingState(false),
      onend: () => this.updatePlayingState(false),
      onloaderror: (_, error) => {
        console.error("Error loading audio:", error);
      },
    });

    this.currentTrackId = track.id; // Store the track ID when loading
    return this.sound;
  }

  /**
   * Plays the current track
   */
  play() {
    if (this.sound && !this.sound.playing()) {
      this.sound.play();
      this.startTimer();
      this.updatePlayingState(true);
    }

    if (this.remainingTime !== null && this.remainingTime > 0) {
      this.startTimer();
    }
  }

  /**
   * Pauses the current track
   */
  pause() {
    if (this.sound && this.sound.playing()) {
      this.sound.pause();
      this.updatePlayingState(false);
      this.stopTimer();
    }
  }

  /**
   * Checks if the current track is playing
   * @returns {boolean} True if playing, false otherwise
   */
  isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Gets the current track ID
   * @returns {string | null} The current track ID or null if no track is loaded
   */
  getCurrentTrackId(): string | null {
    return this.currentTrackId;
  }

  /**
   * Sets whether the current track should loop
   * @param {boolean} loop - True to enable looping, false to disable
   */
  setLoop(loop: boolean) {
    this.isLooping = loop;
    if (this.sound) {
      this.sound.loop(loop);
    }
    this.notifyLoopListeners();
  }

  /**
   * Sets the remaining time for the current track
   * @param {number | null} seconds - The remaining time in seconds, or null to stop the timer
   */
  setRemainingTime(seconds: number | null) {
    this.remainingTime = seconds;
    this.notifyTimerListeners();

    if (this._isPlaying && seconds !== null && seconds > 0) {
      this.startTimer();
    } else {
      this.stopTimer(); 
    }
  }

  /**
   * Gets the remaining time of the current track
   * @returns {number | null} The remaining time in seconds, or null if not set
   */
  getRemainingTime(): number | null {
    return this.remainingTime;
  }

  /**
   * Starts a timer that counts down the remaining time of the current track
   * This method is called when the track is playing and has a valid remaining time
   */
  private startTimer() {
    if (!this._isPlaying || this.remainingTime === null || this.remainingTime <= 0 || this.timerInterval) {
      return;
    }

    this.timerInterval = setInterval(() => {
      if (this.remainingTime !== null && this.remainingTime > 0) {
        this.remainingTime -= 1;
        this.notifyTimerListeners();

        if (this.remainingTime === 0) {
          this.setLoop(false);
          this.stopTimer();
        }
      }
    }, 1000);
  }

  /**
   * Stops the timer if it is running
   */
  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Checks if looping is enabled
   * @returns {boolean} True if looping is enabled, false otherwise
   */
  isLoopingEnabled(): boolean {
    return this.isLooping;
  }

  /**
   * Cleans up the current audio instance
   */
  destroy() {
    if (this.sound) {
      this.sound.stop();
      this.sound.unload();
      this.sound = null;
    }
    this.currentTrackId = null;
    this.isLooping = false;
    this._isPlaying = false;
    this.remainingTime = null;
    this.notifyLoopListeners();
    this.notifyTimerListeners();
    this.playbackStateListeners.forEach((listener) => listener(false));
  }

  // Notify listeners of playback state changes
  private updatePlayingState(isPlaying: boolean) {
    this._isPlaying = isPlaying;
    this.playbackStateListeners.forEach((listener) => listener(isPlaying));
  }

  /**
   * Notifies all subscribed listeners about the current playback state
   * This is called whenever the playback state changes
   */
  private notifyLoopListeners() {
    this.loopListeners.forEach((listener) => listener(this.isLooping));
  }

  /**
   * Notifies all subscribed listeners about the current remaining time
   * This is called whenever the remaining time changes
   */
  private notifyTimerListeners() {
    this.timerListeners.forEach((listener) => listener(this.remainingTime));
  }

  // Allow components to subscribe to playback state changes
  subscribe(listener: (isPlaying: boolean) => void) {
    this.playbackStateListeners.push(listener);
    return () => {
      this.playbackStateListeners = this.playbackStateListeners.filter((l) => l !== listener);
    };
  }

  // Allow components to subscribe to looping state changes
  subscribeToLoop(listener: (isLooping: boolean) => void) {
    this.loopListeners.push(listener);
    return () => {
      this.loopListeners = this.loopListeners.filter((l) => l !== listener);
    };
  }

  // Allow components to subscribe to timer updates
  subscribeToTimer(listener: (remainingTime: number | null) => void) {
    this.timerListeners.push(listener);
    return () => {
      this.timerListeners = this.timerListeners.filter((l) => l !== listener);
    };
  }
}

export default PlayerService.getInstance();