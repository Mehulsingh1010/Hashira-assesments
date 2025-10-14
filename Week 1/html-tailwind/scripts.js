//for menu opening and closing with transition
const menuButton = document.getElementById("menuu");
const mobileMenu = document.getElementById("mobile-menu");
const hamburgerIcon = document.getElementById("hamburger-icon");
const closeIcon = document.getElementById("close-icon");
const menuItems = document.querySelectorAll(".menu-item");

const closeMenu = () => {
  mobileMenu.style.maxHeight = "0px";
  mobileMenu.style.opacity = "0";
  hamburgerIcon.classList.remove("hidden");
  closeIcon.classList.add("hidden");

  menuItems.forEach((item) => {
    item.style.transform = "translateY(8px)";
    item.style.opacity = "0";
  });
};

menuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen =
    mobileMenu.style.maxHeight && mobileMenu.style.maxHeight !== "0px";

  if (isOpen) {
    closeMenu();
  } else {
    mobileMenu.style.maxHeight = "500px";
    mobileMenu.style.opacity = "1";
    hamburgerIcon.classList.add("hidden");
    closeIcon.classList.remove("hidden");

    menuItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = "translateY(0)";
        item.style.opacity = "1";
      }, 50 + index * 50);
    });
  }
});

document.querySelectorAll('#mobile-menu a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      const yOffset = -60;
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    closeMenu();
  });
});

document.addEventListener("click", (e) => {
  const isClickInsideMenu =
    mobileMenu.contains(e.target) || menuButton.contains(e.target);
  if (!isClickInsideMenu) {
    closeMenu();
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//for nav link active indication
const links = document.querySelectorAll(".nav-link");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    link.classList.add("active");

    setTimeout(() => {
      link.classList.remove("active");
    }, 2000);

    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//for navigation buttons
const container = document.getElementById("cardsContainer");
const leftBtn = document.getElementById("scrollLeft");
const rightBtn = document.getElementById("scrollRight");

const cardWidth = 320;
let currentIndex = 0;
const totalCards = 3;

function updateButtons() {
  leftBtn.style.display = currentIndex === 0 ? "none" : "flex";

  rightBtn.style.display = currentIndex === totalCards - 1 ? "none" : "flex";
}

leftBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    container.scrollBy({ left: -cardWidth, behavior: "smooth" });
    updateButtons();
  }
});

rightBtn.addEventListener("click", () => {
  if (currentIndex < totalCards - 1) {
    currentIndex++;
    container.scrollBy({ left: cardWidth, behavior: "smooth" });
    updateButtons();
  }
});

container.addEventListener("scroll", () => {
  const scrollLeft = container.scrollLeft;
  currentIndex = Math.round(scrollLeft / cardWidth);
  updateButtons();
});

updateButtons();
