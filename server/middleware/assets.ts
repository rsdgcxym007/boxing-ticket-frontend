export default defineEventHandler(async (event) => {
  const url = event.node.req.url || "";

  // Set proper MIME types for static assets
  if (url.endsWith(".css")) {
    setHeader(event, "content-type", "text/css; charset=utf-8");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".js") || url.endsWith(".mjs")) {
    setHeader(event, "content-type", "application/javascript; charset=utf-8");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".svg")) {
    setHeader(event, "content-type", "image/svg+xml");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".png")) {
    setHeader(event, "content-type", "image/png");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
    setHeader(event, "content-type", "image/jpeg");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".ico")) {
    setHeader(event, "content-type", "image/x-icon");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".woff2") || url.includes(".woff2.")) {
    setHeader(event, "content-type", "font/woff2");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".woff")) {
    setHeader(event, "content-type", "font/woff");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".ttf") || url.includes(".woff2.ttf")) {
    setHeader(event, "content-type", "font/ttf");
    setHeader(event, "cache-control", "max-age=31536000");
  } else if (url.endsWith(".otf")) {
    setHeader(event, "content-type", "font/otf");
    setHeader(event, "cache-control", "max-age=31536000");
  }
});
