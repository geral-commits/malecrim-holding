/* ===========================================================================
   NOTÍCIAS — M/ALECRIM HOLDING
   ---------------------------------------------------------------------------
   PARA PUBLICAR UMA NOTÍCIA: copie um bloco abaixo, cole no TOPO da lista
   (a mais recente fica em primeiro) e troque os valores. Só isso.

   id       identificador único, em minúsculas e com hífens. Vira o endereço
            da notícia: noticia.html?id=SEU-ID
   origem   "holding", "rede" ou o id de uma unidade ("posto-1" … "posto-5").
            É o que define em qual filtro a notícia aparece.
   data     "AAAA-MM-DD". Deixe "" se ainda não souber — o site mostra
            "data a confirmar" em vez de inventar uma.
   imagem   caminho a partir da raiz do site, ex.: "assets/minha-foto.jpg".
            Coloque o arquivo na pasta assets/ antes.
   corpo    um item do array = um parágrafo.
   destaque frase de destaque (opcional). Use "" para não exibir.
   galeria  fotos extras (opcional). Clicar amplia.
   links    botões para post original, matéria externa etc. (opcional).
   =========================================================================== */

window.MALECRIM_NOTICIAS = [

  {
    id: "expopostos-conveniencia",
    titulo: "M/Alecrim Holding na ExpoPostos & Conveniência",
    origem: "holding",
    data: "",
    resumo:
      "Toda a nossa liderança presente no maior evento de combustíveis da América Latina, " +
      "em São Paulo, em um momento de conexão, aprendizado e troca de experiências.",
    imagem: "assets/expopostos-equipe-lideranca.jpg",
    alt: "Liderança da M/Alecrim Holding reunida no estande da ExpoPostos & Conveniência",
    corpo: [
      "A M/Alecrim Holding marcou presença na ExpoPostos, o maior evento de combustíveis da " +
      "América Latina, realizado em São Paulo, com a participação de toda a nossa liderança em " +
      "um importante momento de conexão, aprendizado e troca de experiências.",

      "Participar de eventos como esse nos permite acompanhar de perto as novidades, tendências " +
      "e soluções que movimentam o setor, além de ampliar o diálogo com profissionais e empresas " +
      "que compartilham dos mesmos desafios e oportunidades.",

      "Mais do que acompanhar o mercado, buscamos entendê-lo, aprender com ele e transformar " +
      "conhecimento em melhorias para os nossos negócios e para todo o setor.",

      "Aqui, acreditamos que o aperfeiçoamento contínuo é essencial para evoluir, inovar e estar " +
      "cada vez mais preparados para os desafios do futuro."
    ],
    destaque:
      "Em sua 22ª edição, a feira é considerada o principal condutor de negócios para as " +
      "empresas, criando o ambiente ideal para estreitar relacionamento com toda a cadeia produtiva.",
    galeria: [
      { src: "assets/expopostos-arena-conhecimento.jpg",
        alt: "Equipe da M/Alecrim Holding reunida na Arena do Conhecimento da ExpoPostos" },
      { src: "assets/expopostos-estande-01.jpg",
        alt: "Profissional da M/Alecrim Postos no painel da ExpoPostos & Conveniência" },
      { src: "assets/expopostos-estande-02.jpg",
        alt: "Representante da M/Alecrim Postos no estande da ExpoPostos & Conveniência" },
      { src: "assets/expopostos-feira-noite.jpg",
        alt: "Time da M/Alecrim Holding na área externa da ExpoPostos, em São Paulo" },
      { src: "assets/expopostos-equipe-jantar.jpg",
        alt: "Equipe da M/Alecrim Holding reunida durante a ExpoPostos" }
    ],
    links: [
      { rotulo: "Ver no LinkedIn",
        url: "https://www.linkedin.com/company/m-alecrim-holding/" }
    ]
  }

  /* -------------------------------------------------------------------------
     MODELO — copie daqui para baixo, cole lá em cima e preencha.
     Lembre da vírgula separando um bloco do outro.

  ,{
    id: "titulo-curto-da-noticia",
    titulo: "Título da notícia",
    origem: "posto-1",
    data: "2026-03-14",
    resumo: "Uma ou duas frases que aparecem no cartão da listagem.",
    imagem: "assets/nome-do-arquivo.jpg",
    alt: "Descrição da foto para quem não consegue vê-la",
    corpo: [
      "Primeiro parágrafo.",
      "Segundo parágrafo."
    ],
    destaque: "",
    galeria: [],
    links: []
  }

  ------------------------------------------------------------------------- */

];
