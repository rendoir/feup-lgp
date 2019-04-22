import { isPassiveListenerSupports } from "./isPassiveListenerSupports";

export function listen(
  target: Element,
  eventType: string,
  listener: EventListener,
  options: {
    passive: boolean;
    capture?: boolean;
  }
) {
  const { passive = false, capture = false } = options;
  const opts =
    passive && isPassiveListenerSupports() ? { passive, capture } : capture;

  target.addEventListener(eventType, listener, opts);

  return {
    remove() {
      target.removeEventListener(eventType, listener, opts);
    }
  };
}
