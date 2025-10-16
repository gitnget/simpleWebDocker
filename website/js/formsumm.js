document.addEventListener("DOMContentLoaded", async () => {
  const main = document.querySelector("main");

  // Create container and spinner
  const container = document.createElement("div");
  container.className = "container mt-4";

  const spinner = document.createElement("div");
  spinner.className = "d-flex justify-content-center my-5";
  spinner.innerHTML = `
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;
  container.appendChild(spinner);
  main.appendChild(container);

  try {
    const response = await fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/getformmonsum?year=2025&form=Tingkatan1");
    const data = await response.json();

    // Remove spinner
    spinner.remove();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<div class="alert alert-warning text-center">No data found</div>`;
      return;
    }

    // Extract form (use first record)
    const formName = data[0]?.form || "Unknown Form";

    // Create title
    const title = document.createElement("h2");
    title.className = "text-center mb-4 fw-bold";
    title.textContent = `Attendance Summary – ${formName}`;
    container.appendChild(title);

    // Create table
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-responsive";

    const table = document.createElement("table");
    table.className = "table table-bordered table-striped table-hover text-center align-middle";

    // Table header (exclude "form")
    const headers = Object.keys(data[0]).filter((h) => h !== "form");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h.charAt(0).toUpperCase() + h.slice(1);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement("tbody");
    data.forEach((row) => {
      const tr = document.createElement("tr");
      headers.forEach((key) => {
        const td = document.createElement("td");
        const value = row[key];
        td.textContent = value === null ? "-" : value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    container.appendChild(tableWrapper);
  } catch (error) {
    spinner.remove();
    container.innerHTML = `<div class="alert alert-danger text-center">Error loading data: ${error.message}</div>`;
  }
});
