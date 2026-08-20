

        /* =================================
           CARREGA O CARRINHO
        ================================= */

       /* este trecho de código foi comentado, pois o carrinho já está sendo carregado no script.js
       let carrinho =
            JSON.parse(
                localStorage.getItem("carrinho")
            ) || []; */


        const lista = document.getElementById("listaCarrinho" );


        const total = document.getElementById( "total" );


        const resumo = document.getElementById( "resumo");


        /* =================================
           MOSTRAR CARRINHO
        ================================= */

        function mostrarCarrinho() {
            lista.innerHTML = "";
            if (carrinho.length === 0) {
                lista.innerHTML = `
                    <div class="vazio">
                        <h2>Seu carrinho está vazio 😔</h2>
                        <p>
                            Escolha uma camiseta
                            para começar sua compra.
                        </p>
                        <a href="estampas.html"> Ver camisetas
                        </a>

                    </div>

                `;


                resumo.style.display = "none";

                return;

            }


            resumo.style.display = "block";


            carrinho.forEach(
                (produto, index) => {

                    const subtotal =
                        produto.preco *
                        produto.quantidade;


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className = "item";


                    item.innerHTML = `

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

                            <p class="preco">
                                R$ ${subtotal
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </p>

                        </div>


                        <div class="quantidade">

                            <button
                                onclick="diminuir(${index})"
                            >
                                −
                            </button>


                            <strong>
                                ${produto.quantidade}
                            </strong>


                            <button
                                onclick="aumentar(${index})"
                            >
                                +
                            </button>


                            <button
                                class="remover"
                                onclick="remover(${index})"
                            >
                                🗑
                            </button>

                        </div>

                    `;


                    lista.appendChild(item);

                }
            );


            calcularTotal();

        }


        /* =================================
           CALCULAR TOTAL
        ================================= */

        function calcularTotal() {

            let valorTotal = 0;


            carrinho.forEach(
                produto => {

                    valorTotal +=
                        produto.preco *
                        produto.quantidade;

                }
            );


            total.innerText =
                "R$ " +
                valorTotal
                    .toFixed(2)
                    .replace(".", ",");

        }


        /* =================================
           AUMENTAR
        ================================= */

        function aumentar(index) {

            carrinho[index].quantidade++;


            salvarCarrinho();

        }


        /* =================================
           DIMINUIR
        ================================= */

        function diminuir(index) {

            if (
                carrinho[index].quantidade > 1
            ) {

                carrinho[index].quantidade--;

            } else {

                carrinho.splice(index, 1);

            }


            salvarCarrinho();

        }


        /* =================================
           REMOVER
        ================================= */

        function remover(index) {

            carrinho.splice(index, 1);


            salvarCarrinho();

        }


        /* =================================
           SALVAR
        ================================= */

        function salvarCarrinho() {

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );


            mostrarCarrinho();

        }


        /* =================================
           ENVIAR WHATSAPP
        ================================= */

        document
            .getElementById("formPedido")
            .addEventListener(
                "submit",
                function(e) {

                    e.preventDefault();


                    if (carrinho.length === 0) {

                        alert(
                            "Seu carrinho está vazio!"
                        );

                        return;

                    }


                    const nome =
                        document
                            .getElementById("nome")
                            .value;


                    const pagamento =
                        document
                            .getElementById(
                                "formaPagamento"
                            )
                            .value;


                    const numeroWhatsApp =
                        "5551999743675";


                    let mensagem =
                        "Olá! Gostaria de fazer um pedido:\n\n";


                    mensagem +=
                        "*Nome:* " +
                        nome +
                        "\n\n";


                    mensagem +=
                        "*Produtos:*\n";


                    carrinho.forEach(
                        produto => {

                            const subtotal =
                                produto.preco *
                                produto.quantidade;


                            mensagem +=
                                "👕 " +
                                produto.nome +
                                "\n";


                            mensagem +=
                                "Tamanho: " +
                                produto.tamanho +
                                "\n";
                            mensagem +=
                                "Cor: " +
                                produto.cor +
                                "\n";

                            mensagem +=
                                "Quantidade: " +
                                produto.quantidade +
                                "\n";


                            mensagem +=
                                "Subtotal: R$ " +
                                subtotal
                                    .toFixed(2)
                                    .replace(
                                        ".",
                                        ","
                                    ) +
                                "\n\n";

                        }
                    );


                    const valorTotal =
                        carrinho.reduce(
                            (
                                total,
                                produto
                            ) =>
                                total +
                                produto.preco *
                                produto.quantidade,
                            0
                        );


                    mensagem +=
                        "*TOTAL: R$ " +
                        valorTotal
                            .toFixed(2)
                            .replace(
                                ".",
                                ","
                            ) +
                        "*\n";


                    mensagem +=
                        "*Pagamento:* " +
                        pagamento +
                        "\n\n";


                    mensagem +=
                        "Aguardo retorno! 😊";


                    const mensagemCodificada =
                        encodeURIComponent(
                            mensagem
                        );


                    const linkWhatsApp =
                        `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;


                    window.open(
                        linkWhatsApp,
                        "_blank"
                    );

                }
            );


        /* =================================
           INICIAR
        ================================= */
        
        mostrarCarrinho();