document.addEventListener("DOMContentLoaded", () => {
    // Gestão de abas
    const abas = ['painel', 'agroecologia', 'licoes', 'materiais', 'desafios', 'progresso'];
    abas.forEach(aba => {
        const btn = document.getElementById(`btn-tab-${aba}`);
        if(btn) btn.addEventListener('click', () => irParaAba(aba));
    });

    // Simulador Diagnóstico
    const formSimulador = document.getElementById('simulador-form');
    if (formSimulador) {
        formSimulador.addEventListener('submit', (e) => e.preventDefault());
    }

    ['solo', 'agua', 'insumos', 'biodiversidade'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.addEventListener('change', executingDiagnostico);
    });

    // Modais Agroecologia
    document.querySelectorAll('.agro-card-extended').forEach(card => {
        card.addEventListener('click', () => { mostrarModal(card.getAttribute('data-modal')); });
    });

    // Fechar modal clicando de fora
    const overlay = document.getElementById('global-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'global-modal-overlay') {
                overlay.classList.add('hidden');
            }
        });
    }

    executingDiagnostico();
    
    // VARIÁVEL DE PROGRESSO GERAL
    // Altere este valor para testar o bloqueio (ex: 15) ou liberação (ex: 22) do certificado
    let acertosGerais = 25; 
    
    if(document.getElementById('metric-quiz')) {
        document.getElementById('metric-quiz').innerText = `${acertosGerais}/30`;
    }
    atualizarStatusCertificado(acertosGerais);
});

function irParaAba(nomeAba) {
    document.querySelectorAll('.view-pane').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));

    const viewPane = document.getElementById(`view-${nomeAba}`);
    const navBtn = document.getElementById(`btn-tab-${nomeAba}`);

    if (viewPane) viewPane.classList.add('active');
    if (navBtn) navBtn.classList.add('active');

    const bibliotecaTitulos = {
        painel: ["Monitoramento de Impacto Agroecológico", "Tecnologia aplicada ao desenvolvimento sustentável da Escola do Campo rural."],
        agroecologia: ["Espaço de Capacitação Científica", "Visão detalhada e aprofundada das grandes diretrizes conservacionistas."],
        licoes: ["Quiz e Avaliação Continuada", "Fixação teórica através de blocos de múltipla escolha integrados."],
        materiais: ["Central de Recursos Didáticos", "Visualização integrada de acervos científicos públicos sem links externos."],
        desafios: ["Jogo da Memória Computacional", "Lógica de computação e pareamento para memorização biológica ativa."],
        progresso: ["Painel de Métricas e Resultados", "Análise de evolução conceitual obtida nos simuladores computadorizados."]
    };

    if (bibliotecaTitulos[nomeAba]) {
        document.getElementById('page-title').innerText = bibliotecaTitulos[nomeAba][0];
        document.getElementById('page-subtitle').innerText = bibliotecaTitulos[nomeAba][1];
    }
}

function executingDiagnostico() {
    const solo = document.getElementById('solo') ? document.getElementById('solo').value : 'baixo';
    const agua = document.getElementById('agua') ? document.getElementById('agua').value : 'baixo';
    const insumos = document.getElementById('insumos') ? document.getElementById('insumos').value : 'baixo';
    const biodiversidade = document.getElementById('biodiversidade') ? document.getElementById('biodiversidade').value : 'baixo';

    let nota = 0;
    if (solo === 'excelente') nota += 25; else if (solo === 'alto') nota += 18; else if (solo === 'medio') nota += 10; else nota += 3;
    if (agua === 'excelente') nota += 25; else if (agua === 'alto') nota += 18; else if (agua === 'medio') nota += 10; else nota += 3;
    if (insumos === 'excelente') nota += 25; else if (insumos === 'alto') nota += 18; else if (insumos === 'medio') nota += 10; else nota += 3;
    if (biodiversidade === 'excelente') nota += 25; else if (biodiversidade === 'alto') nota += 18; else if (biodiversidade === 'medio') nota += 10; else nota += 3;

    if(document.getElementById('pontos-valor')) document.getElementById('pontos-valor').innerText = nota;
    if(document.getElementById('metric-simulador')) document.getElementById('metric-simulador').innerText = nota + "%";

    if(document.getElementById('pct-cultivo')) {
        document.getElementById('pct-cultivo').innerText = Math.round(nota * 0.9) + "%";
        document.getElementById('bar-cultivo').style.width = Math.round(nota * 0.9) + "%";
        document.getElementById('pct-ambiental').innerText = Math.round(nota * 1.0) + "%";
        document.getElementById('bar-ambiental').style.width = Math.round(nota * 1.0) + "%";
        document.getElementById('pct-gestao').innerText = Math.round(nota * 0.85) + "%";
        document.getElementById('bar-gestao').style.width = Math.round(nota * 0.85) + "%";
    }

    const badge = document.getElementById('status-badge');
    const detalheBox = document.getElementById('resultado-diagnostico-detalhe');
    
    if (badge && detalheBox) {
        detalheBox.classList.remove('hidden');
        if (nota >= 80) {
            badge.className = "pill-status state-active";
            badge.innerText = "EXCELENTE";
        } else if (nota >= 50) {
            badge.className = "pill-status state-wait";
            badge.innerText = "REGULAR";
        } else {
            badge.className = "pill-status state-wait";
            badge.innerText = "ALERTA CRÍTICO";
        }
    }
}

const dadosEmbrapaPopups = {
    rotacao: { 
        titulo: "🔄 Rotação de Culturas", 
        intro: "A rotação de culturas consiste em alternar de forma planejada, sistemática e ordenada diferentes espécies vegetais na mesma área agrícola ao longo do tempo.", 
        beneficios: ["Interrompe eficientemente o ciclo biológico de pragas.", "Promove a descompactação biológica natural do solo.", "Maximiza a atividade biológica da microbiota do solo."]
    },
    verde: {
        titulo: "🌿 Adubação Verde",
        intro: "Uso de plantas (geralmente leguminosas) para enriquecer, proteger e reestruturar o solo de forma biológica e natural.",
        beneficios: ["Fixação biológica de Nitrogênio atmosférico de forma gratuita.", "Aporte maciço de matéria orgânica estável.", "Controle da erosão e conservação da humidade."]
    },
    floresta: {
        titulo: "🌳 Agrofloresta",
        intro: "Integração inteligente e sustentável de árvores na mesma área de cultivos agrícolas, gerando diversidade e rentabilidade.",
        beneficios: ["Reciclagem eficiente de nutrientes e proteção hídrica.", "Conforto térmico animal e diversificação de renda.", "Sequestro ativo de Carbono atmosférico."]
    },
    nascentes: {
        titulo: "💧 Proteção de Nascentes",
        intro: "A salvaguarda de fontes d'água garante o abastecimento sustentável da propriedade e do ecossistema local.",
        beneficios: ["Manutenção do fluxo contínuo de água limpa.", "Prevenção da erosão e assoreamento.", "Promoção de corredores de biodiversidade ribeirinha."]
    }
};

function mostrarModal(idAlvo) {
    const item = dadosEmbrapaPopups[idAlvo];
    if (!item) return;

    let bulletListHtml = "";
    item.beneficios.forEach(b => { 
        bulletListHtml += `<li class="modal-list-item"><span class="modal-list-icon">✅</span> <span>${b}</span></li>`; 
    });

    const layoutInjetado = `
        <div class="modal-box-body">
            <button id="btn-fechar-modal-generico" class="modal-btn-fechar">✕</button>
            <h2 class="modal-titulo-item">${item.titulo}</h2>
            <div class="modal-intro-box">${item.intro}</div>
            <div class="modal-grid-2">
                <div>
                    <h4 class="modal-subtitulo">🎯 Impactos e Benefícios Reais:</h4>
                    <ul class="list-unstyled">${bulletListHtml}</ul>
                </div>
            </div>
        </div>
    `;

    const injector = document.getElementById('modal-content-injector');
    const overlay = document.getElementById('global-modal-overlay');
    
    if(injector && overlay) {
        injector.innerHTML = layoutInjetado;
        overlay.classList.remove('hidden');
        document.getElementById('btn-fechar-modal-generico').addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }
}

// Lógica de Validação e Emissão de Certificado
function atualizarStatusCertificado(acertosGerais) {
    const boxCertificado = document.getElementById('status-certificado-box');
    if (!boxCertificado) return;

    if (acertosGerais >= 21) {
        boxCertificado.className = "certificado-status-liberado";
        boxCertificado.innerHTML = `
            <div class="lock-icon-liberado">🏆</div>
            <h4 class="cert-titulo">🎉 Certificado Liberado!</h4>
            <p class="cert-subtitulo">Parabéns! Obteve nota suficiente (mais de 70%) para validar o seu aproveitamento.</p>
            <button class="btn-gerar-cert" id="btn-emitir-certificado">Visualizar e Emitir Certificado</button>
        `;
        document.getElementById('btn-emitir-certificado').addEventListener('click', abrirModalCertificado);
    } else {
        boxCertificado.className = "certificado-status-bloqueado";
        boxCertificado.innerHTML = `
            <div class="lock-icon">🔒</div>
            <h4>Certificado Indisponível</h4>
            <p>Atinja no mínimo <strong>70% de acertos</strong> (21 de 30 questões) no Quiz de Fixação para liberar o documento.</p>
        `;
    }
}

function abrirModalCertificado() {
    const injector = document.getElementById('modal-content-injector');
    const overlay = document.getElementById('global-modal-overlay');
    
    if (injector && overlay) {
        injector.innerHTML = `
            <div class="cert-referencias-box">
                <button id="fechar-cert-modal" class="modal-btn-fechar">✕</button>
                <div class="cert-icone-topo">🌾</div>
                <h2 class="cert-texto-modal">CERTIFICADO DE EXCELÊNCIA</h2>
                <p class="cert-plataforma">Projeto Raízes do Amanhã</p>
                <p class="cert-desc">
                    Certificamos que o utilizador concluiu com êxito a jornada interativa de 
                    <strong>Monitoramento de Impacto Agroecológico</strong>, demonstrando excelente 
                    aproveitamento nas avaliações propostas.
                </p>
                <div class="cert-rodape">
                    <div>
                        <small>Data de Emissão</small>
                        <p><strong>${new Date().toLocaleDateString('pt-PT')}</strong></p>
                    </div>
                    <div>
                        <small>Concurso Agrinho 2026</small>
                        <p><strong>Programação Front-End</strong></p>
                    </div>
                </div>
                <div>
                    <button id="btn-imprimir-cert" class="btn-imprimir">🖨️ Imprimir / Guardar em PDF</button>
                </div>
            </div>
        `;
        
        overlay.classList.remove('hidden');
        
        document.getElementById('fechar-cert-modal').addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
        document.getElementById('btn-imprimir-cert').addEventListener('click', () => {
            window.print();
        });
    }
}