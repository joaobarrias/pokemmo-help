// public/sw-clear.js
if ('serviceWorker' in navigator) {
    // Clear all existing service workers
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      const unregisterPromises = registrations.map(reg => {
        return reg.unregister().then(() => {
          console.log('Unregistered old SW:', reg.active ? reg.active.scriptURL : 'unknown');
        });
      });
      // Wait for all unregistrations, then register new SW
      Promise.all(unregisterPromises).then(() => {
        navigator.serviceWorker.register('/sw-v2.js', { scope: '/' })
          .then(reg => {
            console.log('New SW registered:', reg.active ? reg.active.scriptURL : 'pending');
            // Force page reload after new SW is active
            if (!reg.active) {
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