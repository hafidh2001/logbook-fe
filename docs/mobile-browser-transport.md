# Mobile browser transport: verified CORS failure and deployment

## Actual failure

Reference Mobile `C:/Data/Driya/logbook/src/api/masterApi.ts` and this Web implementation both use JSON POST to `https://hachi.kelava.id/index.php?r=apiMobileService/getLogbookFormMetadata` with `{id_client,id_action}`. React Native's native fetch does not enforce browser CORS. Browser JSON POST across origins first sends OPTIONS.

Read-only probes with Origin `http://127.0.0.1:5178`, requested method POST and requested header content-type established:

| Request | Status | Content-Type | Access-Control-Allow-Origin |
|---|---|---|---|
| metadata OPTIONS | 400 | application/json | one `*` header |
| notification OPTIONS (no actor payload) | 200 | application/json; charset=utf-8 | one `*` header |
| metadata JSON POST, client 1/action 29 | 404 | application/json | one `*` header |
| metadata form-urlencoded POST, same pair | 400 | application/json | one `*` header |

No redirects/Location or duplicate Allow-Origin headers were observed; Allow-Headers was `*`; Allow-Methods was absent. Metadata OPTIONS returns a non-2xx status, so the browser blocks its actual JSON POST. The supplied latest controllers decode `php://input` as JSON immediately; empty OPTIONS fails this parser. Notification OPTIONS's 200 explains why that endpoint can work. This is not an observed WAF/case-sensitive-route 403. Do not rename these routes.

Form-urlencoded is NOT a solution: the actual handler rejects it. Keep JSON and nested payload contracts intact. The direct metadata JSON POST's 404 is a separate, real business response: `Action tidak ditemukan untuk client ini.` Do not infer that action 29 is invalid for the user's actual tenant; we did not inspect their session or guess their actor/client. Tenant 1's read-only public action catalog supplied action 13; a real browser metadata POST for that authoritative pair succeeded with matching returned action ID. No returned person names/options were saved or printed.

## Changes

- `src/mobile/api.ts`: same-origin `/mobile-api/index.php?r=apiMobileService/` in dev and built production; JSON remains unchanged. Distinguish observable HTTP/non-JSON gateway failures from no-response network/CORS failures. JSON fetch refuses redirects and omits credentials.
- `vite.config.ts`: fixed HTTPS Hachi upstream, TLS verification, only `/mobile-api/index.php` + one apiMobileService action + optional upload identity query, GET/POST/OPTIONS only. No target/host arguments, no generic PHP/file proxy, no path/controller override. Strip all request headers except transport/JSON headers, strip upstream Set-Cookie, disable cache, reject redirects. Preserve the PHP `r` query and existing WAF-safe operation names (`saveLogbookUpdate`, `archiveLogbook`).
- Upload capability GET and multipart XHR use the SAME exported API base, including Before/After groups. Existing body/contract/header negotiation is retained. Capability GET refuses redirects. File/download URL resolution remains `https://hachi.kelava.id/`, NOT the proxy prefix. No live upload was performed.
- `VITE_MOBILE_API_URL` accepts exactly the same-origin base above or the explicitly chosen legacy Hachi URL. Arbitrary origins/credentials/controllers are rejected; no automatic host fallback. An explicit direct-Hachi override still needs correct server CORS and recreates this failure until upstream handles OPTIONS.

## Local usage

The existing Vite server at 5178 automatically restarted after config edits. Real browser tests and HTTP route-guard tests passed on that SAME port; no manual restart is currently required. Refresh/retry the page. No unknown PID was stopped. If a different session does not pick up config, stop only your own dev command and run `npm run dev -- --host 127.0.0.1 --port 5178`. Remove an old direct-Hachi `VITE_MOBILE_API_URL` override (then restart that own dev command) to use the default proxy.

## Production deployment (NOT performed)

A built `dist/` cannot provide Vite's development proxy. Configure the Web deployment server BEFORE serving this build:

1. Include `C:/Data/code/logbook-fe/docs/deployment/mobile-api.nginx.conf` inside the HTTPS server block serving `dist/`. It has an exact PHP location and fixed Hachi target, preserves query arguments, strips all incoming cookies/auth/other headers, hides Set-Cookie, verifies upstream TLS, rejects redirects, and retains upload capability response headers and multipart bodies. It does not grant extra backend permissions.
2. Review the 55m request limit and 190s upload timeouts against deployed PHP/upload limits; adjust only to the actual supported policy. Check the CA bundle path for the target Linux distribution. Do not include this fragment in a PHP handler or use a variable/user-supplied upstream.
3. Run `nginx -t` on the actual deployment host and reload Nginx only after success, then deploy `npm run build` output. This Windows environment has no nginx executable: the supplied fragment has not been syntax-tested or deployed here.
4. Verify public metadata through the deployed same-origin URL, preserving business error status/body; then the real authenticated user's own list in their browser. Never use synthetic actor IDs against production. No backend controller replacement or migration is required for the proxy approach.

This is an application gateway, not authentication. The inherited Mobile protocol is stateless and accepts login-returned actor/client identifiers for scoped operations; the gateway neither upgrades that to cryptographic authentication nor weakens server ownership rules. Use the existing application/network access policy for this location; do not call it a public unauthenticated alternative to a token-secured API.

## Verification

- RED before fix: `node scripts/test-mobile-transport-browser.mjs` produced status 0, direct Hachi URL, `net::ERR_FAILED`; the transport unit test also failed on the old cross-origin default.
- GREEN real browser: supplied client1/action29 now exposes PHP 404/message; public catalog-derived action13 returns successful metadata. `docs/mobile-transport-evidence/live-browser.json` contains safe status/IDs/URLs only.
- `node scripts/probe-mobile-cors.mjs`: reproducible read-only upstream header probes; output `docs/mobile-transport-evidence/upstream-probes.json` excludes cookies and bodies.
- `node scripts/test-mobile-proxy.mjs`: real running-server invalid-route/query rejection, PHP business status preserved, no Set-Cookie, no-store.
- `node scripts/test-mobile-transport.mjs`: default/configured transport, payload, omit credentials, no redirects, network vs HTTP/WAF vs invalid JSON.
- `node scripts/test-mobile-foundation.mjs`: passes with corrected same-origin expectation.
- `node --test src/mobile/features/logbook/contracts.test.mjs`: 19 tests passed; exact capability GET/XHR prefix and group/payload contracts, file origin unchanged.
- `node scripts/test-mobile-integration-browser.mjs`: 10 checks passed. All API requests intercepted and synthetic; real UI list does metadata -> actor/client-scoped list on same-origin URLs, then notification/detail/logout regressions. NOT proof of a live clinical list.
- `npm run lint`, `npm run build`, `git diff --check`: passed. Build retains dependency annotation/chunk-size warnings.

Readonly Mobile/backend originals remain untouched. No login, credentials, clinical records, live uploads or business mutations were used. Upstream production CORS is still unchanged; only the local gateway is live-verified. Production gateway deployment and actual signed-in user's own action29/list remain to be verified by their operator.
