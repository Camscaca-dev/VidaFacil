// ===============================
// NAVEGAÇÃO
// ===============================

const botoesMenu = document.querySelectorAll(".menu-btn");
const paginas = document.querySelectorAll(".page");

botoesMenu.forEach(botao => {
    botao.addEventListener("click", () => {
        abrirPagina(botao.dataset.page);
    });
});

function abrirPagina(nome) {
    paginas.forEach(pagina => {
        pagina.classList.remove("active");
    });

    botoesMenu.forEach(botao => {
        botao.classList.remove("active");
    });

    document.getElementById(nome).classList.add("active");

    const botao = document.querySelector(`[data-page="${nome}"]`);

    if (botao) {
        botao.classList.add("active");
    }
}


// ===============================
// DATA
// ===============================

const hoje = new Date();

document.getElementById("dataAtual").textContent =
    hoje.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });


// ===============================
// TEMA
// ===============================

const temaBtn = document.getElementById("temaBtn");

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    temaBtn.textContent = "☀️ Tema claro";
}

temaBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
        temaBtn.textContent = "☀️ Tema claro";
    } else {
        localStorage.setItem("tema", "light");
        temaBtn.textContent = "🌙 Tema escuro";
    }
});


// ===============================
// TAREFAS
// ===============================

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const nome = document.getElementById("tarefaInput").value;
    const prioridade = document.getElementById("prioridadeInput").value;
    const prazo = document.getElementById("prazoInput").value;

    if (!nome.trim()) {
        alert("Digite o nome da tarefa!");
        return;
    }

    tarefas.push({
        id: Date.now(),
        nome,
        prioridade,
        prazo,
        concluida: false
    });

    salvarTarefas();

    document.getElementById("tarefaInput").value = "";
    document.getElementById("prazoInput").value = "";

    mostrarTarefas();
}

function concluirTarefa(id) {
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }

        return tarefa;
    });

    salvarTarefas();
    mostrarTarefas();
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(tarefa => tarefa.id !== id);

    salvarTarefas();
    mostrarTarefas();
}

function mostrarTarefas() {
    const lista = document.getElementById("listaTarefas");

    lista.innerHTML = "";

    if (tarefas.length === 0) {
        lista.innerHTML = "<p>Nenhuma tarefa cadastrada! 🎉</p>";
    }

    tarefas.forEach(tarefa => {
        const div = document.createElement("div");

        div.className = `task ${tarefa.concluida ? "done" : ""}`;

        div.innerHTML = `
            <input
                type="checkbox"
                ${tarefa.concluida ? "checked" : ""}
                onchange="concluirTarefa(${tarefa.id})"
            >

            <div class="task-info">
                <div class="task-title">${tarefa.nome}</div>

                ${
                    tarefa.prazo
                    ? `<div class="task-date">📅 ${formatarData(tarefa.prazo)}</div>`
                    : ""
                }
            </div>

            <span class="priority ${tarefa.prioridade}">
                ${tarefa.prioridade}
            </span>

            <button
                class="delete"
                onclick="excluirTarefa(${tarefa.id})"
            >
                🗑️
            </button>
        `;

        lista.appendChild(div);
    });

    atualizarDashboard();
}

function mostrarTarefasDashboard() {
    const container = document.getElementById("tarefasDashboard");

    const pendentes = tarefas
        .filter(tarefa => !tarefa.concluida)
        .slice(0, 5);

    container.innerHTML = "";

    if (pendentes.length === 0) {
        container.innerHTML = "<p>Você não tem tarefas pendentes! 🎉</p>";
        return;
    }

    pendentes.forEach(tarefa => {
        const div = document.createElement("div");

        div.className = "task";

        div.innerHTML = `
            <div class="task-info">
                <div class="task-title">${tarefa.nome}</div>
                ${
                    tarefa.prazo
                    ? `<div class="task-date">📅 ${formatarData(tarefa.prazo)}</div>`
                    : ""
                }
            </div>

            <span class="priority ${tarefa.prioridade}">
                ${tarefa.prioridade}
            </span>
        `;

        container.appendChild(div);
    });
}


// ===============================
// ESTUDOS / NOTAS
// ===============================

let notas = JSON.parse(localStorage.getItem("notas")) || [];

function adicionarNota() {
    const materia = document.getElementById("materiaInput").value;
    const nota = Number(document.getElementById("notaInput").value);
    const peso = Number(document.getElementById("pesoInput").value);

    if (!materia || isNaN(nota) || nota < 0 || nota > 10) {
        alert("Preencha os dados corretamente!");
        return;
    }

    notas.push({
        materia,
        nota,
        peso: peso || 1
    });

    localStorage.setItem("notas", JSON.stringify(notas));

    document.getElementById("materiaInput").value = "";
    document.getElementById("notaInput").value = "";
    document.getElementById("pesoInput").value = "";

    mostrarNotas();
}

function mostrarNotas() {
    const lista = document.getElementById("listaNotas");

    lista.innerHTML = "";

    let somaNotas = 0;
    let somaPesos = 0;

    notas.forEach((item, index) => {
        somaNotas += item.nota * item.peso;
        somaPesos += item.peso;

        const div = document.createElement("div");

        div.className = "nota";

        div.innerHTML = `
            <span>
                <strong>${item.materia}</strong>
                <br>
                Nota: ${item.nota} | Peso: ${item.peso}
            </span>

            <button
                class="delete"
                onclick="excluirNota(${index})"
            >
                🗑️
            </button>
        `;

        lista.appendChild(div);
    });

    const media = somaPesos
        ? somaNotas / somaPesos
        : 0;

    document.getElementById("mediaGeral").textContent =
        media.toFixed(1).replace(".", ",");
}

function excluirNota(index) {
    notas.splice(index, 1);

    localStorage.setItem("notas", JSON.stringify(notas));

    mostrarNotas();
}


// ===============================
// POMODORO
// ===============================

let tempo = 25 * 60;
let intervalo = null;
let sessoes = Number(localStorage.getItem("sessoes")) || 0;

document.getElementById("contadorSessoes").textContent = sessoes;

function atualizarTimer() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    document.getElementById("timer").textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

function iniciarPomodoro() {
    if (intervalo) return;

    intervalo = setInterval(() => {
        tempo--;

        atualizarTimer();

        if (tempo <= 0) {
            clearInterval(intervalo);
            intervalo = null;

            sessoes++;

            localStorage.setItem("sessoes", sessoes);

            document.getElementById("contadorSessoes").textContent = sessoes;

            alert("Sessão concluída! Hora de descansar. ☕");

            tempo = 25 * 60;
            atualizarTimer();
        }
    }, 1000);
}

function pausarPomodoro() {
    clearInterval(intervalo);
    intervalo = null;
}

function resetarPomodoro() {
    pausarPomodoro();

    tempo = 25 * 60;

    atualizarTimer();

    document.getElementById("statusPomodoro").textContent =
        "Hora de focar! 📚";
}


// ===============================
// FINANÇAS
// ===============================

let movimentacoes =
    JSON.parse(localStorage.getItem("movimentacoes")) || [];

function adicionarMovimentacao() {
    const descricao =
        document.getElementById("descricaoFinanceira").value;

    const valor =
        Number(document.getElementById("valorFinanceiro").value);

    const tipo =
        document.getElementById("tipoFinanceiro").value;

    if (!descricao || !valor || valor <= 0) {
        alert("Preencha os dados corretamente!");
        return;
    }

    movimentacoes.push({
        descricao,
        valor,
        tipo,
        data: new Date().toISOString()
    });

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    document.getElementById("descricaoFinanceira").value = "";
    document.getElementById("valorFinanceiro").value = "";

    mostrarFinancas();
}

function excluirMovimentacao(index) {
    movimentacoes.splice(index, 1);

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(movimentacoes)
    );

    mostrarFinancas();
}

function mostrarFinancas() {
    const lista = document.getElementById("listaFinanceira");

    lista.innerHTML = "";

    let entradas = 0;
    let gastos = 0;

    movimentacoes.forEach((item, index) => {

        if (item.tipo === "entrada") {
            entradas += item.valor;
        } else {
            gastos += item.valor;
        }

        const div = document.createElement("div");

        div.className = "movimentacao";

        div.innerHTML = `
            <span>
                ${item.tipo === "entrada" ? "💵" : "💸"}
                ${item.descricao}
            </span>

            <strong class="${item.tipo}">
                ${item.tipo === "entrada" ? "+" : "-"}
                ${formatarMoeda(item.valor)}
            </strong>

            <button
                class="delete"
                onclick="excluirMovimentacao(${index})"
            >
                🗑️
            </button>
        `;

        lista.appendChild(div);
    });

    const saldo = entradas - gastos;

    document.getElementById("entradas").textContent =
        formatarMoeda(entradas);

    document.getElementById("gastos").textContent =
        formatarMoeda(gastos);

    document.getElementById("saldoFinanceiro").textContent =
        formatarMoeda(saldo);

    document.getElementById("saldo").textContent =
        formatarMoeda(saldo);

    document.getElementById("gastosMes").textContent =
        formatarMoeda(gastos);
}


// ===============================
// CALENDÁRIO
// ===============================

let eventos = JSON.parse(localStorage.getItem("eventos")) || [];

function adicionarEvento() {
    const data = document.getElementById("dataCalendario").value;
    const nome = document.getElementById("eventoCalendario").value;

    if (!data || !nome) {
        alert("Preencha a data e o evento!");
        return;
    }

    eventos.push({
        data,
        nome
    });

    localStorage.setItem("eventos", JSON.stringify(eventos));

    document.getElementById("eventoCalendario").value = "";

    mostrarEventos();
}

function excluirEvento(index) {
    eventos.splice(index, 1);

    localStorage.setItem("eventos", JSON.stringify(eventos));

    mostrarEventos();
}

function mostrarEventos() {
    const lista = document.getElementById("listaEventos");

    lista.innerHTML = "";

    eventos
        .sort((a, b) => a.data.localeCompare(b.data))
        .forEach((evento, index) => {

            const div = document.createElement("div");

            div.className = "evento";

            div.innerHTML = `
                <span>
                    📅 <strong>${formatarData(evento.data)}</strong>
                    — ${evento.nome}
                </span>

                <button
                    class="delete"
                    onclick="excluirEvento(${index})"
                >
                    🗑️
                </button>
            `;

            lista.appendChild(div);
        });
}


// ===============================
// DASHBOARD
// ===============================

function atualizarDashboard() {
    const pendentes =
        tarefas.filter(tarefa => !tarefa.concluida).length;

    const concluidas =
        tarefas.filter(tarefa => tarefa.concluida).length;

    const total = tarefas.length;

    document.getElementById("totalTarefas").textContent =
        pendentes;

    document.getElementById("tarefasConcluidas").textContent =
        concluidas;

    document.getElementById("sessoesEstudo").textContent =
        sessoes;

    const porcentagem = total
        ? Math.round((concluidas / total) * 100)
        : 0;

    document.getElementById("porcentagemTarefas").textContent =
        porcentagem + "%";

    document.getElementById("barraTarefas").style.width =
        porcentagem + "%";

    document.getElementById("horasEstudadas").textContent =
        Math.floor(sessoes * 25 / 60) + "h";

    mostrarTarefasDashboard();
}


// ===============================
// FUNÇÕES AUXILIARES
// ===============================

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) return "";

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ===============================
// INICIALIZAÇÃO
// ===============================

mostrarTarefas();
mostrarNotas();
mostrarFinancas();
mostrarEventos();
atualizarTimer();
atualizarDashboard();