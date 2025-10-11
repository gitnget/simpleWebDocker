// auth.js
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    // no token, redirect to login
    window.location.href = "/login.html";
  }
})();
