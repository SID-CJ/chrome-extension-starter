import { Track } from "@/api/tracks/useTracksFetch";
import { Howl } from "howler";

/**
 * PlayerService - A singleton audio player service built on top of Howler.js
 *
 * Manages audio playback with play/pause and looping functionality.
 */
class PlayerService {
  private static instance: PlayerService;
  private sound: Howl | null = null;
  private currentTrackId: string | null = null; // Store the current track ID
  private isLooping: boolean = false; // New property to track looping state

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
      loop: this.isLooping, // Apply current looping state when loading
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
    }
  }

  /**
   * Pauses the current track
   */
  pause() {
    if (this.sound && this.sound.playing()) {
      this.sound.pause();
    }
  }

  /**
   * Checks if the current track is playing
   * @returns {boolean} True if playing, false otherwise
   */
  isPlaying(): boolean {
    return this.sound ? this.sound.playing() : false;
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
      this.sound.loop(loop); // Update the Howl instance's loop setting
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
    this.currentTrackId = null; // Clear the track ID on destroy
    this.isLooping = false; // Reset looping state
  }
}

export default PlayerService.getInstance();