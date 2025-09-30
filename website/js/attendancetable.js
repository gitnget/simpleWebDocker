/* resultEL - the Div element name to display the results */
async function fetchAttendance(resultEL) {
  const stuid = document.getElementById("stuid").value.trim();
  const errorDiv = document.getElementById("error");
  const resultsDiv = document.getElementById(resultEL);
  const summaryDiv = document.getElementById("summary");

  errorDiv.textContent = "";
  resultsDiv.innerHTML = "";
  summaryDiv.innerHTML = "";

  if (!stuid) {
    errorDiv.textContent = "Please enter a Student ID.";
    return;
  }

  try {
    const response = await fetch(`https://fastapi-service-101554626321.asia-southeast1.run.app/getattbystutid?stuid=${encodeURIComponent(stuid)}`);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Build the table string
      let tableHTML = `
        <table id="attendanceTable" class="table table-striped table-bordered table-hover mt-3">
          <thead class="table-light">
            <tr>
              <th class="sortable">Status</th>
              <th class="sortable">Attendance Date</th>
              <th class="sortable">Recorded At</th>
            </tr>
          </thead>
          <tbody>
      `;

      data.forEach((row) => {
        let statusClass = "";
        if (row.status === "PRESENT") statusClass = "table-success";
        else if (row.status === "LATE") statusClass = "table-warning";
        else if (row.status === "ABSENT") statusClass = "table-danger";

        tableHTML += `
          <tr class="${statusClass}">
            <td>${row.status}</td>
            <td>${row.attendancedate}</td>
            <td>${row.createdate}</td>
          </tr>`;
      });

      tableHTML += "</tbody></table>";

      // Insert the table into DOM
      resultsDiv.innerHTML = tableHTML;

      // Get the table element (not string)
      const tableElement = document.getElementById("attendanceTable");

      // Make table sortable
      makeTableSortable(tableElement);

      // Add summary
      const summary = summarizeAttendance(data, 90);
      summaryDiv.innerHTML = `<p class="mt-3 fw-bold">${summary}</p>`;
    } else {
      errorDiv.textContent = "No attendance records found for this student.";
    }
  } catch (err) {
    errorDiv.textContent = `Error: ${err.message}`;
  }
}

// Button click
document.getElementById("searchBtn").addEventListener("click", () => {
  fetchAttendance("resultsTable");
});

// Enter key in input
document.getElementById("stuid").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchAttendance("resultsTable");
  }
});

function summarizeAttendance(data, attendanceGoal = 90) {
  if (!Array.isArray(data) || data.length === 0) {
    return "No attendance records found for this student.";
  }

  const total = data.length;
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;

  data.forEach((row) => {
    if (row.status === "PRESENT") presentCount++;
    else if (row.status === "LATE") lateCount++;
    else if (row.status === "ABSENT") absentCount++;
  });

  const attendanceRate = ((presentCount + lateCount) / total) * 100;
  const meetsGoal = attendanceRate >= attendanceGoal;

  // Determine recent trend (based on last 3 records)
  const recent = data.slice(-3).map((r) => r.status);
  let trend = "mixed";
  if (recent.every((s) => s === "PRESENT")) trend = "consistent attendance";
  else if (recent.includes("ABSENT")) trend = "attendance issues";
  else if (recent.includes("LATE")) trend = "showing lateness";

  // Summary message
  let summary = `The student has ${total} recorded attendance entries. `;
  summary += `Present: ${presentCount}, Late: ${lateCount}, Absent: ${absentCount}. `;
  summary += `Attendance rate is ${attendanceRate.toFixed(1)}% (goal: ${attendanceGoal}%). <br />`;
  summary += meetsGoal ? "✅ The student is meeting the attendance goal. " : "❌ The student is below the attendance goal. ";
  summary += `Recent trend shows ${trend}.`;

  return summary;
}

function makeTableSortable(table) {
  const headers = table.querySelectorAll("th.sortable");

  headers.forEach((header, index) => {
    header.style.cursor = "pointer"; // show clickable
    header.addEventListener("click", () => {
      const tbody = table.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));

      // Toggle sort direction
      const asc = !header.classList.contains("asc");
      headers.forEach((h) => h.classList.remove("asc", "desc"));
      header.classList.add(asc ? "asc" : "desc");

      rows.sort((a, b) => {
        let valA = a.children[index].innerText.trim();
        let valB = b.children[index].innerText.trim();

        // Try to parse as date or number first
        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return asc ? dateA - dateB : dateB - dateA;
        }
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return asc ? numA - numB : numB - numA;
        }

        // Fallback: string comparison
        return asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });

      // Reattach sorted rows
      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}
