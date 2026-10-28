/* M/Alecrim Holding — interações do site institucional */
(function () {
  "use strict";

  /* ---- Ano corrente no rodapé ------------------------------------- */
  document.querySelectorAll("[data-ano]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- Menu mobile -------------------------------------------------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.getElementById("menu-mobile");

  if (toggle && menu) {
    var iconOpen = toggle.querySelector('[data-menu-icon="open"]');
    var iconClose = toggle.querySelector('[data-menu-icon="close"]');

    var setMenu = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
      if (iconOpen) iconOpen.hidden = open;
      if (iconClose) iconClose.hidden = !open;
    };

    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });

    var mq = window.matchMedia("(min-width: 1024px)");
    var onChange = function () {
      if (mq.matches && !menu.hidden) setMenu(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---- Lightbox da galeria ------------------------------------------ */
  var lightbox = document.getElementById("lightbox");

  if (lightbox) {
    var lbImg = lightbox.querySelector("[data-lightbox-img]");
    var lbCaption = lightbox.querySelector("[data-lightbox-caption]");
    var lbClose = lightbox.querySelector("[data-lightbox-close]");
    var lastFocus = null;

    var closeLightbox = function () {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
      document.body.style.overflow = "";
      if (lbImg) lbImg.src = "";
      if (lastFocus) lastFocus.focus();
    };

    var openLightbox = function (trigger) {
      if (!lbImg) return;
      lastFocus = trigger;
      lbImg.src = trigger.getAttribute("data-src") || "";
      lbImg.alt = trigger.getAttribute("data-caption") || "";
      if (lbCaption) lbCaption.textContent = trigger.getAttribute("data-caption") || "";
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
      document.body.style.overflow = "hidden";
      if (lbClose) lbClose.focus();
    };

    document.querySelectorAll("[data-lightbox-open]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openLightbox(btn);
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) closeLightbox();
      // mantém o foco preso no diálogo enquanto ele está aberto
      if (e.key === "Tab" && !lightbox.classList.contains("hidden") && lbClose) {
        e.preventDefault();
        lbClose.focus();
      }
    });
  }

  /* ---- Formulário de contato ---------------------------------------- */
  var form = document.querySelector("[data-contato-form]");

  if (form) {
    var status = form.querySelector("[data-form-status]");

    var mensagens = {
      nome: "Informe o seu nome completo.",
      email: "Informe um e-mail válido, como nome@empresa.com.br.",
      assunto: "Escolha o assunto do contato.",
      mensagem: "Escreva uma mensagem com pelo menos 10 caracteres."
    };

    var valida = function (campo) {
      var valor = (campo.value || "").trim();
      if (campo.name === "email") {
        return valor.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
      }
      if (campo.name === "mensagem") return valor.length >= 10;
      return valor.length > 0;
    };

    var marca = function (campo, ok) {
      var alvo = form.querySelector('[data-erro-de="' + campo.name + '"]');
      campo.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!alvo) return;
      alvo.id = "erro-" + campo.name;
      alvo.textContent = ok ? "" : mensagens[campo.name] || "Campo obrigatório.";
      alvo.classList.toggle("hidden", ok);
      if (ok) campo.removeAttribute("aria-describedby");
      else campo.setAttribute("aria-describedby", alvo.id);
    };

    var campos = Array.prototype.slice.call(form.querySelectorAll("[required]"));

    campos.forEach(function (campo) {
      campo.addEventListener("blur", function () {
        marca(campo, valida(campo));
      });
      campo.addEventListener("input", function () {
        if (campo.getAttribute("aria-invalid") === "true") marca(campo, valida(campo));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var primeiroInvalido = null;

      campos.forEach(function (campo) {
        var ok = valida(campo);
        marca(campo, ok);
        if (!ok && !primeiroInvalido) primeiroInvalido = campo;
      });

      if (!status) return;
      status.classList.remove("hidden");

      if (primeiroInvalido) {
        status.textContent = "Revise os campos destacados antes de enviar.";
        status.setAttribute("data-estado", "erro");
        primeiroInvalido.focus();
        return;
      }

      status.textContent =
        "Mensagem validada. O envio será ativado assim que o destino de recebimento for configurado.";
      status.setAttribute("data-estado", "ok");
    });
  }
})();
