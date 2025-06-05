type TimerListener = (remainingSeconds: number) => void;

class TimerService {
  private timerId: NodeJS.Timeout | null = null;
  private remainingSeconds: number = 0;
  private listeners: TimerListener[] = [];

  constructor(initialSeconds: number = 0) {
    this.remainingSeconds = initialSeconds;
  }

  start() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds -= 1;
        this.notifyListeners();
      }

      if (this.remainingSeconds <= 0) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notifyListeners();
  }

  setRemainingTime(seconds: number) {
    this.remainingSeconds = Math.max(0, seconds);
    if (this.remainingSeconds === 0) {
      this.stop();
    }
    this.notifyListeners();
  }

  getRemainingTime() {
    return this.remainingSeconds;
  }

  subscribe(listener: TimerListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.remainingSeconds));
  }
}

export default TimerService;
