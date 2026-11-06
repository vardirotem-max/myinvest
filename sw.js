// MyInvest permanent-link service worker: receives Web Push notifications.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
    let data = {};
    try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
    const title = data.title || 'MyInvest';
    event.waitUntil(self.registration.showNotification(title, {
        body: data.body || '',
        tag: data.tag || undefined,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        lang: 'he',
        dir: 'rtl',
        data: { url: data.url || '/' }
    }));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const go = (event.notification.data && event.notification.data.url) || '/';
    const target = new URL('./?go=' + encodeURIComponent(go), self.registration.scope).href;
    event.waitUntil((async () => {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const w of wins) { if ('focus' in w) { try { await w.navigate(target); } catch (e) {} return w.focus(); } }
        return self.clients.openWindow(target);
    })());
});
