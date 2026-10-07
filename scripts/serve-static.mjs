#!/usr/bin/env node
/**
 * Minimal static server that mimics GitHub Pages for a Next.js export:
 *   node scripts/serve-static.mjs [dir=out] [port=3100] [basePath=/space-portfolio]
 * - serves <dir> under <basePath>
 * - directory requests get index.html; extensionless paths try <path>.html
 * - a directory requested without a trailing slash redirects to the slash form
 * - unknown paths get 404.html with status 404
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";

const [dirArg = "out", portArg = "3100", baseArg = ""] = process.argv.slice(2);
const dir = path.resolve(dirArg);
const port = Number(portArg);
const basePath = baseArg.replace(/\/$/, "");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json",
};

function send(res, file, status = 200) {
  res.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let p = decodeURIComponent(url.pathname);
    if (basePath) {
      if (p === basePath) {
        res.writeHead(301, { location: `${basePath}/` });
        return res.end();
      }
      if (!p.startsWith(`${basePath}/`)) {
        res.writeHead(404, { "content-type": "text/plain" });
        return res.end("outside base path");
      }
      p = p.slice(basePath.length);
    }
    const target = path.join(dir, p);
    if (!target.startsWith(dir)) {
      res.writeHead(403);
      return res.end();
    }
    if (existsSync(target) && statSync(target).isDirectory()) {
      if (!p.endsWith("/")) {
        res.writeHead(301, { location: `${basePath}${p}/` });
        return res.end();
      }
      const index = path.join(target, "index.html");
      if (existsSync(index)) return send(res, index);
    } else if (existsSync(target)) {
      return send(res, target);
    } else if (existsSync(`${target}.html`)) {
      return send(res, `${target}.html`);
    }
    const notFound = path.join(dir, "404.html");
    if (existsSync(notFound)) return send(res, notFound, 404);
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
  })
  .listen(port, "127.0.0.1", () => console.log(`serving ${dir} at http://127.0.0.1:${port}${basePath}/`));
