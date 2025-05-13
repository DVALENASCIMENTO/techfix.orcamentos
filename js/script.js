// Atualiza dinamicamente os serviços selecionados com opção de remoção
document.addEventListener("DOMContentLoaded", function () {
    const selectItens = document.getElementById("itens");
    const outrosInput = document.querySelector("input[name='outros']");
    const containerSelecionados = document.createElement("div");
    containerSelecionados.id = "itensSelecionados";
    selectItens.parentElement.appendChild(containerSelecionados);
  
    function atualizarItensSelecionados() {
      const selecionados = Array.from(selectItens.selectedOptions).map(opt => opt.value);
      if (outrosInput.value.trim()) {
        selecionados.push("Outros: " + outrosInput.value.trim());
      }
  
      containerSelecionados.innerHTML = "";
      if (selecionados.length > 0) {
        const ul = document.createElement("ul");
  
        selecionados.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
  
          const btnRemover = document.createElement("button");
          btnRemover.textContent = "✕";
          btnRemover.type = "button";
          btnRemover.style.marginLeft = "8px";
          btnRemover.style.color = "#d9534f";
          btnRemover.style.cursor = "pointer";
          btnRemover.title = "Remover item";
  
          btnRemover.addEventListener("click", () => {
            if (item.startsWith("Outros:")) {
              outrosInput.value = "";
            } else {
              const option = Array.from(selectItens.options).find(opt => opt.value === item);
              if (option) option.selected = false;
            }
            atualizarItensSelecionados();
          });
  
          li.appendChild(btnRemover);
          ul.appendChild(li);
        });
  
        containerSelecionados.appendChild(ul);
      }
    }
  
    selectItens.addEventListener("change", atualizarItensSelecionados);
    outrosInput.addEventListener("input", atualizarItensSelecionados);
  });
  
  function mostrarOpcoesEnvio() {
    const form = document.getElementById("orcamentoForm");
    const formData = new FormData(form);
    const resumoDiv = document.getElementById("resumo");
    const opcoesEnvioDiv = document.getElementById("opcoesEnvio");
  
    const camposObrigatorios = form.querySelectorAll("[required]");
    let primeiroInvalido = null;
  
    // Remove tooltips antigos
    document.querySelectorAll(".tooltip-erro").forEach(el => el.remove());
  
    camposObrigatorios.forEach(campo => {
      if (!campo.value.trim()) {
        campo.classList.add("campo-invalido");
        mostrarErroCampo(campo, "Este campo é obrigatório");
        if (!primeiroInvalido) {
          primeiroInvalido = campo;
        }
      } else {
        campo.classList.remove("campo-invalido");
      }
    });
  
    if (primeiroInvalido) {
      primeiroInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiroInvalido.focus();
      return;
    }
  
    const itensSelecionados = Array.from(form.elements["itens"].selectedOptions).map(option => option.value);
    const outros = formData.get("outros");
    if (outros) {
      itensSelecionados.push("Outros: " + outros);
    }
  
    const resumo = `
      <h3>Resumo do Orçamento</h3>
      <p><strong>Cliente:</strong> ${formData.get("nome")}</p>
      <p><strong>Telefone:</strong> ${formData.get("telefone")}</p>
      <p><strong>Email:</strong> ${formData.get("email")}</p>
      <p><strong>Endereço:</strong> ${formData.get("endereco")}</p>
      <p><strong>Equipamento:</strong> ${formData.get("tipo")} - ${formData.get("marca")} ${formData.get("modelo")}</p>
      <p><strong>Sistema:</strong> ${formData.get("so")} - Tempo de uso: ${formData.get("uso")}</p>
      <p><strong>Manutenção anterior:</strong> ${formData.get("manutencao")}</p>
      <p><strong>Problema:</strong> ${formData.get("problema")} (Desde: ${formData.get("quando")}, Frequência: ${formData.get("frequencia")})</p>
      <p><strong>Erro:</strong> ${formData.get("erro")}, Mensagem: ${formData.get("mensagem")}</p>
      <p><strong>Serviços desejados:</strong><br> ${itensSelecionados.join(", ")}</p>
      <p><strong>Autoriza abertura:</strong> ${formData.get("autorizacao")}</p>
      <p><strong>Backup desejado:</strong> ${formData.get("backup")}</p>
      <p><strong>Observações:</strong> ${formData.get("observacoes")}</p>
    `;
  
    resumoDiv.innerHTML = resumo;
    opcoesEnvioDiv.style.display = "block";
  }
  
  function mostrarErroCampo(campo, mensagem) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-erro";
    tooltip.innerText = mensagem;
    tooltip.style.position = "absolute";
    tooltip.style.background = "#d9534f";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "13px";
    tooltip.style.whiteSpace = "nowrap";
    tooltip.style.zIndex = "9999";
    tooltip.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  
    document.body.appendChild(tooltip);
  
    const rect = campo.getBoundingClientRect();
    tooltip.style.top = `${window.scrollY + rect.bottom + 4}px`;
    tooltip.style.left = `${window.scrollX + rect.left}px`;
  
    setTimeout(() => tooltip.remove(), 3000);
  
    campo.addEventListener("input", () => {
      campo.classList.remove("campo-invalido");
      tooltip.remove();
    }, { once: true });
  }
  
  function enviarEmail() {
    const subject = "Solicitação de Orçamento - TechFix Solutions";
    const body = document.getElementById("resumo").innerText.replace(/\n/g, "%0D%0A");
    const email = "techfixsolutions@gmail.com";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }
  
  function enviarWhatsApp() {
    const numero = "5592995178534";
    const texto = document.getElementById("resumo").innerText;
    const link = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
    window.open(link, "_blank");
  }
  
  function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const resumoHtml = document.getElementById("resumo");
  
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Resumo do Orçamento", 10, 10);
  
    let y = 20;
    const linhas = resumoHtml.innerText.split("\n");
  
    linhas.forEach(linha => {
      doc.text(linha, 10, y);
      y += 7;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });
  
    doc.save("orcamento-techfix.pdf");
  }
  