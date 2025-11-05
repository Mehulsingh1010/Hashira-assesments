const menuToggle = document.getElementById("menuToggle");
      const mobileMenu = document.getElementById("mobileMenu");
      const hamburgerIcon = document.getElementById("hamburgerIcon");
      const closeIcon = document.getElementById("closeIcon");
      let isOpen = false;

      menuToggle.addEventListener("click", () => {
        isOpen = !isOpen;

        if (isOpen) {
          mobileMenu.classList.remove("hidden");
          mobileMenu.classList.add("mobile-menu-enter");
          mobileMenu.classList.remove("mobile-menu-exit");
          menuToggle.classList.add("open");

          // Animate icons
          hamburgerIcon.classList.add("opacity-0", "scale-0", "rotate-90");
          closeIcon.classList.remove("opacity-0", "scale-0");
          closeIcon.classList.add("opacity-100", "scale-100", "rotate-0");
        } else {
          mobileMenu.classList.remove("mobile-menu-enter");
          mobileMenu.classList.add("mobile-menu-exit");
          menuToggle.classList.remove("open");

          // Animate icons
          hamburgerIcon.classList.remove("opacity-0", "scale-0", "rotate-90");
          hamburgerIcon.classList.add("opacity-100", "scale-100");
          closeIcon.classList.remove("opacity-100", "scale-100", "rotate-0");
          closeIcon.classList.add("opacity-0", "scale-0", "-rotate-90");

          setTimeout(() => {
            mobileMenu.classList.add("hidden");
          }, 300);
        }
      });

      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          isOpen = false;
          mobileMenu.classList.add("mobile-menu-exit");
          mobileMenu.classList.remove("mobile-menu-enter");
          menuToggle.classList.remove("open");

          // Animate icons back
          hamburgerIcon.classList.remove("opacity-0", "scale-0", "rotate-90");
          hamburgerIcon.classList.add("opacity-100", "scale-100");
          closeIcon.classList.remove("opacity-100", "scale-100", "rotate-0");
          closeIcon.classList.add("opacity-0", "scale-0", "-rotate-90");

          setTimeout(() => {
            mobileMenu.classList.add("hidden");
          }, 300);
        });
      });