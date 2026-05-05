import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(__dirname, "..");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function resolveRequestPath(url) {
  const parsedUrl = new URL(url, `http://localhost:${port}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const requestedPath = pathname === "/" ? "/html/index.html" : pathname;
  const normalizedPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  return join(root, normalizedPath);
}

function findFilePath(url) {
  const filePath = resolveRequestPath(url);

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  const parsedUrl = new URL(url || "/", `http://localhost:${port}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const htmlAlias = pathname.match(/^\/[^/]+\.html$/);

  if (htmlAlias) {
    const aliasPath = join(root, "html", pathname.slice(1));
    if (existsSync(aliasPath) && statSync(aliasPath).isFile()) {
      return aliasPath;
    }
  }

  if (pathname === "/firebase.js") {
    const firebasePath = join(root, "html", "firebase.js");
    if (existsSync(firebasePath) && statSync(firebasePath).isFile()) {
      return firebasePath;
    }
  }

  return filePath;
}

const server = createServer((req, res) => {
  try {
    const filePath = findFilePath(req.url || "/");
    const resolvedPath = resolve(filePath);

    if (!resolvedPath.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    if (!existsSync(resolvedPath) || !statSync(resolvedPath).isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const contentType = mimeTypes[extname(resolvedPath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    createReadStream(resolvedPath).pipe(res);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`smartBin is running at http://localhost:${port}`);
  console.log("Press Ctrl+C to stop the server.");
});
