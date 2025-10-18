async function loadYearlyTrend() {
  const eduid = 1;
  const yearnum = 5;
  const apiUrl = `https://fastapi-service-101554626321.asia-southeast1.run.app/getschyearlytrend?eduid=${eduid}&yearnum=${yearnum}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const labels = data.map((item) => item.year);
    const percentages = data.map((item) => (item.percentage !== null ? parseFloat(item.percentage) : 0));

    const ctx = document.getElementById("yearlytrendchart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Attendance Percentage",
            data: percentages,
            borderColor: "#4e73df",
            backgroundColor: "rgba(78, 115, 223, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // ✅ allows full height fill
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Percentage (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Year",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.parsed.y.toFixed(2) + "%",
            },
          },
          legend: { display: false },
          title: {
            display: true,
            text: "Yearly Attendance Trend",
            font: { size: 16 },
          },
        },
        layout: {
          padding: 10,
        },
      },
    });
  } catch (error) {
    console.error("Error loading trend data:", error);
  }
}

// Run on page load
loadYearlyTrend();
