const CACHE = "obrona-v1";
self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(["./", "manifest.json", "icon.png"]); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});
// najpierw siec (zeby aktualizacje wchodzily), przy braku internetu — kopia z cache;
// nawigacja z pominieciem cache HTTP (GitHub Pages trzyma stara wersje do 10 min)
self.addEventListener("fetch", function (e) {
  var zapyt = e.request.mode === "navigate"
    ? fetch(e.request.url, { cache: "no-store" })
    : fetch(e.request);
  e.respondWith(
    zapyt.then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); })
  );
});
