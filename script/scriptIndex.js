// ======================================================
// SCRIPT DA PÁGINA INDEX
// ======================================================


// ======================================================
// CARRINHO
// ======================================================

let carrinho =
    JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];


// ======================================================
// PRODUTOS
// ======================================================

let produtos = [];


// ======================================================
// IMAGENS DO BANNER
// ======================================================

let imagens = [];

let indice = 0;

let intervaloBanner = null;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

function carregar() {

    atualizarQuantidadeCarrinho();

    carregarFundoBanner();

    carregarProdutos();

}


// ======================================================
// CARREGAR PRODUTOS DO JSON
// ======================================================

async function carregarProdutos() {

    try {

        const resposta =
            await fetch("./dados/produtos.json");


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar produtos.json"
            );

        }


        const dados =
            await resposta.json();


        // --------------------------------------------------
        // ACEITA JSON COMO ARRAY OU OBJETO
        // --------------------------------------------------

        produtos =
            Array.isArray(dados)
                ? dados
                : dados.produtos;


        if (!Array.isArray(produtos)) {

            throw new Error(
                "Formato do produtos.json inválido."
            );

        }


        console.log(
            "Produtos carregados no INDEX:",
            produtos
        );


        // --------------------------------------------------
        // ATUALIZA OS PRODUTOS DO INDEX
        // --------------------------------------------------

        sincronizarDestaques();


        // --------------------------------------------------
        // CARREGA AS NOVIDADES PARA O BANNER
        // --------------------------------------------------

        carregarNovidades();


    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

    }

}


// ======================================================
// ENCONTRAR PRODUTO PELO ID
// ======================================================

function encontrarProduto(id) {

    return produtos.find(
        produto =>
            Number(produto.id) === Number(id)
    );

}


// ======================================================
// NORMALIZAR COR
// ======================================================

function obterNomeCor(cor) {

    // --------------------------------------------------
    // SE NÃO EXISTIR
    // --------------------------------------------------

    if (
        cor === null ||
        cor === undefined
    ) {

        return "Não informado";

    }


    // --------------------------------------------------
    // SE JÁ FOR TEXTO OU NÚMERO
    // --------------------------------------------------

    if (
        typeof cor === "string" ||
        typeof cor === "number"
    ) {

        return String(cor);

    }


    // --------------------------------------------------
    // SE FOR OBJETO
    // --------------------------------------------------

    if (
        typeof cor === "object"
    ) {

        return (
            cor.nome ||
            cor.name ||
            cor.cor ||
            cor.valor ||
            cor.value ||
            "Não informado"
        );

    }


    return "Não informado";

}


// ======================================================
// PEGAR PRIMEIRO TAMANHO
// ======================================================

function obterTamanhoPadrao(produto) {

    if (
        Array.isArray(produto.tamanhos) &&
        produto.tamanhos.length > 0
    ) {

        return produto.tamanhos[0];

    }

    return "P";

}


// ======================================================
// PEGAR PRIMEIRA COR
// ======================================================

function obterCorPadrao(produto) {

    if (
        Array.isArray(produto.cores) &&
        produto.cores.length > 0
    ) {

        return obterNomeCor(
            produto.cores[0]
        );

    }

    return "Não informado";

}


// ======================================================
// SINCRONIZAR DESTAQUES DO INDEX COM JSON
// ======================================================

function sincronizarDestaques() {

    const cards =
        document.querySelectorAll(
            ".produtos-grid .produto"
        );


    if (!cards.length) {

        return;

    }


    cards.forEach(
        (card, indice) => {

            /*
             * Os botões do seu HTML usam:
             *
             * adicionarCarrinho(1)
             * adicionarCarrinho(2)
             * adicionarCarrinho(3)
             *
             * Portanto usamos 1, 2 e 3.
             */

            const id =
                indice + 6; //m


            const produto =
                encontrarProduto(id);


            if (!produto) {

                console.warn(
                    "Produto não encontrado:",
                    id
                );

                return;

            }


            // ------------------------------------------
            // NOME
            // ------------------------------------------

            const titulo =
                card.querySelector("h3");


            if (titulo) {

                titulo.textContent =
                    produto.nome;

            }


            // ------------------------------------------
            // DESCRIÇÃO
            // ------------------------------------------

            const descricao =
                card.querySelector(".descricao");


            if (
                descricao &&
                produto.descricao
            ) {

                descricao.textContent =
                    produto.descricao;

            }


            // ------------------------------------------
            // PREÇO
            // ------------------------------------------

            const preco =
                card.querySelector(".preco");


            if (preco) {

                preco.textContent =
                    formatarPreco(
                        produto.preco
                    );

            }


            // ------------------------------------------
            // IMAGEM
            // ------------------------------------------

            const imagem =
                card.querySelector(
                    ".produto-imagem img"
                );


            if (
                imagem &&
                produto.imagem
            ) {

                imagem.src =
                    produto.imagem;

                imagem.alt =
                    produto.nome;

            }

        }
    );

}


// ======================================================
// ADICIONAR AO CARRINHO
// ======================================================

function adicionarCarrinho(id) {

    // ------------------------------------------
    // PROCURA PRODUTO NO JSON
    // ------------------------------------------

    const produto =
        encontrarProduto(id);


    if (!produto) {

        console.error(
            "Produto não encontrado no JSON:",
            id
        );

        alert(
            "Não foi possível encontrar este produto."
        );

        return;

    }


    // ------------------------------------------
    // TAMANHO
    // ------------------------------------------

    const tamanho =
        obterTamanhoPadrao(produto);


    // ------------------------------------------
    // COR
    // ------------------------------------------

    const cor =
        obterCorPadrao(produto);


    // ------------------------------------------
    // QUANTIDADE
    // ------------------------------------------

    const quantidade = 1;


    // ------------------------------------------
    // VERIFICA PRODUTO EXISTENTE
    // ------------------------------------------

    const produtoExistente =
        carrinho.find(item =>

            Number(item.id) ===
                Number(produto.id)

            &&

            item.tamanho ===
                tamanho

            &&

            item.cor ===
                cor

        );


    // ------------------------------------------
    // SOMA QUANTIDADE
    // ------------------------------------------

    if (produtoExistente) {

        produtoExistente.quantidade +=
            quantidade;

    }


    // ------------------------------------------
    // NOVO PRODUTO
    // ------------------------------------------

    else {

        carrinho.push({

            id:
                produto.id,

            nome:
                produto.nome,

            preco:
                Number(produto.preco),

            imagem:
                produto.imagem,

            tamanho:
                tamanho,

            cor:
                cor,

            quantidade:
                quantidade

        });

    }


    // ------------------------------------------
    // SALVAR
    // ------------------------------------------

    salvarCarrinho();


    // ------------------------------------------
    // ATUALIZAR CONTADOR
    // ------------------------------------------

    atualizarQuantidadeCarrinho();


    // ------------------------------------------
    // NOTIFICAÇÃO
    // ------------------------------------------

    mostrarNotificacao(
        produto.nome
    );

}


// ======================================================
// SALVAR CARRINHO
// ======================================================

function salvarCarrinho() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

}


// ======================================================
// CONTADOR DO CARRINHO
// ======================================================

function atualizarQuantidadeCarrinho() {

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );


    if (!contador) {

        return;

    }


    let quantidadeTotal = 0;


    carrinho.forEach(
        produto => {

            quantidadeTotal +=
                Number(
                    produto.quantidade
                );

        }
    );


    contador.textContent =
        quantidadeTotal;

}


// ======================================================
// LIMPAR CARRINHO
// ======================================================

function limparCarrinho() {

    carrinho = [];


    localStorage.removeItem(
        "carrinho"
    );


    atualizarQuantidadeCarrinho();

}


// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ======================================================
// ALTERAR FUNDO DO BANNER
// ======================================================

function alterarFundoBanner(event) {

    const arquivo =
        event.target.files[0];


    if (!arquivo) {

        return;

    }


    // ------------------------------------------
    // VERIFICA SE É IMAGEM
    // ------------------------------------------

    if (
        !arquivo.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Escolha um arquivo de imagem."
        );

        return;

    }


    const leitor =
        new FileReader();


    leitor.onload =
        function(evento) {

            const imagem =
                evento.target.result;


            const banner =
                document.querySelector(
                    ".hero"
                );


            if (!banner) {

                return;

            }


            banner.style.backgroundImage =
                `url("${imagem}")`;


            banner.style.backgroundSize =
                "cover";


            banner.style.backgroundPosition =
                "center";


            localStorage.setItem(
                "fundoBanner",
                imagem
            );

        };


    leitor.readAsDataURL(
        arquivo
    );

}


// ======================================================
// CARREGAR FUNDO SALVO
// ======================================================

function carregarFundoBanner() {

    const fundoSalvo =
        localStorage.getItem(
            "fundoBanner"
        );


    if (!fundoSalvo) {

        return;

    }


    const banner =
        document.querySelector(
            ".hero"
        );


    if (!banner) {

        return;

    }


    banner.style.backgroundImage =
        `url("${fundoSalvo}")`;


    banner.style.backgroundSize =
        "cover";


    banner.style.backgroundPosition =
        "center";

}


// ======================================================
// CARREGAR IMAGENS DAS NOVIDADES
// ======================================================

function carregarNovidades() {

    // --------------------------------------------------
    // VERIFICAR SE OS PRODUTOS FORAM CARREGADOS
    // --------------------------------------------------

    if (
        !Array.isArray(produtos)
    ) {

        console.warn(
            "Produtos ainda não foram carregados."
        );

        return;

    }


    // --------------------------------------------------
    // PEGAR SOMENTE PRODUTOS COM NOVIDADE = TRUE
    // --------------------------------------------------

    const produtosNovidades =
        produtos.filter(
            produto =>
                produto.novidade === true
        );


    // --------------------------------------------------
    // PEGAR SOMENTE AS IMAGENS
    // --------------------------------------------------

    imagens =
        produtosNovidades
            .map(
                produto =>
                    produto.imagem
            )
            .filter(
                imagem =>
                    imagem
            );


    console.log(
        "Produtos marcados como novidade:",
        produtosNovidades
    );


    console.log(
        "Imagens das novidades:",
        imagens
    );


    // --------------------------------------------------
    // VERIFICAR SE EXISTEM NOVIDADES
    // --------------------------------------------------

    if (
        imagens.length === 0
    ) {

        console.warn(
            "Nenhum produto marcado como novidade."
        );

        return;

    }


    // --------------------------------------------------
    // RESETAR ÍNDICE
    // --------------------------------------------------

    indice = 0;


    // --------------------------------------------------
    // MOSTRAR PRIMEIRA IMAGEM
    // --------------------------------------------------

    trocarImagem();


    // --------------------------------------------------
    // EVITAR INTERVALOS DUPLICADOS
    // --------------------------------------------------

    if (intervaloBanner) {

        clearInterval(
            intervaloBanner
        );

    }


    // --------------------------------------------------
    // TROCA AUTOMÁTICA
    // --------------------------------------------------

    intervaloBanner =
        setInterval(
            trocarImagem,
            5000
        );

}


// ======================================================
// TROCAR IMAGEM DO BANNER
// ======================================================

function trocarImagem() {

    const imagem =
        document.getElementById(
            "imagemBanner"
        );


    if (!imagem) {

        return;

    }


    // --------------------------------------------------
    // VERIFICAR SE EXISTEM IMAGENS
    // --------------------------------------------------

    if (
        !imagens.length
    ) {

        return;

    }


    // --------------------------------------------------
    // ALTERAR IMAGEM
    // --------------------------------------------------

    imagem.src =
        imagens[indice];


    // --------------------------------------------------
    // TEXTO ALTERNATIVO
    // --------------------------------------------------

    imagem.alt =
        "Novidade da loja";


    // --------------------------------------------------
    // PRÓXIMA IMAGEM
    // --------------------------------------------------

    indice++;


    if (
        indice >= imagens.length
    ) {

        indice = 0;

    }

}


// ======================================================
// NOTIFICAÇÃO
// ======================================================

function mostrarNotificacao(
    nomeProduto
) {

    const notificacao =
        document.getElementById(
            "notificacao"
        );


    const mensagem =
        document.getElementById(
            "mensagemNotificacao"
        );


    // ------------------------------------------
    // SE O INDEX NÃO POSSUIR
    // ESSES ELEMENTOS
    // ------------------------------------------

    if (
        !notificacao ||
        !mensagem
    ) {

        return;

    }


    mensagem.textContent =
        `"${nomeProduto}" foi adicionada ao seu carrinho.`;


    notificacao.classList.add(
        "mostrar"
    );


    setTimeout(
        () => {

            notificacao.classList.remove(
                "mostrar"
            );

        },
        3000
    );

}


// ======================================================
// INICIAR
// ======================================================

carregar();
