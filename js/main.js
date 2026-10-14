(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var typed = document.getElementById("typed");
  var copyBtn = document.getElementById("copy-email");
  var copyStatus = document.getElementById("copy-status");
  var canvas = document.getElementById("net");
  var hero = document.querySelector(".hero");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      var toLight = theme !== "light";
      themeBtn.setAttribute("aria-label", toLight ? "Switch to light theme" : "Switch to dark theme");
      themeBtn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f3f0e8" : "#0b0e14");
  }

  if (themeBtn) {
    setTheme(root.getAttribute("data-theme") || "dark");
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (err) {
        /* storage may be blocked */
      }
    });
  }

  var colorQuery = window.matchMedia("(prefers-color-scheme: light)");
  if (colorQuery.addEventListener) {
    colorQuery.addEventListener("change", function (event) {
      var stored = null;
      try {
        stored = localStorage.getItem("theme");
      } catch (err) {
        stored = "set";
      }
      if (!stored) setTheme(event.matches ? "light" : "dark");
    });
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    var label = navToggle.querySelector(".visually-hidden");
    if (label) label.textContent = open ? "Close menu" : "Open menu";
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNavOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNavOpen(false);
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (link) {
      byId[link.getAttribute("href").slice(1)] = link;
    });
    var currentId = "";
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) currentId = entry.target.id;
        });
        navLinks.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + currentId;
          if (on) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  if (typed && !reduceMotion) {
    var phrases = [
      "Generative AI",
      "LLMs",
      "AI agents",
      "RAG",
      "Computer vision"
    ];
    var phraseIndex = 0;
    var charIndex = phrases[0].length;
    var deleting = true;
    typed.textContent = phrases[0];

    function tick() {
      var phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        typed.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          deleting = true;
          window.setTimeout(tick, 1400);
          return;
        }
        window.setTimeout(tick, 78);
        return;
      }
      charIndex -= 1;
      typed.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, 280);
        return;
      }
      window.setTimeout(tick, 36);
    }

    tick();
  }

  function copyWithFallback(email) {
    var area = document.createElement("textarea");
    area.value = email;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.focus();
    area.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  if (copyBtn && copyStatus) {
    copyBtn.addEventListener("click", function () {
      var email = "abeehamirza18@gmail.com";
      function done(message) {
        copyStatus.textContent = message;
      }
      function fallback() {
        done(copyWithFallback(email) ? "Email copied." : "Copy is unavailable. Use the email link.");
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            done("Email copied.");
          },
          fallback
        );
      } else {
        fallback();
      }
    });
  }

  if (hero) {
    hero.addEventListener("pointermove", function (event) {
      if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
      var rect = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", event.clientX - rect.left + "px");
      hero.style.setProperty("--my", event.clientY - rect.top + "px");
    });
  }

  if (!canvas || reduceMotion) return;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var nodes = [];
  var running = true;
  var queued = false;

  function accentRgb() {
    return root.getAttribute("data-theme") === "light" ? "11, 107, 84" : "110, 231, 197";
  }

  function layout() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = width < 700 ? 26 : 48;
    nodes = [];
    for (var i = 0; i < count; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32
      });
    }
  }

  function frame() {
    queued = false;
    if (!running) return;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    var rgb = accentRgb();
    var maxDist = width < 700 ? 108 : 146;
    var i;
    var j;
    for (i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    }
    for (i = 0; i < nodes.length; i += 1) {
      for (j = i + 1; j < nodes.length; j += 1) {
        var a = nodes[i];
        var b = nodes[j];
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        var dist = Math.hypot(dx, dy);
        if (dist < maxDist) {
          ctx.strokeStyle = "rgba(" + rgb + "," + ((1 - dist / maxDist) * 0.38).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (i = 0; i < nodes.length; i += 1) {
      ctx.fillStyle = "rgba(" + rgb + ",0.9)";
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    if (running) {
      queued = true;
      window.requestAnimationFrame(frame);
    }
  }

  function start() {
    if (queued || !running) return;
    queued = true;
    window.requestAnimationFrame(frame);
  }

  layout();
  window.addEventListener("resize", function () {
    layout();
  });
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden && heroVisible;
    if (running) start();
  });

  var heroVisible = true;
  if ("IntersectionObserver" in window) {
    var heroObserver = new IntersectionObserver(
      function (entries) {
        heroVisible = entries[0].isIntersecting;
        running = heroVisible && !document.hidden;
        if (running) start();
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero || canvas);
  }
  start();
})();
