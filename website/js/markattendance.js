const form = document.getElementById("attendanceForm");
const eduInput = document.getElementById("edu_stuid");
const autoSubmitCheck = document.getElementById("autoSubmitCheck");

// Define a mapping of activity IDs to friendly names
const activityNameMap = {
  "activity 1": "'School Attendance'",
  "activity 2": "'Sports Day'",
  "activity 3": "'Competition'",
  // add more as needed
};

// Auto-submit on Enter
eduInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && autoSubmitCheck.checked) {
    e.preventDefault(); // prevent default "form reload"
    form.requestSubmit(); // safer than form.submit()
  }
});

// Default date = today
document.querySelector('input[name="attendancedate"]').value = new Date().toISOString().split("T")[0];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Show spinner
  document.getElementById("spinner").style.display = "block";

  const formData = new FormData(e.target);
  let payload = Object.fromEntries(formData.entries());

  // ✅ Only keep the fields the SP expects
  payload = {
    eduid: payload.eduid,
    edu_stuid: payload.edu_stuid,
    activityid: payload.activityid,
    attendancedate: payload.attendancedate,
    status: payload.status,
    remarks: payload.remarks || "",
    captureby: payload.captureby || "system", // fallback if blank
  };

  try {
    const response = await fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/markattendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMsg = "";
      try {
        const errJson = await response.json();
        errorMsg = errJson.detail || JSON.stringify(errJson);

        // Handle student FK error
        if (errorMsg.includes("stu_attendance_eduid_edu_stuid_fkey")) {
          errorMsg = "Error finding the student ID: " + eduInput.value;
        } else {
          // Replace activity name with friendly name
          for (const [key, value] of Object.entries(activityNameMap)) {
            if (errorMsg.toLowerCase().includes(key.toLowerCase())) {
              errorMsg = errorMsg.replace(new RegExp(key, "gi"), value);
              break;
            }
          }
        }
      } catch {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
    }

    // ✅ Success
    const now = new Date();
    const timestamp = now.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const data = await response.json();
    const parsed = JSON.parse(JSON.stringify(data));

    document.getElementById("result").innerHTML = `
      <div class="alert alert-success rounded-pill px-3 py-2 d-inline-block">
        ✅ ${parsed.message} 
        <small class="text-muted"><br />at ${timestamp}</small>
      </div>
    `;

    eduInput.value = "";
    eduInput.focus();
  } catch (error) {
    document.getElementById("result").innerHTML = `
      <span style="color:red;">${error.message}</span>
    `;
    eduInput.value = "";
    eduInput.focus();
  } finally {
    // Hide spinner no matter what
    document.getElementById("spinner").style.display = "none";
  }
});

/* Clock */
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("clock").textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock(); // run immediately on load
