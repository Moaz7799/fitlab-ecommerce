2; // Initialize authentication functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get form elements
  const loginForm = document.querySelector(".login-form");
  const signupForm = document.querySelector(".signup-form");
  const loginFormElement = document.getElementById("loginForm");
  const signupFormElement = document.getElementById("signupForm");

  // Check URL hash for signup form
  if (window.location.hash === "#signup") {
    showSignupForm();
  }

  // Helper function to show signup form and scroll to auth section
  function showSignupForm() {
    const loginForm = document.querySelector(".login-form");
    const signupForm = document.querySelector(".signup-form");

    if (loginForm && signupForm) {
      loginForm.classList.remove("active");
      signupForm.classList.add("active");
      document.querySelector(".auth-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  // Handle signup link click in top banner
  document
    .getElementById("topBannerSignupLink")
    ?.addEventListener("click", function (e) {
      if (window.location.pathname.endsWith("login.html")) {
        e.preventDefault();
        showSignupForm();
        window.history.pushState(null, null, "#signup");
      }
    });

  // Toggle between login and signup forms
  document
    .getElementById("showSignup")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm?.classList.remove("active");
      signupForm?.classList.add("active");
    });

  document.getElementById("showLogin")?.addEventListener("click", function (e) {
    e.preventDefault();
    signupForm?.classList.remove("active");
    loginForm?.classList.add("active");
  });

  // Password visibility toggle functionality
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      const icon = this.querySelector("i");
      const isPassword = input.type === "password";

      input.type = isPassword ? "text" : "password";
      icon.classList.toggle("fa-eye", !isPassword);
      icon.classList.toggle("fa-eye-slash", isPassword);
    });
  });

  // Password strength indicator functionality
  document
    .getElementById("signupPassword")
    ?.addEventListener("input", function () {
      const password = this.value;
      const strengthBars = document.querySelectorAll(".strength-bar");
      const strengthText = document.querySelector(".strength-text");

      // Reset UI
      strengthBars.forEach((bar) => (bar.style.backgroundColor = "#e0e0e0"));

      // Calculate password strength (1-5)
      const strength = Math.min(
        (password.length > 0) +
          (password.length >= 8) +
          /[A-Z]/.test(password) +
          /[0-9]/.test(password) +
          /[^A-Za-z0-9]/.test(password),
        3
      );

      // Update UI based on strength
      if (password.length === 0) {
        strengthText.textContent = "Password strength";
      } else {
        const colors = ["#ff3333", "#ffcc00", "#00cc66"];
        strengthBars.forEach((bar, i) => {
          bar.style.backgroundColor =
            i < strength ? colors[strength - 1] : "#e0e0e0";
        });
        strengthText.textContent = ["Weak", "Medium", "Strong"][strength - 1];
      }
    });

  // Handle login form submission
  if (loginFormElement) {
    loginFormElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const storedEmail = localStorage.getItem("userEmail");
      const storedHash = localStorage.getItem("userPasswordHash");

      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }

      if (email === storedEmail && simpleHash(password) === storedHash) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
      } else {
        alert("Invalid credentials. Please try again.");
        document.getElementById("loginPassword").value = "";
      }
    });
  }

  // Handle signup form submission
  if (signupFormElement) {
    signupFormElement.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      if (localStorage.getItem("userEmail") === email) {
        alert("Email already registered. Please log in.");
        signupForm?.classList.remove("active");
        loginForm?.classList.add("active");
        return;
      }

      // Store user data with hashed password
      const userId = "user_" + Date.now();
      localStorage.setItem("userId", userId);
      localStorage.setItem(
        "userName",
        document.getElementById("signupName").value
      );
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPasswordHash", simpleHash(password));
      localStorage.setItem("isLoggedIn", "true");

      alert("Account created! Redirecting...");
      window.location.href = "index.html";
    });
  }
});

// Simple hash function for password hashing (for demo purposes)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}
