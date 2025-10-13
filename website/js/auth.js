// auth.js - robust client-side sliding expiration + JWT exp check
(function () {
  const SESSION_TIMEOUT_MINUTES = 30; // sliding window
  const LOGIN_PAGE = "/login.html";

  // Safe decode JWT payload (returns object or null)
  function decodeJwtPayload(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(payload);
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch (err) {
      return null;
    }
  }

  // Check server-side JWT expiry (returns true if expired or invalid)
  function isJwtExpired(token) {
    const payload = decodeJwtPayload(token);
    if (!payload || !payload.exp) return true; // treat invalid token as expired
    // exp is in seconds since epoch per JWT spec
    const expMs = payload.exp * 1000;
    return Date.now() >= expMs;
  }

  // Client activity-based expiry (sliding)
  function isSessionIdleExpired(lastActiveStr) {
    if (!lastActiveStr) return false; // do not force logout on missing timestamp — we'll init below
    const last = parseInt(lastActiveStr, 10);
    if (Number.isNaN(last)) return false;
    const diffMinutes = (Date.now() - last) / (1000 * 60);
    return diffMinutes > SESSION_TIMEOUT_MINUTES;
  }

  // Clear storage and navigate to login
  function forceLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("lastActiveTime");
    // notify other tabs
    try {
      localStorage.setItem("force_logout_at", Date.now().toString());
    } catch {}
    window.location.href = LOGIN_PAGE;
  }

  // Refresh local activity timestamp
  function refreshLastActive() {
    try {
      localStorage.setItem("lastActiveTime", Date.now().toString());
    } catch (e) {
      /* ignore storage errors */
    }
  }

  // Main
  (function main() {
    const token = localStorage.getItem("token");
    const lastActive = localStorage.getItem("lastActiveTime");

    // 1) No token -> redirect
    if (!token) {
      forceLogout();
      return;
    }

    // 2) JWT expired -> redirect (server token authoritative)
    if (isJwtExpired(token)) {
      forceLogout();
      return;
    }

    // 3) If lastActive missing or invalid, initialize it to now (prevents immediate logout)
    if (!lastActive || isNaN(parseInt(lastActive, 10))) {
      refreshLastActive();
    }

    // 4) If idle timeout exceeded -> logout
    if (isSessionIdleExpired(localStorage.getItem("lastActiveTime"))) {
      forceLogout();
      return;
    }

    // 5) Session OK: update lastActive now, and attach activity listeners to keep sliding window alive.
    refreshLastActive();

    const activityHandler = () => refreshLastActive();
    const events = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, activityHandler, { passive: true }));

    // Also handle page visibility (user switches tabs)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshLastActive();
    });

    // If another tab forces logout, respond to it
    window.addEventListener("storage", (ev) => {
      if (!ev) return;
      if (ev.key === "force_logout_at") {
        // another tab triggered logout
        window.location.href = LOGIN_PAGE;
      }
    });
  })();
})();
