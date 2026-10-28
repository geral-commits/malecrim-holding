# Conteúdo pendente — site M/Alecrim Holding

Tudo que está publicado no site veio de material enviado pelo cliente ou dos canais oficiais
da marca. **Nenhum dado foi inventado.** Os itens abaixo estão marcados no site com o selo
“a confirmar / conteúdo a receber” e entram no ar assim que o cliente enviar o material.

## Bloqueantes para publicação definitiva

| Página | Seção | O que falta |
|---|---|---|
| `contato.html` | Canais diretos | E-mail, telefone e endereço oficiais |
| `contato.html` | Formulário | Destino de recebimento (e-mail ou serviço tipo Formspree) — hoje o formulário valida mas não envia |
| `content/unidades.js` | Unidades | Nome, cidade, endereço, horário e serviços dos 5 postos — **um arquivo só**, alimenta a página da rede e os filtros de notícias |

## Enriquecem o site (não bloqueiam)

| Página | Seção | O que falta |
|---|---|---|
| `a-holding.html` | Liderança | Nomes, cargos, fotos e minibios |
| `a-holding.html` | Nossa origem | Ano de fundação e marcos da história |
| `a-holding.html` | Foto da família | Legenda oficial (quem aparece) |
| `negocios.html` | Investimentos | Setores e empresas do portfólio |
| `sustentabilidade.html` | Indicadores | Métricas ambientais, certificações e projetos sociais |
| `content/noticias.js` | ExpoPostos | Data da publicação (campo `data`) |

## Publicar notícias

A partir de agora cada frente tem o seu espaço: a holding, a rede e cada uma das 5 unidades.
Para publicar, basta editar `content/noticias.js` — o passo a passo está no `README.md`.

## Ativos de marca

- **Logomarca vetorial (SVG, AI ou EPS).** As logos em `assets/` foram extraídas dos posts
  enviados e estão em resolução baixa (259×80 px originais). Servem bem no cabeçalho e rodapé,
  mas uma versão vetorial deixaria tudo nítido em qualquer tamanho.
- **Fotos em alta.** As imagens do site foram recortadas dos posts de redes sociais. Os
  originais renderizariam melhor, principalmente nas faixas de largura total.
- **Manual de marca**, se existir, para confirmar os valores exatos de cor e as fontes oficiais.

## Domínio e publicação

- Domínio próprio a definir (hoje o site roda no endereço do GitHub Pages).
- Se houver domínio, apontar o DNS e atualizar `BASE_URL` nas meta tags canônicas/Open Graph.
