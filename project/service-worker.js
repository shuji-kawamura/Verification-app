const CACHE_NAME = "container-app-v4";

const urlsToCache = [
  "/",
  "/index.html",
  "/tf.min.js",
  "/teachablemachine-image.min.js",
  "/model.json",
  "/metadata.json",
  "/weights.bin"
];

// インストール
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// アクティベート
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// 🔥 ここが最重要（ナビゲーション制御）
self.addEventListener("fetch", event => {

  // 👉 ページ遷移（indexアクセス）を全部奪う
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html")
    );
    return;
  }

  // 👉 JS・モデルなどはキャッシュ優先
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
