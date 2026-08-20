// ======================================================
// PRODUTOS
// ======================================================

let produtos = [];

// ======================================================
// FORMATAR PREÇO
// ======================================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

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
                "Não foi possível carregar o produtos.json"
            );

        }


        const dados =
            await resposta.json();


        produtos =
            dados.produtos;


        console.log(
            "Produtos carregados:",
            produtos
        );


        // Depois que o JSON carregar,
        // monta os produtos na tela.

        montarProdutos();


    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

    }

}

// ======================================================
// MONTAR PRODUTOS NA PÁGINA
// ======================================================

function montarProdutos() {

    const grade =
        document.getElementById("gradeProdutos");


    // Se não existir essa área na página,
    // simplesmente não faz nada.

    if (!grade) {
        return;
    }


    // Limpa a grade

    grade.innerHTML = "";


    // Somente produtos ativos

    const produtosAtivos =
        produtos.filter(
            produto => produto.ativo === true
        );


    produtosAtivos.forEach(produto => {


        // ==================================================
        // CARD
        // ==================================================

        const card =
            document.createElement("article");

        card.className = "produto";


        // ==================================================
        // IMAGEM
        // ==================================================

        const areaImagem =
            document.createElement("div");

        areaImagem.className =
            "produto-imagem";


        const imagem =
            document.createElement("img");

        imagem.src =
            produto.imagem;

        imagem.alt =
            "Camiseta " + produto.nome;


        areaImagem.appendChild(imagem);


        // ==================================================
        // INFORMAÇÕES
        // ==================================================

        const informacoes =
            document.createElement("div");

        informacoes.className =
            "produto-info";


        // ==================================================
        // NOME
        // ==================================================

        const titulo =
            document.createElement("h2");

        titulo.textContent =
            produto.nome;


        // ==================================================
        // DESCRIÇÃO
        // ==================================================

        const descricao =
            document.createElement("p");

        descricao.className =
            "descricao";

        descricao.textContent =
            produto.descricao;


        // ==================================================
        // PREÇO
        // ==================================================

        const preco =
            document.createElement("p");

        preco.className =
            "preco";

        preco.textContent =
            formatarPreco(produto.preco);


        // ==================================================
        // TAMANHO
        // ==================================================

        const campoTamanho =
            document.createElement("div");

        campoTamanho.className =
            "campo-produto";


        const labelTamanho =
            document.createElement("label");

        labelTamanho.textContent =
            "Tamanho";


        const selectTamanho =
            document.createElement("select");

        selectTamanho.id =
            "tamanho" + produto.id;


        produto.tamanhos.forEach(tamanho => {

            const opcao =
                document.createElement("option");

            opcao.value =
                tamanho;

            opcao.textContent =
                tamanho;

            selectTamanho.appendChild(opcao);

        });


        campoTamanho.appendChild(
            labelTamanho
        );

        campoTamanho.appendChild(
            selectTamanho
        );


        // ==================================================
        // COR
        // ==================================================

        const campoCor =
            document.createElement("div");

        campoCor.className =
            "campo-produto";


        const labelCor =
            document.createElement("label");

        labelCor.textContent =
            "Cor";


        const selectCor =
            document.createElement("select");

        selectCor.id =
            "cor" + produto.id;


        produto.cores.forEach(cor => {

            const opcao =
                document.createElement("option");


            /*
             * Aqui tratamos os dois casos:
             *
             * "Branca"
             *
             * ou
             *
             * { nome: "Branca" }
             */

            if (typeof cor === "object") {

                opcao.value =
                    cor.nome || cor.valor || "";

                opcao.textContent =
                    cor.nome || cor.valor || "";

            } else {

                opcao.value =
                    cor;

                opcao.textContent =
                    cor;

            }


            selectCor.appendChild(opcao);

        });


        campoCor.appendChild(
            labelCor
        );

        campoCor.appendChild(
            selectCor
        );


        // ==================================================
        // QUANTIDADE
        // ==================================================

        const campoQuantidade =
            document.createElement("div");

        campoQuantidade.className =
            "campo-produto";


        const labelQuantidade =
            document.createElement("label");

        labelQuantidade.textContent =
            "Quantidade";


        const inputQuantidade =
            document.createElement("input");

        inputQuantidade.type =
            "number";

        inputQuantidade.id =
            "quantidade" + produto.id;

        inputQuantidade.min =
            "1";

        inputQuantidade.value =
            "1";


        campoQuantidade.appendChild(
            labelQuantidade
        );

        campoQuantidade.appendChild(
            inputQuantidade
        );


        // ==================================================
        // BOTÃO
        // ==================================================

        const botao =
            document.createElement("button");

        botao.type =
            "button";

        botao.className =
            "btn-comprar";

        botao.textContent =
            "🛒 Adicionar ao carrinho";


        botao.addEventListener(
            "click",
            function() {

                adicionarCarrinho(
                    produto.id
                );

            }
        );


        // ==================================================
        // MONTA INFORMAÇÕES
        // ==================================================

        informacoes.appendChild(
            titulo
        );

        informacoes.appendChild(
            descricao
        );

        informacoes.appendChild(
            preco
        );

        informacoes.appendChild(
            campoTamanho
        );

        informacoes.appendChild(
            campoCor
        );

        informacoes.appendChild(
            campoQuantidade
        );

        informacoes.appendChild(
            botao
        );


        // ==================================================
        // MONTA CARD
        // ==================================================

        card.appendChild(
            areaImagem
        );

        card.appendChild(
            informacoes
        );


        // ==================================================
        // COLOCA NA GRADE
        // ==================================================

        grade.appendChild(
            card
        );

    });

}


// ======================================================
// CARRINHO
// ======================================================

let carrinho =
    JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];


// ======================================================
// CARREGAR PÁGINA
// ======================================================

function carregar() {

    carregarNome();

    atualizarQuantidadeCarrinho();

}


// ======================================================
// NOME DO CLIENTE
// ======================================================

const formNome =
    document.getElementById("formNome");


if (formNome) {

    formNome.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const campoNome =
                document.getElementById(
                    "username"
                );


            const nome =
                campoNome.value.trim();


            if (nome === "") {

                const areaNome =
                    document.getElementById(
                        "areaNome"
                    );


                if (areaNome) {

                    areaNome.style.display =
                        "none";

                }

                return;

            }


            localStorage.setItem(
                "nomeCliente",
                nome
            );


            mostrarNome(nome);

        }
    );

}


// ======================================================
// MOSTRAR NOME
// ======================================================

function mostrarNome(nome) {

    const titulo =
        document.getElementById(
            "tituloBoasVindas"
        );


    const areaNome =
        document.getElementById(
            "areaNome"
        );


    if (titulo) {

        titulo.innerText =
            "BEM-VINDO, " +
            nome.toUpperCase() +
            "! 👕";

    }


    if (areaNome) {

        areaNome.style.display =
            "none";

    }

}


// ======================================================
// CARREGAR NOME SALVO
// ======================================================

function carregarNome() {

    const nome =
        localStorage.getItem(
            "nomeCliente"
        );


    if (nome) {

        mostrarNome(nome);

    }

}


// ======================================================
// ADICIONAR AO CARRINHO
// ======================================================

function adicionarCarrinho(numero) {

    // --------------------------------------------------
    // PROCURA PRODUTO
    // --------------------------------------------------

    const produto =
        produtos.find(
            item => item.id === numero
        );


    if (!produto) {

        console.error(
            "Produto não encontrado:",
            numero
        );

        return;

    }


    // --------------------------------------------------
    // TAMANHO
    // --------------------------------------------------

    const campoTamanho =
        document.getElementById(
            "tamanho" + numero
        );


    const tamanho =
        campoTamanho
            ? campoTamanho.value
            : produto.tamanhos[0];


    // --------------------------------------------------
    // COR
    // --------------------------------------------------

    const campoCor =
        document.getElementById(
            "cor" + numero
        );


    let cor;


    if (campoCor) {

        const opcaoSelecionada =
            campoCor.options[
                campoCor.selectedIndex
            ];


        // --------------------------------------------------
        // COR COMO OBJETO
        // --------------------------------------------------

        if (
            opcaoSelecionada.dataset.codigo
        ) {

            cor = {

                codigo:
                    opcaoSelecionada.dataset.codigo,

                nome:
                    opcaoSelecionada.textContent

            };

        }

        // --------------------------------------------------
        // COR COMO TEXTO
        // --------------------------------------------------

        else {

            cor =
                campoCor.value;

        }

    }

    else {

        cor =
            "Não informado";

    }


    // --------------------------------------------------
    // QUANTIDADE
    // --------------------------------------------------

    const campoQuantidade =
        document.getElementById(
            "quantidade" + numero
        );


    const quantidade =
        campoQuantidade
            ? parseInt(
                campoQuantidade.value
            )
            : 1;


    // --------------------------------------------------
    // VALIDAR QUANTIDADE
    // --------------------------------------------------

    if (
        isNaN(quantidade) ||
        quantidade < 1
    ) {

        alert(
            "Digite uma quantidade válida."
        );

        return;

    }


    // ==================================================
    // VERIFICAR PRODUTO EXISTENTE
    // ==================================================

    const produtoExistente =
        carrinho.find(item => {

            const mesmaCor =
                obterCodigoCor(item.cor) ===
                obterCodigoCor(cor);


            return (
                item.id === numero &&
                item.tamanho === tamanho &&
                mesmaCor
            );

        });


    // ==================================================
    // SOMAR QUANTIDADE
    // ==================================================

    if (produtoExistente) {

        produtoExistente.quantidade +=
            quantidade;

    }

    // ==================================================
    // NOVO PRODUTO
    // ==================================================

    else {

        carrinho.push({

            id:
                numero,

            nome:
                produto.nome,

            preco:
                produto.preco,

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


    // ==================================================
    // SALVAR
    // ==================================================

    salvarCarrinho();


    // ==================================================
    // ATUALIZAR CONTADOR
    // ==================================================

    atualizarQuantidadeCarrinho();


    // ==================================================
    // NOTIFICAÇÃO
    // ==================================================

    mostrarNotificacao(
        produto.nome
    );

}


// ======================================================
// OBTER CÓDIGO DA COR
// ======================================================

function obterCodigoCor(cor) {

    // Se for objeto

    if (
        typeof cor === "object" &&
        cor !== null
    ) {

        return cor.codigo;

    }


    // Se for texto

    return cor;

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


    let quantidadeTotal =
        0;


    carrinho.forEach(produto => {

        quantidadeTotal +=
            Number(
                produto.quantidade
            );

    });


    contador.innerText =
        quantidadeTotal;

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

carregarProdutos();