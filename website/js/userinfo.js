document.addEventListener("DOMContentLoaded", async () => {
  // Assume the logged-in username is stored in localStorage by your auth flow
  const login = localStorage.getItem("username");

  if (!login) {
    console.error("No username found. Redirecting to login page...");
    window.location.href = "/login.html";
    return;
  }

  try {
    const response = await fetch(`https://fastapi-service-101554626321.asia-southeast1.run.app/getuserinfo?login=${encodeURIComponent(login)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const data = await response.json();

    // Populate fields
    document.querySelector(".profile-name").textContent = data.username || "Unknown";
    document.querySelector(".email").innerHTML = `<strong>Email:</strong> ${data.email || "-"}`;
    document.querySelector(".phone").innerHTML = `<strong>Phone:</strong> ${data.hp || "-"}`;
    document.querySelector(".has_kpmlogin").innerHTML = `<strong>Has KPM Login:</strong> ${data.has_kpmlogin ? "Yes" : "No"}`;

    // You can also set role or additional UI if needed
    if (data.role) {
      const roleBadge = document.createElement("div");
      roleBadge.className = "p-3 bg-info text-white rounded-3 shadow-sm text-center";
      roleBadge.innerHTML = `<strong>Role:</strong><br/>${data.role}`;
      document.querySelector(".d-flex.flex-wrap.gap-3").appendChild(roleBadge);
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    alert("Unable to load profile. Please try again later.");
  }
});
