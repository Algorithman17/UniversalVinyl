(function () {
  const App = {
    // les constantes
    // les éléments du DOM
    DOM: {
      btnGoToTop: document.querySelector(".go-top-btn"),
      btnsAccordion: document.querySelectorAll(".accordion-btn"),
    },
    /**
     * Initialisation de l'application.
     */
    app_init: function () {
      App.app_handlers();
    },

    /**
     * Mise en place des gestionnaires d'évènements.
     */
    app_handlers: function () {
      App.handleOpenAccordion();
      window.addEventListener("scroll", App.handleScrollPosition);
      App.DOM.btnGoToTop.addEventListener("click", App.handleScrollToTop);
    },

    handleScrollPosition: () => {
      if (window.scrollY > 200) {
        App.DOM.btnGoToTop.classList.add("show");
      } else {
        App.DOM.btnGoToTop.classList.remove("show");
      }
    },

    handleScrollToTop: () => {
      document.documentElement.scrollTop = 0;
      App.DOM.btnGoToTop.classList.remove("show");
    },

    handleOpenAccordion: () => {
      for (let i = 0; i < App.DOM.btnsAccordion.length; i++) {
        const button = App.DOM.btnsAccordion[i];
        button.addEventListener("click", () => {
          button.classList.toggle("isOpen");
          if (button.classList.contains("isOpen")) {
            App.swapIcon(button, "icon-accordeon-moins");
            button.setAttribute("aria-expanded", true);
          } else {
            App.swapIcon(button, "icon-accordeon-plus");
            button.setAttribute("aria-expanded", false);
          }
          const collapseElement = button.nextElementSibling;
          if (collapseElement.style.maxHeight) {
            collapseElement.style.maxHeight = null;
            collapseElement.setAttribute("aria-hidden", true);
            collapseElement.querySelectorAll("a").forEach((link) => {
              link.setAttribute("tabindex", "-1");
            });
          } else {
            collapseElement.style.maxHeight = `${collapseElement.scrollHeight}px`;
            collapseElement.setAttribute("aria-hidden", false);
            collapseElement.querySelectorAll("a").forEach((link) => {
              link.setAttribute("tabindex", "0");
            });
          }
        });
      }
    },

    swapIcon: (buttonElement, newIcon) => {
      const svgElement = buttonElement.querySelector(".icon-accordeon");
      const useElement = svgElement.querySelector("use");
      useElement.setAttribute(
        "xlink:href",
        `/assets/images/svg/sprites/sprite-icon-acordeon.svg#${newIcon}`
      );
    },
  };

  window.addEventListener("DOMContentLoaded", App.app_init);
})();
