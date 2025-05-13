function mostrarOpcoesEnvio() {
    const form = document.getElementById("orcamentoForm");
    const formData = new FormData(form);
    const resumoDiv = document.getElementById("resumo");
    const opcoesEnvioDiv = document.getElementById("opcoesEnvio");
  
    // Validação visual
    const camposObrigatorios = form.querySelectorAll("[required]");
    let primeiroInvalido = null;
  
    camposObrigatorios.forEach(campo => {
      if (!campo.value.trim()) {
        campo.classList.add("invalido");
        if (!primeiroInvalido) {
          primeiroInvalido = campo;
        }
      } else {
        campo.classList.remove("invalido");
      }
    });
  
    if (primeiroInvalido) {
      primeiroInvalido.scrollIntoView({ behavior: "smooth", block: "center" });
      primeiroInvalido.focus();
      return;
    }
  
    // Itens selecionados
    const itensSelecionados = Array.from(form.elements["itens[]"].selectedOptions).map(option => option.value);
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
  