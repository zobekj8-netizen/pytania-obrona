const CACHE = "obrona-v1";
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(["./", "manifest.json", "icon.png"]); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});
// najpierw siec (zeby aktualizacje wchodzily), przy braku internetu — kopia z cache
self.addEventListener("fetch", function (e) {
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); })
  );
});
