
  setTimeout(() => {
    document.querySelectorAll(".toast-message").forEach(el => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 500);
    });
  }, 5000);
