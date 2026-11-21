const botaoSim = document.getElementById("sim");
const botaoNao = document.getElementById("nao");
const pergunta = document.getElementById("pergunta");
const convite = document.getElementById("convite");
const horario = document.getElementById("horario");
const data = document.getElementById("data");
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");
data.min = `${ano}-${mes}-${dia}`;
const resumo = document.getElementById("resumo");
const confirmar = document.getElementById("confirmar");
const continuar = document.getElementById("continuar");
const escolhaLocal = document.getElementById("escolha-local");
const lugar = document.getElementById("lugar");
const outraSugestao = document.getElementById("outra-sugestao");
const confirmacao = document.getElementById("confirmacao");
const mensagemFinal = document.getElementById("mensagem-final");
const recusa = document.getElementById("recusa");

let dataEscolhida = "";
let horarioEscolhido = "";
let tamanho = 1;

lugar.addEventListener("change", function() {
    if (lugar.value === "outra") {
        outraSugestao.style.display = "block";
    } else {
        outraSugestao.style.display = "none";
    }
});

botaoNao.addEventListener("click", async function() {
    tamanho = tamanho - 0.25;
    botaoNao.style.transform = `scale(${tamanho})`;

    if (tamanho <= 0) {
        botaoNao.style.display = "none";
        pergunta.style.display = "none";
        recusa.style.display = "block";

        try {
            const respostaServidor = await fetch("/salvar_resposta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resposta: "não"
                })
            });

            if (!respostaServidor.ok) {
                throw new Error("Erro ao registrar a resposta negativa!");
            }
            
            const resultado = await respostaServidor.json();
            console.log(resultado.mensagem);
        } catch (erro) {
            alert("Ops! Não foi possível registar sua resposta. Tente novamente! 😞");
            console.error(erro);
        }
    }
});

botaoSim.addEventListener("click", function() {
    pergunta.style.display = "none";
    convite.style.display = "block";
});

continuar.addEventListener("click", function() {
    if (data.value === "" || horario.value === "") {
        alert("Escolha uma data e um horário, favorzin 😞");
        return;
    }

    dataEscolhida = data.value;
    horarioEscolhido = horario.value;

    convite.style.display = "none";
    escolhaLocal.style.display = "block";
});

confirmar.addEventListener("click", async function() {
    if ((lugar.value === "outra" && outraSugestao.value.trim() === "") || lugar.value === "") {
        alert("Me conta aonde gostaria de ir 😏");
        return;
    }

    const partesdata = dataEscolhida.split("-");
    const dataFormatada = partesdata[2] + "/" + partesdata[1] + "/" + partesdata[0];

    let localEscolhido = lugar.options[lugar.selectedIndex].text;

    if (lugar.value === "outra") {
        localEscolhido = outraSugestao.value;
    }

    const dadosConvite = {
        resposta: "sim",
        data: dataEscolhida,
        horario: horarioEscolhido,
        local: localEscolhido
    };

    try {
        const respostaServidor = await fetch("/salvar_resposta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosConvite)
        });

        if (!respostaServidor.ok) {
                throw new Error("Erro ao salvar a resposta!");    
        }

        const resultado = await respostaServidor.json();

        console.log(resultado.mensagem);

        resumo.textContent = `Nosso date será dia ${dataFormatada}, às ${horarioEscolhido}. Local: ${localEscolhido}!`;

        escolhaLocal.style.display = "none";
        confirmacao.style.display = "block";

        mensagemFinal.textContent = `Nosso date será dia ${dataFormatada}, às ${horarioEscolhido}, em ${localEscolhido}! 💗`
    } catch (erro) {
        alert("Ops! Não foi possível enviar a sua resposta. Tente novamente! 😞");
        console.error(erro);
    }
    });