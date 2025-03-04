// public/sw-manager.js
if ('serviceWorker' in navigator) {
  // Unregister all existing service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    const unregisterPromises = registrations.map(reg => {
      return reg.unregister().then(() => {
        console.log('Unregistered old SW:', reg.active ? reg.active.scriptURL : 'unknown');
      });
    });
    Promise.all(unregisterPromises).then(() => {
      // Register the new service worker
      navigator.serviceWorker.register('/new-sw/sw-v2.js', { scope: '/' })
        .then(reg => {
          console.log('New SW registered:', reg.active ? reg.active.scriptURL : 'pending');
          // If the new SW is already active, reload immediately
          if (reg.active) {
            window.location.reload();
          } else {
            // Wait for the new SW to activate, then reload
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'activated') {
                  window.location.reload();
                }
              };
            };
          }
        })
        .catch(err => console.error('SW registration failed:', err));
    });
  }).catch(err => console.error('Error getting registrations:', err));
}