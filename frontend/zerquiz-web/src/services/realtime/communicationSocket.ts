type Listener<T> = (payload: T) => void;

export type CommunicationSocketEvent =
  | { type: "message:created"; message: any }
  | { type: "conversation:updated"; conversation: any }
  | { type: "status:changed"; userId: string; status: string };

export class MockCommunicationSocket {
  private listeners = new Set<Listener<CommunicationSocketEvent>>();
  private interval: number | null = null;

  constructor() {
    this.interval = window.setInterval(() => {
      this.emit({
        type: "status:changed",
        userId: "u2",
        status: Math.random() > 0.5 ? "online" : "away",
      });
    }, 15000);
  }

  subscribe(listener: Listener<CommunicationSocketEvent>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(event: CommunicationSocketEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  close() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.listeners.clear();
  }
}

export const communicationSocket = new MockCommunicationSocket();

