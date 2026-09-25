/* =========================================================
   TASTE HAVEN RESTAURANT
   Main JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTS
     ======================================================= */

  const header = document.getElementById("site-header");

  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  const navLinks = document.querySelectorAll(".nav-link");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  const orderButtons = document.querySelectorAll(".order-item-btn");

  const orderModal = document.getElementById("order-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");
  const selectedItem = document.getElementById("selected-item");
  const modalWhatsapp = document.getElementById("modal-whatsapp");

  const currentYear = document.getElementById("current-year");

  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  function openMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.add("active");
    menuToggle.classList.add("active");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMenu() {
    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleMenu() {
    if (!navMenu) return;

    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* =======================================================
     CLOSE MOBILE MENU WITH ESCAPE
     ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =======================================================
     HEADER SCROLL EFFECT
     ======================================================= */

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const sections = document.querySelectorAll("main section[id]");

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            const linkTarget = link.getAttribute("href");

            if (linkTarget === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        });
      },
      {
        root: null,
        threshold: 0.35
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  /* =======================================================
     MENU FILTERING
     ======================================================= */

  function filterMenu(category) {
    menuCards.forEach((card) => {
      const cardCategory = card.dataset.category;

      if (category === "all" || cardCategory === category) {
        card.classList.remove("hidden-item");
      } else {
        card.classList.add("hidden-item");
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter || "all";

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
        filterButton.setAttribute("aria-selected", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-selected", "true");

      filterMenu(selectedFilter);
    });
  });

  /* =======================================================
     ORDER MODAL
     ======================================================= */

  const RESTAURANT_WHATSAPP = "2348000000000";

  function openOrderModal(itemName) {
    if (!orderModal || !selectedItem || !modalWhatsapp) return;

    selectedItem.textContent = itemName;

    const message =
      `Hello Taste Haven, I would like to order: ${itemName}. ` +
      `Please let me know the next steps.`;

    const whatsappURL =
      `https://wa.me/${RESTAURANT_WHATSAPP}?text=` +
      encodeURIComponent(message);

    modalWhatsapp.href = whatsappURL;

    orderModal.classList.add("active");
    orderModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    if (modalClose) {
      window.setTimeout(() => {
        modalClose.focus();
      }, 50);
    }
  }

  function closeOrderModal() {
    if (!orderModal) return;

    orderModal.classList.remove("active");
    orderModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");
  }

  orderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const itemName =
        button.dataset.item ||
        button.closest(".menu-card")?.querySelector("h3")?.textContent ||
        "Selected menu item";

      openOrderModal(itemName.trim());
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeOrderModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeOrderModal);
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      orderModal &&
      orderModal.classList.contains("active")
    ) {
      closeOrderModal();
    }
  });

  /* =======================================================
     PREVENT BACKGROUND SCROLL WHILE MODAL IS OPEN
     ======================================================= */

  if (orderModal) {
    const modalObserver = new MutationObserver(() => {
      if (orderModal.classList.contains("active")) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    });

    modalObserver.observe(orderModal, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  /* =======================================================
     AUTOMATIC COPYRIGHT YEAR
     ======================================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =======================================================
     CLOSE MENU WHEN WINDOW BECOMES DESKTOP SIZE
     ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
});