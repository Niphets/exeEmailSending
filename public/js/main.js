document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("[data-product]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productName = btn.getAttribute("data-product");
      btn.textContent = "Added!";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = `Add ${productName} to basket`;
        btn.disabled = false;
      }, 1800);
    });
  });
});

