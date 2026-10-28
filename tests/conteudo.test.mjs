import { JSDOM } from "jsdom";
import fs from "node:fs";

const raiz = process.cwd();
let falhas = 0;
const ok = (c, m) => { console.log((c ? "  ✓ " : "  ✗ ") + m); if (!c) falhas++; };

function abrir(arquivo, query = "") {
  const html = fs.readFileSync(`${raiz}/${arquivo}`, "utf8");
  const dom = new JSDOM(html, { url: `https://exemplo.test/${arquivo}${query}`, runScripts: "outside-only" });
  const w = dom.window;
  for (const s of ["content/unidades.js", "content/noticias.js", "assets/conteudo.js", "assets/site.js"]) {
    w.eval(fs.readFileSync(`${raiz}/${s}`, "utf8"));
  }
  return w;
}

console.log("\n[noticias.html] listagem e filtros");
{
  const w = abrir("noticias.html");
  const d = w.document;
  const cards = d.querySelectorAll("[data-noticias-grid] a[href^='noticia.html?id=']");
  ok(cards.length === 1, `renderizou ${cards.length} cartão(ões) a partir de content/noticias.js`);
  const filtros = [...d.querySelectorAll("[data-filtro]")].map(b => b.getAttribute("data-filtro"));
  ok(filtros[0] === "todas", `filtros gerados: ${filtros.join(", ")}`);
  ok(filtros.length === 2 && filtros.includes("holding"), "só aparecem filtros de frentes que têm publicação");
  ok(d.querySelector("[data-noticias-contador]").textContent === "1 publicação", "contador correto");
  ok(d.querySelector("[data-filtro='todas']").getAttribute("aria-pressed") === "true", "filtro ativo marcado com aria-pressed");
}

console.log("\n[noticias.html?origem=posto-3] estado vazio de uma unidade");
{
  const w = abrir("noticias.html", "?origem=posto-3");
  const d = w.document;
  const cards = d.querySelectorAll("[data-noticias-grid] a[href^='noticia.html?id=']");
  ok(cards.length === 0, "nenhum cartão para uma unidade sem publicação");
  const txt = d.querySelector("[data-noticias-grid]").textContent;
  ok(/Ainda não há publicações de Unidade 3/.test(txt), "estado vazio nomeia a unidade filtrada");
}

console.log("\n[noticia.html?id=expopostos-conveniencia] detalhe");
{
  const w = abrir("noticia.html", "?id=expopostos-conveniencia");
  const d = w.document;
  ok(d.querySelectorAll("[data-noticia-detalhe] h1").length === 1, "um h1 renderizado");
  ok(/ExpoPostos/.test(d.querySelector("h1").textContent), "título correto");
  ok(d.title.startsWith("M/Alecrim Holding na ExpoPostos"), `<title> atualizado: ${d.title}`);
  ok(d.querySelectorAll("[data-lightbox-open]").length === 5, "galeria com 5 imagens clicáveis");
  ok(d.querySelectorAll("[data-noticia-detalhe] p").length >= 4, "corpo com todos os parágrafos");
  ok(d.querySelector("[data-noticia-detalhe] .chip-pending") !== null, "data vazia vira selo 'a confirmar'");
  ok(/linkedin\.com/.test(d.querySelector("[data-noticia-detalhe]").innerHTML), "link externo presente");
}

console.log("\n[noticia.html?id=inexistente] id inválido");
{
  const w = abrir("noticia.html", "?id=nao-existe");
  const d = w.document;
  ok(/Notícia não encontrada/.test(d.body.textContent), "estado de não encontrado");
  ok(d.querySelector("a[href='noticias.html']") !== null, "oferece caminho de volta");
}

console.log("\n[rede-de-postos.html] unidades vindas de content/unidades.js");
{
  const w = abrir("rede-de-postos.html");
  const d = w.document;
  const cards = d.querySelectorAll("[data-unidades-grid] article");
  ok(cards.length === 5, `renderizou ${cards.length} unidades`);
  const links = d.querySelectorAll("[data-unidades-grid] a[href^='noticias.html?origem=']");
  ok(links.length === 5, "cada unidade tem link para as próprias notícias");
  ok(links[0].getAttribute("href") === "noticias.html?origem=posto-1", "link da unidade 1 aponta para o filtro certo");
  ok(d.querySelectorAll("[data-unidades-grid] .chip-pending").length === 15, "campos vazios viram selo 'a confirmar' (3 por unidade)");
}

console.log("\n[index.html] últimas notícias na home");
{
  const w = abrir("index.html");
  const d = w.document;
  const cards = d.querySelectorAll("[data-noticias-destaque] a[href^='noticia.html?id=']");
  ok(cards.length === 1, `home mostra ${cards.length} publicação(ões) mais recente(s)`);
}

console.log("\n[XSS] escape de conteúdo");
{
  const w = abrir("noticias.html");
  w.MALECRIM_NOTICIAS = [{ id: "x", titulo: '<img src=x onerror=alert(1)>', origem: "holding", data: "", resumo: "r" }];
  const d = w.document;
  d.querySelector("[data-noticias-grid]").innerHTML = "";
  w.eval(fs.readFileSync(`${raiz}/assets/conteudo.js`, "utf8"));
  const grid = d.querySelector("[data-noticias-grid]");
  ok(grid.querySelectorAll("img[onerror]").length === 0, "nenhum elemento injetado no DOM");
  ok(/&lt;img/.test(grid.innerHTML), "o HTML do título vira texto escapado");
  ok(grid.querySelector("h3").textContent === "<img src=x onerror=alert(1)>", "título preservado como texto literal");
}

console.log(falhas === 0 ? "\n✓ Todos os testes passaram" : `\n✗ ${falhas} falha(s)`);
process.exit(falhas ? 1 : 0);
