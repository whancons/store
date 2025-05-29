// login.js
firebase.initializeApp({
  apiKey: "AIzaSyAwaQ7OhY0rRPnW0BEoktS12Gs8Fimx0EU",
  authDomain: "consign-6e96c.firebaseapp.com",
  projectId: "consign-6e96c",
});

const auth = firebase.auth();
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((err) => {
      document.getElementById("error").innerText = err.message;
    });
});
