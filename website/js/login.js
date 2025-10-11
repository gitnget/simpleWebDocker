async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (!username || !password) {
    msg.innerText = "Please enter both username and password.";
    return;
  }

  try {
    const res = await fetch("https://fastapi-service-101554626321.asia-southeast1.run.app/login", {
      //const res = await fetch("http://localhost:911/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      msg.innerText = data.message || "Login failed.";
      return;
    }

    // After successful login
    // store JWT or session token
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username); // store username too

    // redirect to index.html
    window.location.href = "index.html";
  } catch (err) {
    msg.innerText = "Error connecting to server.";
    console.error(err);
  }
}
