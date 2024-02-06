if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(new URL('sw.ts', import.meta.url), {
      type: 'module'
    });
  });
}
