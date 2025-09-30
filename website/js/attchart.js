let attendanceChartInstance = null; // keep track of the chart

async function loadChart() {
    const res = await fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/mockattendance");
    const data = await res.json();

    const labels = data.map((row) => row["Week Start"]);
    const presentData = data.map((row) => row["PRESENT"]);
    const lateData = data.map((row) => row["LATE"]);
    const absentData = data.map((row) => row["ABSENT"]);

    // Totals
    const totalPresent = presentData.reduce((a, b) => a + b, 0);
    const totalLate = lateData.reduce((a, b) => a + b, 0);
    const totalAbsent = absentData.reduce((a, b) => a + b, 0);
    const grandTotal = totalPresent + totalLate + totalAbsent;

    // Percentages
    const percentPresent = ((totalPresent / grandTotal) * 100).toFixed(1);
    const percentLate = ((totalLate / grandTotal) * 100).toFixed(1);
    const percentAbsent = ((totalAbsent / grandTotal) * 100).toFixed(1);

    // Thresholds
    const presentThreshold = 85;
    const issueThreshold = 15;

    // Trend analysis
    let trendMessage = "";
    if (percentPresent >= presentThreshold) trendMessage += "✅ Strong attendance (above threshold). ";
    else trendMessage += "⚠️ Attendance below target. ";
    if (percentLate > issueThreshold) trendMessage += "⚠️ Too many late arrivals. ";
    if (percentAbsent > issueThreshold) trendMessage += "❌ Absences are higher than acceptable. ";
    if (trendMessage === "") trendMessage = "ℹ️ Attendance is balanced.";

    // Summary
    document.getElementById("summary").innerHTML = `
    <div>
    <b>Totals:</b> Present: ${totalPresent}, Late: ${totalLate}, Absent: ${totalAbsent} <br>
    <b>Percentages:</b> Present: ${percentPresent}%, Late: ${percentLate}%, Absent: ${percentAbsent}% <br>
    <b>Goal:</b> Present: ${presentThreshold}%, Late + Absent: <${issueThreshold}% <br>
    <b>Trend:</b> ${trendMessage}
    </div>
    `;

    // Destroy previous chart if exists
    if (attendanceChartInstance) {
        attendanceChartInstance.destroy();
    }

    // Chart
    attendanceChartInstance = new Chart(document.getElementById("attendanceChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                { label: "Present", data: presentData, backgroundColor: "green", stack: "attendance" },
                { label: "Late", data: lateData, backgroundColor: "orange", stack: "attendance" },
                { label: "Absent", data: absentData, backgroundColor: "red", stack: "attendance" },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { left: 10, right: 10, top: 20, bottom: 20 } },
            plugins: {
                tooltip: { mode: "index", intersect: false },
                legend: { position: "top" },
            },
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true },
            },
        },
    });
}
