// Fetch API data and display table + chart
fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/getschmonsum?eduid=1&year=2025")
  .then((response) => response.json())
  .then((data) => {
    // Hide spinner / Show content
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";

    // Populate Table
    const tableBody = document.querySelector("#summary-table tbody");
    data.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
            <td>${row.month}</td>
            <td>${row.student_count}</td>
            <td>${row.month_att_goal}</td>
            <td>${row.month_att_count}</td>
            <td>${row.percentage}%</td>
          `;
      tableBody.appendChild(tr);
    });

    // Chart Data
    const months = data.map((item) => item.month);
    const percentages = data.map((item) => item.percentage);

    // Render Area Chart
    const ctx = document.getElementById("attendanceChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Attendance %",
            data: percentages,
            fill: true,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ✅ This makes it shrink on phones
        plugins: {
          title: {
            display: true,
            text: "Monthly Attendance Percentage",
            font: { size: 16 },
          },
        },
        scales: {
          y: {
            suggestedMin: 90,
            suggestedMax: 100,
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
    document.getElementById("loading").innerHTML = "<p class='text-danger'>Failed to load data. Please try again later.</p>";
  });
