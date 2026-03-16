export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = '/service-worker.js';
            navigator.serviceWorker
                .register(swUrl)
                .then(() => {
                    // ServiceWorker registered successfully
                })
                .catch((error) => {
                    console.error('ServiceWorker registration failed: ', error);
                });
        });
    }
};

export const unregisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister();
            })
            .catch((error) => {
                console.error(error.message);
            });
    }
};
