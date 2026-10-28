/* M/Alecrim Holding — renderiza notícias e unidades a partir de content/ */
(function () {
  "use strict";

  var NOTICIAS = window.MALECRIM_NOTICIAS || [];
  var UNIDADES = window.MALECRIM_UNIDADES || [];

  var SETA =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  var MESES = ["janeiro","fevereiro","março","abril","maio","junho",
               "julho","agosto","setembro","outubro","novembro","dezembro"];

  /* ---- utilitários --------------------------------------------------- */

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function origens() {
    var mapa = {
      holding: { id: "holding", rotulo: "Holding" },
      rede: { id: "rede", rotulo: "Rede de Postos" }
    };
    UNIDADES.forEach(function (u) {
      mapa[u.id] = { id: u.id, rotulo: u.nome || u.id };
    });
    return mapa;
  }

  function rotuloOrigem(id) {
    var o = origens()[id];
    return o ? o.rotulo : "Holding";
  }

  function dataFormatada(iso) {
    if (!iso) return null;
    var p = String(iso).split("-");
    if (p.length !== 3) return null;
    var mes = MESES[Number(p[1]) - 1];
    if (!mes) return null;
    return Number(p[2]) + " de " + mes + " de " + p[0];
  }

  function selo(n) {
    var d = dataFormatada(n.data);
    return d
      ? '<time class="text-[0.8125rem] text-ink-soft" datetime="' + esc(n.data) + '">' + esc(d) + "</time>"
      : '<span class="chip-pending">Data a confirmar</span>';
  }

  function ordenadas() {
    return NOTICIAS.slice().sort(function (a, b) {
      if (!a.data && !b.data) return 0;
      if (!a.data) return -1;
      if (!b.data) return 1;
      return a.data < b.data ? 1 : -1;
    });
  }

  function cartao(n, destaque) {
    var alturaImg = destaque ? "h-56" : "h-48";
    var img = n.imagem
      ? '<img src="' + esc(n.imagem) + '" alt="' + esc(n.alt || n.titulo) + '" loading="lazy" ' +
        'decoding="async" class="' + alturaImg + ' w-full object-cover">'
      : '<div class="' + alturaImg + ' w-full brand-stripes bg-navy-950 opacity-90" aria-hidden="true"></div>';

    return (
      '<a class="card flex flex-col overflow-hidden !p-0" href="noticia.html?id=' + encodeURIComponent(n.id) + '" ' +
      'data-od-id="noticia-' + esc(n.id) + '">' +
      img +
      '<div class="flex flex-1 flex-col p-7">' +
        '<div class="flex flex-wrap items-center gap-3">' +
          '<span class="chip">' + esc(rotuloOrigem(n.origem)) + "</span>" + selo(n) +
        "</div>" +
        '<h3 class="mt-4 text-xl">' + esc(n.titulo) + "</h3>" +
        '<p class="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">' + esc(n.resumo || "") + "</p>" +
        '<span class="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-brand">' +
          "Ler notícia" + SETA +
        "</span>" +
      "</div></a>"
    );
  }

  function vazio(rotulo) {
    return (
      '<div class="col-span-full rounded-card border border-dashed border-line bg-surface p-9 text-center">' +
      '<p class="font-display text-lg font-semibold text-ink">Ainda não há publicações' +
      (rotulo ? " de " + esc(rotulo) : "") + ".</p>" +
      '<p class="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">' +
      "Assim que esta frente publicar algo, a notícia aparece aqui automaticamente." +
      "</p></div>"
    );
  }

  /* ---- listagem com filtros ------------------------------------------ */

  function montarListagem() {
    var grid = document.querySelector("[data-noticias-grid]");
    if (!grid) return;

    var barra = document.querySelector("[data-noticias-filtros]");
    var contador = document.querySelector("[data-noticias-contador]");
    var lista = ordenadas();
    var mapa = origens();

    var usadas = {};
    lista.forEach(function (n) { usadas[n.origem] = (usadas[n.origem] || 0) + 1; });

    var disponiveis = ["holding", "rede"].concat(UNIDADES.map(function (u) { return u.id; }))
      .filter(function (id) { return usadas[id]; });

    var atual = "todas";
    try {
      var q = new URLSearchParams(window.location.search).get("origem");
      if (q && (q === "todas" || mapa[q])) atual = q;
    } catch (e) { /* navegador antigo: mantém "todas" */ }

    function pintar() {
      var filtradas = atual === "todas"
        ? lista
        : lista.filter(function (n) { return n.origem === atual; });

      grid.innerHTML = filtradas.length
        ? filtradas.map(function (n) { return cartao(n); }).join("")
        : vazio(atual === "todas" ? "" : rotuloOrigem(atual));

      if (contador) {
        contador.textContent = filtradas.length === 1
          ? "1 publicação"
          : filtradas.length + " publicações";
      }

      if (barra) {
        barra.querySelectorAll("[data-filtro]").forEach(function (b) {
          var ativo = b.getAttribute("data-filtro") === atual;
          b.setAttribute("aria-pressed", String(ativo));
        });
      }
    }

    if (barra) {
      var opcoes = [{ id: "todas", rotulo: "Todas" }].concat(
        disponiveis.map(function (id) { return mapa[id]; })
      );

      barra.innerHTML = opcoes.map(function (o) {
        return '<button type="button" class="filtro" data-filtro="' + esc(o.id) + '" aria-pressed="false">' +
               esc(o.rotulo) + "</button>";
      }).join("");

      barra.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-filtro]");
        if (!btn) return;
        atual = btn.getAttribute("data-filtro");
        pintar();
        try {
          var url = new URL(window.location.href);
          if (atual === "todas") url.searchParams.delete("origem");
          else url.searchParams.set("origem", atual);
          window.history.replaceState({}, "", url);
        } catch (e2) { /* sem suporte: filtro segue funcionando */ }
      });
    }

    pintar();
  }

  /* ---- últimas notícias (home) --------------------------------------- */

  function montarDestaques() {
    var alvo = document.querySelector("[data-noticias-destaque]");
    if (!alvo) return;
    var qtd = Number(alvo.getAttribute("data-noticias-destaque")) || 2;
    var lista = ordenadas().slice(0, qtd);
    alvo.innerHTML = lista.length
      ? lista.map(function (n) { return cartao(n, true); }).join("")
      : vazio("");
  }

  /* ---- página de detalhe --------------------------------------------- */

  function montarDetalhe() {
    var alvo = document.querySelector("[data-noticia-detalhe]");
    if (!alvo) return;

    var id = "";
    try { id = new URLSearchParams(window.location.search).get("id") || ""; } catch (e) {}

    var lista = ordenadas();
    var i = -1;
    lista.forEach(function (n, k) { if (n.id === id) i = k; });

    if (i < 0) {
      alvo.innerHTML =
        '<div class="rounded-card border border-dashed border-line bg-surface p-9 text-center">' +
        '<h1 class="text-2xl">Notícia não encontrada</h1>' +
        '<p class="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">' +
        "O endereço pode ter mudado ou a publicação foi removida." +
        "</p>" +
        '<a class="btn-primary mt-7" href="noticias.html">Ver todas as notícias' + SETA + "</a></div>";
      return;
    }

    var n = lista[i];
    document.title = n.titulo + " — M/Alecrim Holding";
    var meta = document.querySelector('meta[name="description"]');
    if (meta && n.resumo) meta.setAttribute("content", n.resumo);

    var hero = n.imagem
      ? '<figure class="mt-9 overflow-hidden rounded-card border border-line">' +
        '<img src="' + esc(n.imagem) + '" alt="' + esc(n.alt || n.titulo) + '" loading="eager" ' +
        'decoding="async" class="w-full object-cover"></figure>'
      : "";

    var corpo = (n.corpo || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

    var destaque = n.destaque
      ? '<blockquote class="mt-9">' +
        '<div class="brand-rule w-24" aria-hidden="true"></div>' +
        '<p class="mt-5 font-display text-[1.25rem] font-semibold leading-snug text-ink sm:text-[1.5rem]">' +
        esc(n.destaque) + "</p></blockquote>"
      : "";

    var galeria = (n.galeria && n.galeria.length)
      ? '<h2 class="mt-12 text-xl">Registros</h2>' +
        '<p class="mt-2 text-[0.9375rem] text-ink-soft">Toque em uma imagem para ampliar.</p>' +
        '<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">' +
        n.galeria.map(function (g) {
          return '<button type="button" class="group relative block aspect-4/3 overflow-hidden rounded-card border border-line" ' +
            'data-lightbox-open data-src="' + esc(g.src) + '" data-caption="' + esc(g.alt) + '">' +
            '<img src="' + esc(g.src) + '" alt="' + esc(g.alt) + '" loading="lazy" decoding="async" ' +
            'class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.04]">' +
            '<span class="absolute inset-0 bg-navy-950/0 transition-colors duration-200 group-hover:bg-navy-950/25" aria-hidden="true"></span>' +
            '<span class="sr-only">Ampliar imagem</span></button>';
        }).join("") + "</div>"
      : "";

    var links = (n.links && n.links.length)
      ? '<div class="mt-10 flex flex-wrap gap-3">' +
        n.links.map(function (l) {
          return '<a class="btn-outline" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
                 esc(l.rotulo) + SETA + "</a>";
        }).join("") + "</div>"
      : "";

    var anterior = lista[i + 1];
    var proxima = lista[i - 1];
    var navegacao =
      '<nav class="mt-14 grid gap-4 border-t border-line pt-9 sm:grid-cols-2" aria-label="Outras notícias">' +
      (anterior
        ? '<a class="card card-interactive" href="noticia.html?id=' + encodeURIComponent(anterior.id) + '">' +
          '<span class="eyebrow text-ink-soft">Publicação anterior</span>' +
          '<span class="mt-3 block font-display text-lg font-semibold text-ink">' + esc(anterior.titulo) + "</span></a>"
        : "<div></div>") +
      (proxima
        ? '<a class="card card-interactive sm:text-right" href="noticia.html?id=' + encodeURIComponent(proxima.id) + '">' +
          '<span class="eyebrow text-ink-soft">Publicação seguinte</span>' +
          '<span class="mt-3 block font-display text-lg font-semibold text-ink">' + esc(proxima.titulo) + "</span></a>"
        : "<div></div>") +
      "</nav>";

    alvo.innerHTML =
      '<div class="flex flex-wrap items-center gap-3">' +
        '<span class="chip">' + esc(rotuloOrigem(n.origem)) + "</span>" + selo(n) +
      "</div>" +
      '<h1 class="mt-5 max-w-3xl text-[2rem] leading-[1.08] sm:text-[2.75rem]">' + esc(n.titulo) + "</h1>" +
      (n.resumo ? '<p class="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">' + esc(n.resumo) + "</p>" : "") +
      hero +
      '<div class="prose-body mt-9 max-w-2xl">' + corpo + "</div>" +
      destaque + galeria + links + navegacao;
  }

  /* ---- unidades da rede ---------------------------------------------- */

  function montarUnidades() {
    var grid = document.querySelector("[data-unidades-grid]");
    if (!grid) return;

    var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0" aria-hidden="true">' +
      '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
    var RELOGIO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>';
    var BOMBA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0" aria-hidden="true">' +
      '<path d="M4 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16"/><path d="M3 21h11"/><path d="M4 10h9"/>' +
      '<path d="M16 8l2.4 2.4a2 2 0 0 1 .6 1.4V17a1.6 1.6 0 0 0 3.2 0V9.6"/></svg>';

    var noticiasPorUnidade = {};
    NOTICIAS.forEach(function (n) {
      noticiasPorUnidade[n.origem] = (noticiasPorUnidade[n.origem] || 0) + 1;
    });

    function linha(icone, valor, rotuloVazio) {
      return '<div class="flex items-start gap-2.5">' +
        '<span class="mt-0.5 text-ink-soft">' + icone + "</span>" +
        (valor
          ? '<span class="text-ink-soft">' + esc(valor) + "</span>"
          : '<span class="chip-pending">' + esc(rotuloVazio) + "</span>") +
        "</div>";
    }

    grid.innerHTML = UNIDADES.map(function (u, k) {
      var qtd = noticiasPorUnidade[u.id] || 0;
      var servicos = (u.servicos && u.servicos.length) ? u.servicos.join(" · ") : "";
      var local = [u.endereco, u.cidade].filter(Boolean).join(" — ");

      return '<article class="card flex flex-col" data-od-id="unidade-' + esc(u.id) + '">' +
        '<div class="flex items-start justify-between gap-4">' +
          '<span class="font-display text-[0.8125rem] font-bold tracking-[0.08em] text-ink-soft">' +
          (k + 1 < 10 ? "0" : "") + (k + 1) + "</span>" +
          (u.instagram
            ? '<a class="btn-link !text-sm" href="' + esc(u.instagram) + '" target="_blank" rel="noopener">Instagram</a>'
            : "") +
        "</div>" +
        '<h3 class="mt-5 text-xl">' + esc(u.nome) + "</h3>" +
        '<div class="mt-5 flex-1 space-y-3 text-[0.9375rem]">' +
          linha(PIN, local, "Endereço a confirmar") +
          linha(RELOGIO, u.horario, "Horário a confirmar") +
          linha(BOMBA, servicos, "Serviços a confirmar") +
        "</div>" +
        '<a class="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-brand hover:underline hover:underline-offset-4" ' +
          'href="noticias.html?origem=' + encodeURIComponent(u.id) + '">' +
          (qtd ? "Notícias desta unidade (" + qtd + ")" : "Notícias desta unidade") + SETA +
        "</a></article>";
    }).join("");
  }

  montarListagem();
  montarDestaques();
  montarDetalhe();
  montarUnidades();
})();
