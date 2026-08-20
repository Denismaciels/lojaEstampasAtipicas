
/* ========================================
   CARRINHO
======================================== */

// Recupera o carrinho salvo no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


/* ========================================
   CARREGAR PÁGINA
========================================

function carregar() {

    atualizarContador();

}
*/

function carregar() {

    ///atualizarContador(); teste1
    //atuliazarQuantidadeCarrinho();
    atualizarQuantidadeCarrinho()
    carregarFundoBanner();

}

/* ========================================
   ADICIONAR PRODUTO
======================================== 

function adicionarCarrinho(id) {

    // Dados dos produtos
    const produtos = {

        1: {
            id: 1,
            nome: "A Vida Te Levará",
            preco: 59.90,
            imagem: "./imgs/imgs/estampas/a vida te levara.png"
        },

        2: {
            id: 2,
            nome: "Estampa Urbana",
            preco: 69.90,
            imagem: "./imgs/imgs/estampas/a vida te levara.png"
        },

        3: {
            id: 3,
            nome: "Sua História",
            preco: 59.90,
            imagem: "./imgs/imgs/estampas/a vida te levara.png"
        }

    };


    const produto = produtos[id];


    if (!produto) {

        console.error(
            "Produto não encontrado."
        );

        return;
    }


    // Procura se o produto já está no carrinho
    const produtoExistente = carrinho.find(
        item => item.id === id
    );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            imagem: produto.imagem,

            quantidade: 1

        });

    }


    // Salva no navegador
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    // Atualiza o número do carrinho
    atualizarContador();


    // Mensagem para o usuário
    alert(
        produto.nome +
        " foi adicionado ao carrinho!"
    );

}


/* ========================================
   ATUALIZAR CONTADOR
======================================== 

function atualizarContador() {

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );


    if (!contador) {
        return;
    }


    let quantidadeTotal = 0;


    carrinho.forEach(item => {

        quantidadeTotal +=
            item.quantidade;

    });


    contador.textContent =
        quantidadeTotal;

}

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


// ======================================================
// ADICIONAR AO CARRINHO
// ======================================================

function adicionarCarrinho(numero) {

    // PEGA O PRODUTO
   
    const produto = produtos[numero];


    if (!produto) {
        console.error(
            "Produto não encontrado."
        );
        return;
    }

    // PEGA O TAMANHO
   
    const campoTamanho = document.getElementById( "tamanho" + numero );

    const tamanho = campoTamanho.value;

    // PEGA A COR

    const campoCor = document.getElementById( "cor" + numero);

    // Se o produto tiver campo de cor,
    // pega a cor.
    // Caso não tenha, usa "Não informado".

    const cor = campoCor ? campoCor.value : "Não informado";

    // PEGA A QUANTIDADE
    
    const campoQuantidade = document.getElementById( "quantidade" + numero );
    const quantidade = campoQuantidade ? parseInt(campoQuantidade.value) : 1;

    // VALIDA QUANTIDADE

    if (
        isNaN(quantidade) ||
        quantidade < 1
    ) {
        alert(
            "Digite uma quantidade válida."
        );
        return;
    }


    // ------------------------------------------
    // VERIFICA SE JÁ EXISTE
    // MESMO PRODUTO + TAMANHO + COR
    // ------------------------------------------

    const produtoExistente =
        carrinho.find(item =>

            item.id === numero &&
            item.tamanho === tamanho &&
            item.cor === cor

        );


    if (produtoExistente) { // Se já existe, soma a quantidade

        produtoExistente.quantidade += quantidade;

    } else { // Se não existe, adiciona novo produto

        carrinho.push({
            id: numero,
            nome: produto.nome,
            preco: produto.preco,
            tamanho: tamanho,
            cor: cor,
            quantidade: quantidade
        });

    }

    // SALVA
    
    salvarCarrinho();


    // ------------------------------------------
    // MENSAGEM
    // ------------------------------------------

    alert(
        quantidade +
        "x " +
        produto.nome +
        " foi adicionado ao carrinho! 🛒"
    );


    // Atualiza contador
    atualizarQuantidadeCarrinho();
    mostrarNotificacao(produto.nome,quantidade);

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


    carrinho.forEach(produto => {

        quantidadeTotal +=
            produto.quantidade;

    });


    contador.innerText =
        quantidadeTotal;

}


/* ========================================
   LIMPAR CARRINHO
======================================== */

function limparCarrinho() {

    carrinho = [];

    localStorage.removeItem(
        "carrinho"
    );

    atualizarContador();

}

/* ========================================
   ALTERAR FUNDO DO BANNER
======================================== */

function alterarFundoBanner(event) {

    const arquivo = event.target.files[0];

    if (!arquivo) {
        return;
    }

    // Verifica se é uma imagem
    if (!arquivo.type.startsWith("image/")) {

        alert("Escolha um arquivo de imagem.");

        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (e) {

        const imagem = e.target.result;

        const banner =
            document.querySelector(".hero");

        banner.style.backgroundImage =
            `url("${imagem}")`;

        banner.style.backgroundSize =
            "cover";

        banner.style.backgroundPosition =
            "center";

        // Salva a imagem escolhida
        localStorage.setItem(
            "fundoBanner",
            imagem
        );

    };

    leitor.readAsDataURL(arquivo);
}

/* ========================================
   CARREGAR FUNDO SALVO
======================================== */

function carregarFundoBanner() {

    const fundoSalvo =
        localStorage.getItem("fundoBanner");

    if (!fundoSalvo) {
        return;
    }

    const banner =
        document.querySelector(".hero");

    banner.style.backgroundImage =
        `url("${fundoSalvo}")`;

    banner.style.backgroundSize =
        "cover";

    banner.style.backgroundPosition =
        "center";
}

////////////////////////////////////////////////////////////////////////////////////
const imagens = [
    "./imgs/imgs/estampas/meduza.png",
    "./imgs/imgs/estampas/a vida te levara.png",
    "./imgs/imgs/estampas/bob_transparent.png",
    "./imgs/imgs/estampas/coruja_transparente.png",
    "./imgs/imgs/estampas/viking_recortado.png",
    "./imgs/imgs/estampas/caveira.colorida.png",
    "./imgs/imgs/estampas/astronauta.tartaruga1.png",
];

let indice = 0;

function trocarImagem() {

    document.getElementById("imagemBanner").src =
        imagens[indice];

    indice++;

    if (indice >= imagens.length) {
        indice = 0;
    }
}

setInterval(trocarImagem, 5000);