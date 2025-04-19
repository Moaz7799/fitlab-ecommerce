console.log("Welcome to Fitlab!");

// Main application entry point
document.addEventListener("DOMContentLoaded", function () {
  // Authentication check - redirect to login if not authenticated
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "index.html" && !localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
    return;
  }

  // Mobile menu toggle functionality
  document
    .querySelector(".mobile-menu-toggle")
    ?.addEventListener("click", function () {
      document.querySelector(".nav-links").classList.toggle("active");
      document.querySelector(".search-bar").classList.toggle("active");
    });

  // Banner close functionality
  document
    .querySelector(".close-banner")
    ?.addEventListener("click", function () {
      document.querySelector(".top-banner").style.display = "none";
    });

  // Back to top button functionality
  const backToTopButton = document.querySelector(".back-to-top");
  if (backToTopButton) {
    window.addEventListener("scroll", function () {
      const show = window.pageYOffset > 300;
      backToTopButton.classList.toggle("visible", show);
      document
        .querySelector(".navbar")
        .classList.toggle("scrolled", window.pageYOffset > 10);
    });
    backToTopButton.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // Product loading simulation for better UX
  const productImages = document.querySelectorAll(".product-image");
  const productNames = document.querySelectorAll(".product-name");
  const productRatings = document.querySelectorAll(".product-rating");
  const productPrices = document.querySelectorAll(".product-price");

  // Add loading state classes
  productImages.forEach((image) => image.classList.add("loading"));
  productNames.forEach((name) => name.classList.add("loading"));
  productRatings.forEach((rating) => rating.classList.add("loading"));
  productPrices.forEach((price) => price.classList.add("loading"));

  // Hide content during loading
  const hideContent = () => {
    productImages.forEach((image) => {
      const img = image.querySelector("img");
      if (img) img.style.opacity = "0";
    });

    productNames.forEach((name) => {
      name.dataset.originalText = name.textContent;
      name.textContent = "";
    });

    productRatings.forEach((rating) => {
      rating.dataset.originalHtml = rating.innerHTML;
      rating.innerHTML = "";
    });

    productPrices.forEach((price) => {
      price.dataset.originalHtml = price.innerHTML;
      price.innerHTML = "";
    });
  };

  // Show content after loading
  const showContent = () => {
    productImages.forEach((image) => {
      image.classList.remove("loading");
      const img = image.querySelector("img");
      if (img) img.style.opacity = "1";
    });

    productNames.forEach((name) => {
      name.classList.remove("loading");
      name.textContent = name.dataset.originalText;
    });

    productRatings.forEach((rating) => {
      rating.classList.remove("loading");
      rating.innerHTML = rating.dataset.originalHtml;
    });

    productPrices.forEach((price) => {
      price.classList.remove("loading");
      price.innerHTML = price.dataset.originalHtml;
    });
  };

  // Simulate loading time
  hideContent();
  setTimeout(showContent, 1500);

  // Lazy loading implementation for images
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src; // Trigger image load
          imageObserver.unobserve(img);
        }
      });
    });
    lazyImages.forEach((img) => imageObserver.observe(img));
  }

  // Update UI for logged in users
  if (localStorage.getItem("isLoggedIn") === "true") {
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userButton = document.querySelector(
      '.icon-button[aria-label="User button"]'
    );
    const logoutButton = document.getElementById("logoutButton");

    if (userButton) {
      userButton.innerHTML = `<i class="fa-solid fa-user-check"></i>`;
      userButton.setAttribute("title", `Logged in as ${userEmail}`);
    }

    if (logoutButton) {
      logoutButton.style.display = "block";
      logoutButton.addEventListener("click", logout);
    }

    if (userName) {
      console.log(`Welcome back, ${userName}!`);
    }
  }

  // Smooth scroll for logo link
  document
    .querySelectorAll('.footer-logo a[href="index.html"]')
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        if (window.location.pathname.split("/").pop() === "index.html") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      });
    });
});

// Logout function - clears session data and redirects to login
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html?logout=true";
}
