const CACHE_NAME = "app-cache-v4";  // Cambié el nombre de la cache para evitar confusión
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/main.js",
  "/particle.js",
  "/simulation.js",
  "/vector.js",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Instalación del Service Worker y cacheo de los archivos
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log("Cache abierta");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación del Service Worker y eliminación de caches viejos
self.addEventListener("activate", function(event) {
  const cacheWhitelist = [CACHE_NAME];  // Solo mantenemos la cache actual

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Cache viejo eliminado:", cacheName);
            return caches.delete(cacheName);  // Eliminamos las caches no incluidas en la whitelist
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;  // Si hay respuesta en la cache, la devuelve.
        }
        return fetch(event.request);  // Si no, hace la petición en la red.
      })
  );
});
