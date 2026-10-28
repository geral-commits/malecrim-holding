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
| `noticias.html` | Notícias |
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
src/input.css                     fonte do design system (Tailwind v4)
assets/site.css                   CSS compilado (versionado)
assets/site.js                    menu mobile, galeria com lightbox, validação do formulário
assets/*.jpg|png                  fotos e logomarcas
```

## Pendências

Ver [`CONTEUDO-PENDENTE.md`](CONTEUDO-PENDENTE.md).
