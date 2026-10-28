# Site institucional — M/Alecrim Holding

Site estático de 7 páginas, sem framework de runtime: HTML + Tailwind CSS v4 compilado
+ um arquivo de JavaScript para as interações.

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Home |
| `a-holding.html` | A Holding |
| `negocios.html` | Frentes de Negócio |
| `rede-de-postos.html` | Rede de Postos |
| `sustentabilidade.html` | Sustentabilidade e Impacto |
| `noticias.html` | Notícias (listagem com filtro por frente) |
| `noticia.html` | Notícia individual (`noticia.html?id=...`) |
| `contato.html` | Contato |

## Design system

Os tokens foram extraídos dos ativos reais da marca (logomarca e padrão de fundo enviados
pelo cliente), não escolhidos à mão:

| Token | Valor | Origem |
|---|---|---|
| `--color-brand` | `#001292` | azul da logomarca |
| `--color-navy-700` | `#27337B` | azul do padrão institucional de fundo |
| `--color-navy-950` | `#0a1248` | azul profundo derivado, usado em cabeçalho/rodapé |
| `--color-signal` | `#ED1C22` | vermelho da barra diagonal da logo |
| `--color-signal-ink` | `oklch(0.52 .221 27.3)` | vermelho para texto sobre fundo claro (6.0:1) |
| `--color-signal-bright` | `oklch(0.68 .185 27.3)` | vermelho para texto sobre azul escuro (5.6:1) |

Neutros derivados em OKLch na matiz 264 (a mesma do azul da marca), para que cinzas e azuis
conversem entre si.

**Tipografia:** Archivo (títulos) + IBM Plex Sans (texto).
**Elemento de marca:** o padrão de faixas diagonais vermelhas do banner oficial, usado como
transição entre seções (`.brand-stripes`, `.brand-rule`).

## Como publicar uma notícia

Todo o conteúdo editável mora na pasta `content/`. **Não é preciso mexer em HTML.**

### 1. Coloque a foto em `assets/`

Use um nome descritivo, por exemplo `assets/unidade-2-nova-pista.jpg`.

### 2. Abra `content/noticias.js` e cole um bloco novo **no topo da lista**

```js
{
  id: "unidade-2-nova-pista",
  titulo: "Unidade 2 inaugura nova pista de abastecimento",
  origem: "posto-2",
  data: "2026-03-14",
  resumo: "Uma ou duas frases que aparecem no cartão da listagem.",
  imagem: "assets/unidade-2-nova-pista.jpg",
  alt: "Nova pista de abastecimento da Unidade 2",
  corpo: [
    "Primeiro parágrafo.",
    "Segundo parágrafo."
  ],
  destaque: "",
  galeria: [],
  links: []
},
```

### 3. Commit e push

Pronto. A notícia aparece sozinha em três lugares:

- na **listagem** (`noticias.html`), já dentro do filtro certo;
- na **home**, se estiver entre as duas mais recentes;
- na **página da própria unidade** — o cartão da Unidade 2 passa a mostrar
  “Notícias desta unidade (1)”.

### O campo `origem`

É o que decide em qual filtro a notícia cai:

| Valor | Aparece como |
|---|---|
| `holding` | Holding |
| `rede` | Rede de Postos |
| `posto-1` … `posto-5` | o nome que estiver em `content/unidades.js` |

Os filtros são gerados automaticamente e **só aparecem para frentes que já têm
publicação** — nada de aba vazia no site.

### Datas

`data: ""` faz o site mostrar “data a confirmar” em vez de inventar uma.
Notícias sem data ficam no topo da lista.

## Dados das unidades

`content/unidades.js` alimenta a página “Rede de Postos” **e** os filtros de notícias.
Campo preenchido aparece; campo vazio (`""`) vira o selo “a confirmar”. Ao receber os
dados reais dos 5 postos, edite só esse arquivo.

## Testes

```bash
npm test
```

Renderiza as páginas num DOM real (jsdom) e verifica a listagem, os filtros, o estado
vazio por unidade, a página de detalhe, o id inválido, as unidades e o escape de HTML
no conteúdo.

## Uma nota sobre SEO

Notícias e unidades são renderizadas no navegador a partir de `content/`. Isso foi
escolhido de propósito: publicar vira “editar um arquivo e dar commit”, sem build.
O custo é que os buscadores indexam melhor as 7 páginas institucionais do que as
notícias individuais. Se o volume de publicações crescer, dá para gerar HTML estático
a partir dos mesmos arquivos de `content/` sem mudar nada de layout.

## Desenvolvimento

```bash
npm install
npm run dev     # recompila o CSS ao salvar
npm run serve   # http://localhost:4173
```

Para gerar o CSS de produção:

```bash
npm run build   # src/input.css -> assets/site.css
```

> `assets/site.css` é versionado de propósito: o GitHub Pages serve os arquivos como estão,
> sem etapa de build.

## Estrutura

```
index.html, a-holding.html, ...   páginas
content/noticias.js               ← as notícias (editar aqui para publicar)
content/unidades.js               ← os 5 postos (editar aqui quando chegarem os dados)
src/input.css                     fonte do design system (Tailwind v4)
assets/site.css                   CSS compilado (versionado)
assets/conteudo.js                renderiza notícias e unidades a partir de content/
assets/site.js                    menu mobile, lightbox, validação do formulário
assets/*.jpg|png                  fotos e logomarcas
tests/conteudo.test.mjs           testes de renderização
```

## Pendências

Ver [`CONTEUDO-PENDENTE.md`](CONTEUDO-PENDENTE.md).
