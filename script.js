import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://uwxjbnsowcacbcqjniuu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3eGpibnNvd2NhY2JjcWpuaXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTIzMDYsImV4cCI6MjA2OTMyODMwNn0.xKE_kzGQ3KQdJqfjUcOJhK-Dw1tDIt0v6XfXnVcSPBQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const nomeInput = document.getElementById("nomeInput");
const procurarBtn = document.getElementById("procurarBtn");
const mensagemErro = document.getElementById("mensagemErro");
const mensagemStatus = document.getElementById("mensagemStatus");
const popup = document.getElementById("popup");
const popupTexto = document.getElementById("popupTexto");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnRecusar = document.getElementById("btnRecusar");

// Garantir popup oculto ao carregar
popup.style.display = "none";

procurarBtn.addEventListener("click", verificarNome);
btnConfirmar.addEventListener("click", () => atualizarStatus("confirmado"));
btnRecusar.addEventListener("click", () => atualizarStatus("recusado"));

async function verificarNome() {
  mensagemErro.textContent = "";
  mensagemStatus.textContent = "";
  popup.style.display = "none";

  const nome = nomeInput.value.trim();
  if (!nome) {
    mensagemErro.textContent = "Por favor, digite seu nome.";
    return;
  }

  const { data, error } = await supabase
    .from("convidados")
    .select("*")
    .ilike("nome", nome);

  if (error) {
    mensagemErro.textContent = "Erro ao buscar na lista.";
    return;
  }

  if (data.length === 0) {
    mensagemErro.textContent = `O nome "${nome}" não foi encontrado na lista de convidados.`;
    return;
  }

  const convidado = data[0];

  if (convidado.status) {
    let classeStatus = '';
    if (convidado.status === 'confirmado') {
      classeStatus = 'status-confirmado';
    } else if (convidado.status === 'recusado') {
      classeStatus = 'status-recusado';
    }
    mensagemStatus.innerHTML = `Seu status é: <span class="${classeStatus}">${convidado.status}</span><br>Se deseja alterar, entre em contato com os noivos.`;
  } else {
    popupTexto.textContent = `Olá, ${convidado.nome}! Você confirma sua presença?`;
    popup.style.display = "flex";
  }
}

async function atualizarStatus(novoStatus) {
  const nome = nomeInput.value.trim();

  const { error } = await supabase
    .from("convidados")
    .update({ status: novoStatus })
    .ilike("nome", nome);

  if (error) {
    mensagemErro.textContent = "Erro ao atualizar status.";
    return;
  }

  popup.style.display = "none";

  const classeStatus = novoStatus === "confirmado" ? "status-confirmado" : "status-recusado";

  mensagemStatus.innerHTML = `Seu status é: <span class="${classeStatus}">${novoStatus}</span><br>Se deseja alterar, entre em contato com os noivos.`;

  alert("Sua resposta foi enviada com sucesso!");
  
  location.reload();
}

// Ativa a pesquisa ao pressionar Enter
nomeInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    verificarNome();
  }
});