type Listener<T> = (data: T) => void;

class ListenerManager<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(data: T) {
    this.listeners.forEach((listener) => listener(data));
  }
}

export default ListenerManager;
