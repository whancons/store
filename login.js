// Firebase config
firebase.initializeApp({
  apiKey: "AIzaSyAwaQ7OhY0rRPnW0BEoktS12Gs8Fimx0EU",
  authDomain: "consign-6e96c.firebaseapp.com",
  projectId: "consign-6e96c",
});

const auth = firebase.auth();
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("error-message");
const forgotPassword = document.getElementById("forgot-password");

// Handle login
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
    });
});

// Handle forgot password
forgotPassword.addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) {
    errorMsg.textContent = "Please enter your email first.";
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      errorMsg.style.color = "#10b981"; // green
      errorMsg.textContent = "Password reset email sent.";
    })
    .catch((error) => {
      errorMsg.style.color = "#dc2626"; // red
      errorMsg.textContent = error.message;
    });
});
