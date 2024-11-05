export function getDomain() {
  if (typeof window !== 'undefined') {
    console.log('window: ', window);
    return window.location.origin;
  }
}
