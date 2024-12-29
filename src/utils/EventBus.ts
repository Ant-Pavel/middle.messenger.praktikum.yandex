export type EventBusCallback = (...args: unknown[]) => void;

interface EventBusCallbacks {
  [event: string]: EventBusCallback[]
}

export default class EventBus {
  private listeners: EventBusCallbacks;

  constructor() {
    this.listeners = {};
  }

  on(event: string, callback: EventBusCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    if (this.listeners[event].includes(callback)) return;
    this.listeners[event].push(callback);
  }

  off(event: string, callback: EventBusCallback) {
    if (!this.listeners[event]) {
      throw new Error(`off. Event ${event} is not defined`);
    }
    this.listeners[event] = this.listeners[event].filter(clb => clb !== callback);
  }

  emit(event: string, ...args: unknown[]): void {
    if (!this.listeners[event]) {
      throw new Error(`emit. Event ${event} is not defined`);
    }

    this.listeners[event].forEach(clb => clb(...args));
  }
}
