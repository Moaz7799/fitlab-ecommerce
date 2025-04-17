console.log("Welcome to Fitlab!");

// ===== SINGLE DOMContentLoaded LISTENER ===== //
document.addEventListener("DOMContentLoaded", function () {
  // 1. First check authentication
  const currentPage = window.location.pathname.split("/").pop();
  if (currentPage === "index.html" && !localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
    return;
  }

  // 2. Mobile menu toggle
  document
    .querySelector(".mobile-menu-toggle")
    ?.addEventListener("click", function () {
      document.querySelector(".nav-links").classList.toggle("active");
      document.querySelector(".search-bar").classList.toggle("active");
    });

  // 3. Close banner
  document
    .querySelector(".close-banner")
    ?.addEventListener("click", function () {
      document.querySelector(".top-banner").style.display = "none";
    });

  // 4. Back to top button
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

  // 5. Product images loading simulation
  const productImages = document.querySelectorAll(".product-image");
  const productNames = document.querySelectorAll(".product-name");
  const productRatings = document.querySelectorAll(".product-rating");
  const productPrices = document.querySelectorAll(".product-price");

  // Add loading state
  productImages.forEach((image) => image.classList.add("loading"));
  productNames.forEach((name) => name.classList.add("loading"));
  productRatings.forEach((rating) => rating.classList.add("loading"));
  productPrices.forEach((price) => price.classList.add("loading"));

  // Hide actual content during loading
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

  // Restore content after loading
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

  // 6. Lazy loading for images
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

  // 7. Update UI for logged in users
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

  // 8. Smooth scroll for logo link
  document
    .querySelectorAll('.footer-logo a[href="index.html"]')
    .forEach((link) => {
      link.addEventListener("click", function (e) {
        // Only if we're already on index.html
        if (window.location.pathname.split("/").pop() === "index.html") {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
        // Otherwise, the normal link behavior will take us to index.html
      });
    });
});

function logout() {
  // Clear only session-related items
  localStorage.removeItem("isLoggedIn");

  // Optional: Clear cart or other session-specific data
  // localStorage.removeItem("cartItems");

  // Redirect to login with a flag to show logout message
  window.location.href = "login.html?logout=true";
}
