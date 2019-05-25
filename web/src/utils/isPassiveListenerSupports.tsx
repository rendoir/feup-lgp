let isSupports = false;

try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      isSupports = true;
      return true;
    }
  });

  // @ts-ignore
  window.addEventListener('test', null, opts);
} catch (e) {
  // do nothing
}

export function isPassiveListenerSupports(): boolean {
  return isSupports;
}
