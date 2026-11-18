/* Editorial enhancement layer.
   Presentation only: it never mutates the application's data arrays,
   render functions, routing, or protected markup. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var themeKey = "pa-theme";

  function applySavedTheme() {
    try {
      if (localStorage.getItem(themeKey) === "light") {
        document.body.classList.add("light");
      } else {
        document.body.classList.remove("light");
      }
    } catch (error) {
      /* Storage can be unavailable in private modes. */
    }
  }

  function syncThemeButtons() {
    var isLight = document.body.classList.contains("light");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (button) {
      button.innerHTML = isLight ? "&#9728;" : "&#9790;";
      button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      button.setAttribute("title", isLight ? "Switch to dark theme" : "Switch to light theme");
    });
  }

  function toggleTheme(event) {
    if (event) event.preventDefault();
    var isLight = document.body.classList.toggle("light");
    try {
      localStorage.setItem(themeKey, isLight ? "light" : "dark");
    } catch (error) {
      /* Ignore storage errors. */
    }
    syncThemeButtons();
  }

  applySavedTheme();

  document.addEventListener("click", function (event) {
    var themeButton = event.target.closest("[data-theme-toggle]");
    if (themeButton) {
      toggleTheme(event);
      return;
    }

    var navButton = event.target.closest("[data-nav-toggle]");
    if (navButton) {
      var nav = document.getElementById("edNav");
      if (nav) {
        nav.classList.toggle("open");
        navButton.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
      }
      return;
    }

    var filterButton = event.target.closest(".ed-filter[data-filter]");
    if (filterButton) {
      var filter = filterButton.getAttribute("data-filter");
      document.querySelectorAll(".ed-filter[data-filter]").forEach(function (button) {
        button.classList.toggle("active", button === filterButton);
        button.setAttribute("aria-pressed", button === filterButton ? "true" : "false");
      });
      document.querySelectorAll("[data-category]").forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !show;
      });
      return;
    }

    var copyButton = event.target.closest("[data-copy-link]");
    if (copyButton) {
      var url = window.location.href;
      var done = function () {
        var original = copyButton.textContent;
        copyButton.textContent = "Link copied";
        window.setTimeout(function () {
          copyButton.textContent = original;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {});
      } else {
        var input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand("copy"); done(); } catch (error) {}
        document.body.removeChild(input);
      }
    }
  });

  syncThemeButtons();

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  if (!reduceMotion && window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;
        var rotateY = (x - 0.5) * 7;
        var rotateX = (0.5 - y) * 7;
        card.style.transform = "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateY(-4px)";
        card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  var revealItems = document.querySelectorAll(".ed-reveal");
  if (revealItems.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      revealItems.forEach(function (item) { revealObserver.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    }
  }

  var progress = document.getElementById("edProgress");
  var articleBody = document.querySelector(".ed-article-body");
  var scrollTop = document.getElementById("edScrollTop");

  function updateReadingState() {
    var doc = document.documentElement;
    var top = window.scrollY || doc.scrollTop || 0;
    var height = Math.max(1, doc.scrollHeight - window.innerHeight);

    if (progress) {
      var articleTop = articleBody ? articleBody.offsetTop : 0;
      var articleHeight = articleBody ? articleBody.offsetHeight : height;
      var articleProgress = ((top - articleTop + window.innerHeight * 0.35) / Math.max(1, articleHeight)) * 100;
      progress.style.width = Math.max(0, Math.min(100, articleProgress)) + "%";
    }

    if (scrollTop) {
      scrollTop.classList.toggle("visible", top > 700);
    }
  }

  window.addEventListener("scroll", updateReadingState, { passive: true });
  updateReadingState();

  if (scrollTop) {
    scrollTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".ed-toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var sections = tocLinks.map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    }).filter(Boolean);

    var tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-18% 0px -68% 0px", threshold: 0 });

    sections.forEach(function (section) { tocObserver.observe(section); });
  }
})();
