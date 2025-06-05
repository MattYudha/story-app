import { initRouter } from './router.js';
import { initDB } from './db.js';
import { Workbox } from 'workbox-window';

async function init() {
  await initDB();
  initRouter();

  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New app update is available! Click OK to refresh.')) {
          window.location.reload();
        }
      }
    });

    wb.register();
  }
}

init();