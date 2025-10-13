console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  /* ---------------- Logout helper ---------------- */
  function attachLogoutHandler() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;
    console.log("logging out");
    logoutBtn.addEventListener("click", function (ev) {
      ev.preventDefault();

      // 🔑 Clear client-side tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("username");

      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 🔑 Tell server to logout (optional if JWT is stateless)
      fetch("/api/logout", { method: "POST", credentials: "include" })
        .then(() => (window.location.href = "/login.html"))
        .catch(() => (window.location.href = "/login.html"));
    });
  }

  /* ---------------- Table sorting ---------------- */
  function makeTableSortable(table) {
    const headers = table.querySelectorAll("th");
    headers.forEach((header, index) => {
      header.style.cursor = "pointer";
      header.addEventListener("click", () => {
        const isAsc = header.classList.toggle("asc");
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        rows.sort((a, b) => {
          const cellA = a.children[index].innerText.trim();
          const cellB = b.children[index].innerText.trim();
          const numA = parseFloat(cellA.replace(/[, ]+/g, ""));
          const numB = parseFloat(cellB.replace(/[, ]+/g, ""));
          const aIsNum = !isNaN(numA);
          const bIsNum = !isNaN(numB);
          if (aIsNum && bIsNum) {
            return isAsc ? numA - numB : numB - numA;
          } else {
            return isAsc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
          }
        });
        const tbody = table.querySelector("tbody");
        rows.forEach((row) => tbody.appendChild(row));
      });
    });
  }
  window.makeTableSortable = makeTableSortable;

  /* ---------------- Mobile hamburger ---------------- */
  function initMenu() {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (!hamburger || !navLinks) return;
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    newHamburger.addEventListener("click", function (ev) {
      ev.preventDefault();
      navLinks.classList.toggle("active");
    });
  }

  /* ---------------- Dropdown + User menu toggles ---------------- */
  function attachDropdownToggles() {
    const toggles = document.querySelectorAll(".dropdown, .user-icon");
    if (!toggles.length) return;

    function closeAll(exceptEl) {
      toggles.forEach((t) => {
        if (t !== exceptEl) t.classList.remove("open");
      });
    }

    toggles.forEach((el) => {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        const wasOpen = el.classList.contains("open");
        closeAll(el);
        if (!wasOpen) {
          el.classList.add("open");
        }
      });

      // Prevent clicks inside menu from closing
      const innerMenu = el.querySelector(".dropdown-menu, .user-menu");
      if (innerMenu) {
        innerMenu.addEventListener("click", function (ev) {
          ev.stopPropagation();
        });
      }
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      toggles.forEach((t) => t.classList.remove("open"));
    });

    // Close on Esc
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        toggles.forEach((t) => t.classList.remove("open"));
      }
    });
  }

  /* Display username once header is present */
  function showUsername() {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (username) {
      const userInfo = document.getElementById("user-info-name");
      if (userInfo) userInfo.innerText = `Welcome, ${username} (${role})`;
    }
  }

  /* === Run initializations after DOM ready === */
  initMenu();
  attachDropdownToggles();
  attachLogoutHandler();
  showUsername();
});
