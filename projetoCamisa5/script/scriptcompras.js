// ======================================================
// CARRINHO
// ======================================================

let carrinho =
    JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];


// ======================================================
// ELEMENTOS DA PÁGINA
// ======================================================

const listaCarrinho =
    document.getElementById("listaCarrinho");

const resumo =
    document.getElementById("resumo");

const totalProdutos =
    document.getElementById("totalProdutos");

const totalPecas =
    document.getElementById("totalPecas");

const subtotal =
    document.getElementById("subtotal");

const total =
    document.getElementById("total");

const formPedido =
    document.getElementById("formPedido");


// ======================================================
// ELEMENTOS DO MODAL
// ======================================================

const modalConfirmacao =
    document.getElementById("modalConfirmacao");

const confirmacaoNome =
    document.getElementById("confirmacaoNome");

const confirmacaoProdutos =
    document.getElementById("confirmacaoProdutos");

const confirmacaoPagamento =
    document.getElementById("confirmacaoPagamento");

const confirmacaoTotal =
    document.getElementById("confirmacaoTotal");


// ======================================================
// FORMATAÇÃO DE PREÇO
// ======================================================

function formatarPreco(valor) {

    return "R$ " +
        Number(valor)
            .toFixed(2)
            .replace(".", ",");

}


// ======================================================
// MOSTRAR CARRINHO
// ======================================================

function mostrarCarrinho() {

    if (!listaCarrinho) {
        return;
    }

    listaCarrinho.innerHTML = "";


    // --------------------------------------------------
    // CARRINHO VAZIO
    // --------------------------------------------------

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `

            <div class="vazio">

                <h2>
                    Seu carrinho está vazio 😔
                </h2>

                <p>
                    Escolha uma camiseta para começar sua compra.
                </p>

                <a href="estampas.html">
                    Ver camisetas
                </a>

            </div>

        `;


        if (resumo) {
            resumo.style.display = "none";
        }

        return;
    }


    // --------------------------------------------------
    // EXISTEM PRODUTOS
    // --------------------------------------------------

    if (resumo) {
        resumo.style.display = "block";
    }


    carrinho.forEach(
        (produto, index) => {

            const subtotalProduto =
                Number(produto.preco) *
                Number(produto.quantidade);


            const item =
                document.createElement("article");


            item.className = "item";


            item.innerHTML = `

                <div class="item-imagem">

                    <img
                        src="${
                            produto.imagem ||
                            "./imgs/imgs/logo/possivelLogo2.png"
                        }"
                        alt="${produto.nome}"
                    >

                </div>


                <div class="item-info">

                    <h2>
                        ${produto.nome}
                    </h2>


                    <p>
                        Tamanho:
                        <strong>
                            ${produto.tamanho}
                        </strong>
                    </p>


                    <p>
                        Cor:
                        <strong>
                            ${obterNomeCor(produto.cor)}
                        </strong>
                    </p>


                    <p>
                        Preço unitário:
                        <strong>
                            ${formatarPreco(produto.preco)}
                        </strong>
                    </p>


                    <p class="preco">

                        ${formatarPreco(subtotalProduto)}

                    </p>

                </div>


                <div class="quantidade">

                    <button
                        type="button"
                        onclick="diminuir(${index})"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>


                    <strong>
                        ${produto.quantidade}
                    </strong>


                    <button
                        type="button"
                        onclick="aumentar(${index})"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>


                    <button
                        type="button"
                        class="remover"
                        onclick="remover(${index})"
                        aria-label="Remover produto"
                    >
                        🗑
                    </button>

                </div>

            `;


            listaCarrinho.appendChild(item);

        }
    );


    atualizarResumo();

}


// ======================================================
// OBTER NOME DA COR
// ======================================================

function obterNomeCor(cor) {

    // Se não existir cor

    if (
        cor === undefined ||
        cor === null ||
        cor === ""
    ) {

        return "Não informado";

    }


    // Se a cor for objeto

    if (
        typeof cor === "object"
    ) {

        return (
            cor.nome ||
            cor.name ||
            cor.valor ||
            cor.value ||
            "Não informado"
        );

    }


    // Se for texto

    return String(cor);

}


// ======================================================
// OBTER CÓDIGO DA COR
// ======================================================

function obterCodigoCor(cor) {

    const nomeCor =
        obterNomeCor(cor)
            .toUpperCase()
            .trim();


    const mapaCor = {

        "BRANCA": "01",
        "BRANCO": "01",

        "PRETA": "02",
        "PRETO": "02",

        "AZUL": "03",

        "VERMELHA": "04",
        "VERMELHO": "04",

        "VERDE": "05",

        "AMARELA": "06",
        "AMARELO": "06"

    };


    return (
        mapaCor[nomeCor] ||
        "00"
    );

}


// ======================================================
// OBTER CÓDIGO DO TAMANHO
// ======================================================

function obterCodigoTamanho(tamanho) {

    const valor =
        String(tamanho || "P")
            .toUpperCase()
            .trim();


    const mapaTamanho = {

        "P": "TP",

        "M": "TM",

        "G": "TG",

        "GG": "TGG"

    };


    return (
        mapaTamanho[valor] ||
        "TP"
    );

}


// ======================================================
// GERAR CÓDIGO DO PRODUTO
// ======================================================
//
// Exemplo:
//
// P01-TP-C01-Q01
//
// P01 = produto 01
// TP  = tamanho P
// C01 = cor branca
// Q01 = quantidade 1
//
// ======================================================

function gerarCodigoProduto(produto) {

    const idProduto =
        Number(produto.id)
            .toString()
            .padStart(2, "0");


    const tamanho =
        obterCodigoTamanho(
            produto.tamanho
        );


    const codigoCor =
        obterCodigoCor(
            produto.cor
        );


    const quantidade =
        Number(
            produto.quantidade || 1
        );


    const quantidadeFormatada =
        quantidade
            .toString()
            .padStart(2, "0");


    return (

        "P" +
        idProduto +

        "-" +

        tamanho +

        "-C" +
        codigoCor +

        "-Q" +
        quantidadeFormatada

    );

}


// ======================================================
// ATUALIZAR RESUMO
// ======================================================

function atualizarResumo() {

    if (!totalProdutos) {
        return;
    }


    // --------------------------------------------------
    // PRODUTOS DIFERENTES
    // --------------------------------------------------

    totalProdutos.textContent =
        carrinho.length;


    // --------------------------------------------------
    // TOTAL DE PEÇAS
    // --------------------------------------------------

    const quantidadePecas =
        carrinho.reduce(

            (soma, produto) =>

                soma +
                Number(
                    produto.quantidade
                ),

            0

        );


    totalPecas.textContent =
        quantidadePecas;


    // --------------------------------------------------
    // VALOR TOTAL
    // --------------------------------------------------

    const valorTotal =
        carrinho.reduce(

            (soma, produto) =>

                soma +
                Number(produto.preco) *
                Number(produto.quantidade),

            0

        );


    subtotal.textContent =
        formatarPreco(
            valorTotal
        );


    total.textContent =
        formatarPreco(
            valorTotal
        );

}


// ======================================================
// AUMENTAR QUANTIDADE
// ======================================================

function aumentar(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho[index].quantidade =
        Number(
            carrinho[index].quantidade
        ) + 1;


    salvarCarrinho();

}


// ======================================================
// DIMINUIR QUANTIDADE
// ======================================================

function diminuir(index) {

    if (!carrinho[index]) {
        return;
    }


    const quantidade =
        Number(
            carrinho[index].quantidade
        );


    if (quantidade > 1) {

        carrinho[index].quantidade =
            quantidade - 1;

    } else {

        carrinho.splice(
            index,
            1
        );

    }


    salvarCarrinho();

}


// ======================================================
// REMOVER PRODUTO
// ======================================================

function remover(index) {

    if (!carrinho[index]) {
        return;
    }


    carrinho.splice(
        index,
        1
    );


    salvarCarrinho();

}


// ======================================================
// SALVAR CARRINHO
// ======================================================

function salvarCarrinho() {

    localStorage.setItem(

        "carrinho",

        JSON.stringify(carrinho)

    );


    mostrarCarrinho();

}


// ======================================================
// GERAR ID DO PEDIDO
// ======================================================
//
// Exemplo:
//
// K24CU8
//
// O ID identifica o pedido inteiro.
//
// Os produtos possuem seus próprios códigos.
//
// ======================================================

function gerarIdPedido() {

    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let codigo = "";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const posicao =
            Math.floor(

                Math.random() *
                caracteres.length

            );


        codigo +=
            caracteres[posicao];

    }


    return codigo;

}


// ======================================================
// CALCULAR TOTAL DO PEDIDO
// ======================================================

function calcularTotalPedido() {

    return carrinho.reduce(

        (soma, produto) =>

            soma +
            Number(produto.preco) *
            Number(produto.quantidade),

        0

    );

}


// ======================================================
// ABRIR MODAL
// ======================================================

function abrirModal() {

    const campoNome =
        document.getElementById(
            "nome"
        );


    const campoPagamento =
        document.getElementById(
            "formaPagamento"
        );


    const nome =
        campoNome.value.trim();


    const pagamento =
        campoPagamento.value;


    // --------------------------------------------------
    // NOME
    // --------------------------------------------------

    confirmacaoNome.textContent =
        nome;


    // --------------------------------------------------
    // PAGAMENTO
    // --------------------------------------------------

    confirmacaoPagamento.textContent =
        pagamento;


    // --------------------------------------------------
    // LIMPAR PRODUTOS DO MODAL
    // --------------------------------------------------

    confirmacaoProdutos.innerHTML = "";


    // --------------------------------------------------
    // PRODUTOS
    // --------------------------------------------------

    carrinho.forEach(
        produto => {

            const subtotalProduto =
                Number(produto.preco) *
                Number(produto.quantidade);


            const codigo =
                gerarCodigoProduto(
                    produto
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "confirmacao-produto";


            item.innerHTML = `

                <div
                    class="confirmacao-produto-nome"
                >

                    👕 ${produto.nome}

                </div>


                <div
                    class="confirmacao-produto-info"
                >

                    <strong>
                        ${codigo}
                    </strong>

                    <br>

                    ${produto.quantidade}
                    unidade(s)

                    • Tamanho
                    ${produto.tamanho}

                    • ${obterNomeCor(produto.cor)}

                </div>


                <div
                    class="confirmacao-produto-preco"
                >

                    ${formatarPreco(
                        subtotalProduto
                    )}

                </div>

            `;


            confirmacaoProdutos.appendChild(
                item
            );

        }
    );


    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    const valorTotal =
        calcularTotalPedido();


    confirmacaoTotal.textContent =
        formatarPreco(
            valorTotal
        );


    // --------------------------------------------------
    // ABRIR
    // --------------------------------------------------

    modalConfirmacao.classList.add(
        "ativo"
    );

}


// ======================================================
// FECHAR MODAL
// ======================================================

function fecharModal() {

    modalConfirmacao.classList.remove(
        "ativo"
    );

}


// ======================================================
// GERAR MENSAGEM DO PEDIDO
// ======================================================

function gerarMensagemPedido() {

    const nome =
        document
            .getElementById("nome")
            .value
            .trim();


    const pagamento =
        document
            .getElementById(
                "formaPagamento"
            )
            .value;


    // --------------------------------------------------
    // GERAR ID
    // --------------------------------------------------

    const idPedido =
        gerarIdPedido();


    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    const valorTotal =
        calcularTotalPedido();


    // --------------------------------------------------
    // INÍCIO DA MENSAGEM
    // --------------------------------------------------

    let mensagem =
        "Olá! Gostaria de fazer um pedido.\n\n";


    mensagem +=
        "🆔 Pedido #" +
        idPedido +
        "\n\n";


    mensagem +=
        "👤 Cliente: " +
        nome +
        "\n\n";


    mensagem +=
        "👕 PRODUTOS\n\n";


    // --------------------------------------------------
    // PRODUTOS
    // --------------------------------------------------

    carrinho.forEach(
        produto => {

            const codigo =
                gerarCodigoProduto(
                    produto
                );


            const subtotalProduto =
                Number(produto.preco) *
                Number(produto.quantidade);


            mensagem +=
                "🔹 " +
                codigo +
                "\n";


            mensagem +=
                "Produto: " +
                produto.nome +
                "\n";


            mensagem +=
                "Tamanho: " +
                produto.tamanho +
                "\n";


            mensagem +=
                "Cor: " +
                obterNomeCor(
                    produto.cor
                ) +
                "\n";


            mensagem +=
                "Quantidade: " +
                produto.quantidade +
                "\n";


            mensagem +=
                "Subtotal: " +
                formatarPreco(
                    subtotalProduto
                ) +
                "\n\n";

        }
    );


    // --------------------------------------------------
    // TOTAL
    // --------------------------------------------------

    mensagem +=
        "💰 TOTAL: " +
        formatarPreco(
            valorTotal
        ) +
        "\n";


    // --------------------------------------------------
    // PAGAMENTO
    // --------------------------------------------------

    mensagem +=
        "💳 Pagamento: " +
        pagamento +
        "\n\n";


    mensagem +=
        "Pedido gerado pelo site. 😊";


    // --------------------------------------------------
    // RETORNO
    // --------------------------------------------------

    return {

        idPedido:
            idPedido,

        nome:
            nome,

        pagamento:
            pagamento,

        valorTotal:
            valorTotal,

        mensagem:
            mensagem

    };

}


// ======================================================
// ENVIAR PEDIDO PARA WHATSAPP
// ======================================================

function enviarPedidoWhatsApp() {

    const pedido =
        gerarMensagemPedido();


    // --------------------------------------------------
    // NÚMERO DO WHATSAPP DA LOJA
    // --------------------------------------------------

    const numeroWhatsApp =
        "5551999743675";


    // --------------------------------------------------
    // CODIFICAR
    // --------------------------------------------------

    const mensagemCodificada =
        encodeURIComponent(
            pedido.mensagem
        );


    // --------------------------------------------------
    // LINK
    // --------------------------------------------------

    const linkWhatsApp =
        `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;


    // --------------------------------------------------
    // ABRIR
    // --------------------------------------------------

    window.open(
        linkWhatsApp,
        "_blank"
    );


    // --------------------------------------------------
    // RETORNA ID
    // --------------------------------------------------

    return pedido.idPedido;

}


// ======================================================
// CONFIRMAR PEDIDO
// ======================================================

function confirmarPedido() {

    // --------------------------------------------------
    // VERIFICAR CARRINHO
    // --------------------------------------------------

    if (
        carrinho.length === 0
    ) {

        alert(
            "Seu carrinho está vazio."
        );


        fecharModal();


        return;

    }


    // --------------------------------------------------
    // ENVIAR
    // --------------------------------------------------

    const idPedido =
        enviarPedidoWhatsApp();


    console.log(
        "Pedido enviado:",
        idPedido
    );


    // --------------------------------------------------
    // FECHAR MODAL
    // --------------------------------------------------

    fecharModal();


    // --------------------------------------------------
    // LIMPAR CARRINHO
    // --------------------------------------------------

    carrinho = [];


    localStorage.removeItem(
        "carrinho"
    );


    // --------------------------------------------------
    // ATUALIZAR TELA
    // --------------------------------------------------

    mostrarCarrinho();

}


// ======================================================
// FORMULÁRIO DO PEDIDO
// ======================================================

if (formPedido) {

    formPedido.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // ------------------------------------------
            // VERIFICAR CARRINHO
            // ------------------------------------------

            if (
                carrinho.length === 0
            ) {

                alert(
                    "Seu carrinho está vazio!"
                );

                return;

            }


            // ------------------------------------------
            // NOME
            // ------------------------------------------

            const campoNome =
                document.getElementById(
                    "nome"
                );


            const nome =
                campoNome.value.trim();


            // ------------------------------------------
            // PAGAMENTO
            // ------------------------------------------

            const pagamento =
                document.getElementById(
                    "formaPagamento"
                ).value;


            // ------------------------------------------
            // VALIDAR NOME
            // ------------------------------------------

            if (
                nome === ""
            ) {

                alert(
                    "Digite seu nome."
                );


                campoNome.focus();


                return;

            }


            // ------------------------------------------
            // VALIDAR PAGAMENTO
            // ------------------------------------------

            if (
                pagamento === ""
            ) {

                alert(
                    "Selecione uma forma de pagamento."
                );


                return;

            }


            // ------------------------------------------
            // ABRIR MODAL
            // ------------------------------------------

            abrirModal();

        }
    );

}


// ======================================================
// INICIAR
// ======================================================

mostrarCarrinho();