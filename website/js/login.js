async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");
  const btn = document.querySelector("button[onclick='login()']");
  const spinner = document.getElementById("spinner");

  msg.innerText = "";

  if (!username || !password) {
    msg.innerText = "Please enter both username and password.";
    return;
  }

  // show spinner and disable button
  btn.disabled = true;
  spinner.style.display = "inline-block";

  try {
    const res = await fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      msg.innerText = data.message || "Login failed.";
      return;
    }

    // successful login
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    window.location.href = "index.html";
  } catch (err) {
    msg.innerText = "Error connecting to server.";
    console.error(err);
  } finally {
    // always hide spinner and re-enable button
    btn.disabled = false;
    spinner.style.display = "none";
  }
}
