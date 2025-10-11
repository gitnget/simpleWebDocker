async function retrievePassword() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!username || !email) {
    document.getElementById("msg").innerText = "Please enter both username and email.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("msg").innerText = data.detail || "Something went wrong.";
      document.getElementById("msg").classList.replace("text-success", "text-danger");
    } else {
      document.getElementById("msg").innerText = data.message;
      document.getElementById("msg").classList.replace("text-danger", "text-success");
    }
  } catch (err) {
    document.getElementById("msg").innerText = "Server unreachable. Try again later.";
    document.getElementById("msg").classList.replace("text-success", "text-danger");
  }
}
