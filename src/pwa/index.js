/*global navigator*/
export default class PWA 
{
    registerServiceWorker()
    {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('service-worker.js').then((reg) => {
                    console.log('Service Worker Registered')
                })
        }
    }
    
}