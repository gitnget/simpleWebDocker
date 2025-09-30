/* Lightweight sorting logic */
function makeTableSortable(table) {
  const headers = table.querySelectorAll("th");
  headers.forEach((header, index) => {
    header.style.cursor = "pointer";
    header.addEventListener("click", () => {
      const rows = Array.from(table.querySelectorAll("tbody tr"));
      const isAsc = header.classList.toggle("asc");

      rows.sort((a, b) => {
        const cellA = a.children[index].innerText.trim();
        const cellB = b.children[index].innerText.trim();

        // Try to parse numbers, else compare as strings
        const valA = isNaN(cellA) ? cellA.toLowerCase() : parseFloat(cellA);
        const valB = isNaN(cellB) ? cellB.toLowerCase() : parseFloat(cellB);

        if (valA < valB) return isAsc ? -1 : 1;
        if (valA > valB) return isAsc ? 1 : -1;
        return 0;
      });

      // Re-append sorted rows
      rows.forEach(row => table.querySelector("tbody").appendChild(row));
    });
  });
}

function initMenu() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
}

function loadIncludes() {
  // Load header
  fetch("../header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-placeholder").innerHTML = data;
      initMenu(); // activate hamburger after header loads
    });

  // Load footer
  fetch("../footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });
}

// Run once page is ready
// document.addEventListener("DOMContentLoaded", loadIncludes); <== when only one function needed to load at DOMContentLoaded

// Run once page is ready
document.addEventListener("DOMContentLoaded", loadIncludes);
