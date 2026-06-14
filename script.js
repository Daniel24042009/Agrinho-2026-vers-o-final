document.addEventListener("DOMContentLoaded", () => {
    const abas = ['painel', 'agroecologia', 'licoes', 'materiais', 'desafios', 'progresso'];
    abas.forEach(aba => {
        const btn = document.getElementById(`btn-tab-${aba}`);
        if(btn) btn.addEventListener('click', () => irParaAba(aba));
    });

    document.getElementById('simulador-form').addEventListener('submit', (e) => e.preventDefault());
    ['solo', 'agua', 'insumos', 'biodiversidade'].forEach(id => {
        document.getElementById(id).addEventListener('change', executingDiagnostico);
    });

    document.querySelectorAll('.agro-card-extended').forEach(card => {
        card.addEventListener('click', () => { mostrarModal(card.getAttribute('data-modal')); });
    });

    document.getElementById('btn-quiz-facil').addEventListener('click', () => mudarNivelQuiz('facil'));
    document.getElementById('btn-quiz-medio').addEventListener('click', () => mudarNivelQuiz('medio'));
    document.getElementById('btn-quiz-dificil').addEventListener('click', () => mudarNivelQuiz('dificil'));
    document.getElementById('btn-next-question').addEventListener('click', proximaQuestao);

    document.getElementById('btn-midia-pdf').addEventListener('click', () => abrirMidia('pdf'));
    document.getElementById('btn-midia-video').addEventListener('click', () => abrirMidia('video'));
    document.getElementById('btn-fechar-midia').addEventListener('click', fecharMidia);
    document.getElementById('btn-referencias').addEventListener('click', mostrarReferencias);

    document.getElementById('btn-reiniciar-jogo').addEventListener('click', inicializarJogo);
    
    document.getElementById('global-modal-overlay').addEventListener('click', fecharModalPorCliqueFora);

    executingDiagnostico();
    setTimeout(() => { if(document.getElementById('quiz-question-title')) renderizarQuestaoQuiz(); }, 500);
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
        agroecologia: ["Espaço de Capacitação Científica", "Visão detalhada e aprofundada das seis grandes diretrizes conservacionistas."],
        licoes: ["Quiz e Avaliação Continuada", "Fixação teórica através de blocos de múltipla escolha integrados."],
        materiais: ["Central de Recursos Didáticos", "Visualização integrada de acervos científicos públicos sem links externos."],
        desafios: ["Jogo da Memória Computacional", "Lógica de computação e pareamento para memorização biológica ativa."],
        progresso: ["Painel de Métricas e Resultados", "Análise de evolução conceitual obtida nos simuladores computadorizados."]
    };

    if (bibliotecaTitulos[nomeAba]) {
        document.getElementById('page-title').innerText = bibliotecaTitulos[nomeAba][0];
        document.getElementById('page-subtitle').innerText = bibliotecaTitulos[nomeAba][1];
    }

    if (nomeAba === 'desafios') inicializarJogo();
}

function executingDiagnostico() {
    const solo = document.getElementById('solo').value;
    const agua = document.getElementById('agua').value;
    const insumos = document.getElementById('insumos').value;
    const biodiversidade = document.getElementById('biodiversidade').value;

    let nota = 0;
    if (solo === 'excelente') nota += 25; else if (solo === 'alto') nota += 18; else if (solo === 'medio') nota += 10; else nota += 3;
    if (agua === 'excelente') nota += 25; else if (agua === 'alto') nota += 18; else if (agua === 'medio') nota += 10; else nota += 3;
    if (insumos === 'excelente') nota += 25; else if (insumos === 'alto') nota += 18; else if (insumos === 'medio') nota += 10; else nota += 3;
    if (biodiversidade === 'excelente') nota += 25; else if (biodiversidade === 'alto') nota += 18; else if (biodiversidade === 'medio') nota += 10; else nota += 3;

    document.getElementById('points-valor').innerText = nota;
    document.getElementById('metric-simulador').innerText = nota + "%";

    document.getElementById('pct-cultivo').innerText = Math.round(nota * 0.9) + "%";
    document.getElementById('bar-cultivo').style.width = Math.round(nota * 0.9) + "%";
    document.getElementById('pct-ambiental').innerText = Math.round(nota * 1.0) + "%";
    document.getElementById('bar-ambiental').style.width = Math.round(nota * 1.0) + "%";
    document.getElementById('pct-gestao').innerText = Math.round(nota * 0.85) + "%";
    document.getElementById('bar-gestao').style.width = Math.round(nota * 0.85) + "%";

    const badge = document.getElementById('status-badge');
    const detalheBox = document.getElementById('resultado-diagnostico-detalhe');
    detalheBox.classList.remove('hidden');

    if (nota >= 80) {
        badge.className = "pill-status state-active";
        badge.innerText = "EXCELENTE";
        detalheBox.className = "output-alert bom";
        detalheBox.innerHTML = `<strong>✨ Índice Impecável: ${nota}%</strong><br>Propriedade modelo! Os manejos adotados conservam a macroestrutura rústica do solo.`;
    } else if (nota >= 50) {
        badge.className = "pill-status state-wait";
        badge.innerText = "REGULAR";
        detalheBox.className = "output-alert alerta";
        detalheBox.innerHTML = `<strong>🌿 Índice Intermediário: ${nota}%</strong><br>Atenção às recomendações técnicas. É viável expandir o plantio direto.`;
    } else {
        badge.className = "pill-status state-wait";
        badge.innerText = "ALERTA CRÍTICO";
        detalheBox.className = "output-alert perigo";
        detalheBox.innerHTML = `<strong>⚠️ Risco Severo Detectado: ${nota}%</strong><br>Alto índice de degradação estrutural e lixiviação.`;
    }
}

const dadosEmbrapaPopups = {
    rotacao: { 
        titulo: "🔄 Rotação e Diversificação Complexa de Culturas", 
        intro: "A rotação de culturas consiste em alternar de forma planejada, sistemática e ordenada diferentes espécies vegetais em uma mesma área agrícola ao longo do tempo...", 
        beneficios: ["Interrompe eficientemente o ciclo biológico de pragas rurais e patógenos.", "Promove a descompactação biológica natural através de múltiplos sistemas radiculares.", "Maximiza a atividade biológica e a diversidade da microbiota benéfica do solo."], 
        exemplo: "Planejamento estruturado: 1º Ano: Milho (Gramínea) → 2º Ano: Soja (Leguminosa) → 3º Ano: Nabo Forrageiro / Aveia Preta (Cobertura profunda)." 
    },
    adubacao: { 
        titulo: "🌱 Adubação Verde e Cobertura Viva de Solo", 
        intro: "Esta prática milenar baseia-se no cultivo planejado de plantas de rápido crescimento...", 
        beneficios: ["Fixação biológica de Nitrogênio atmosférico de forma gratuita.", "Aporte maciço de matéria orgânica estável de altíssima qualidade.", "Eliminação do impacto erosivo das chuvas torrenciais na superfície."], 
        exemplo: "Cultivo intercalado ou em safrinha de Crotalária ou Mucuna Preta, seguido de roçagem para a formação de uma camada uniforme de palhada protetora." 
    },
    mip: { 
        titulo: "🐞 Manejo Integrado de Pragas (MIP-Agroecologia)", 
        intro: "O MIP é uma filosofia moderna e ecológica de tomada de decisões...", 
        beneficios: ["Redução drástica no custo de insumos e dependência química industrial.", "Preservação integral de polinizadores e predadores naturais (joaninhas, tesourinhas).", "Mitigação completa de riscos de contaminação e toxicidade alimentar."], 
        exemplo: "Monitoramento ativo da Lagarta-do-cartucho com aplicação direcionada de extrato de Neem ou do bioinseticidas biológicos à base de Bacillus thuringiensis (Bt)." 
    },
    safs: { 
        titulo: "🌳 Sistemas Agroflorestais Planejados (SAFs)", 
        intro: "Os SAFs representam a vanguarda da sustentabilidade ao combinar intencionalmente árvores perenes...", 
        beneficios: ["Reciclagem altamente eficiente de nutrientes profundos e proteção hídrica.", "Conforto térmico animal severo e diversificação de fontes de renda na mesma área.", "Sequestro ativo de Carbono atmosférico mitigando gases estufa."], 
        exemplo: "Consorciação agroflorestal: Fileiras de Eucalipto ou Erva-Mate intercaladas com cultivo de Milho, Feijão e pastagens sombreadas para pecuária leiteira." 
    },
    nascentes: { 
        titulo: "💧 Recuperação, Cercamento e Proteção de Nascentes", 
        intro: "A salvaguarda de fontes d'água em Áreas de Preservação Permanente (APP)...", 
        beneficios: ["Garantia de segurança hídrica contínua e vazão estável ao longo do ano.", "Filtragem biológica de resíduos e sedimentos suspensos.", "Retorno imediato da fauna endêmica e equilíbrio hidrológico."], 
        exemplo: "Instalação de cercamento com arame liso rígido e plantio de espécies higrófitas nativas (como Ingá, Salgueiro e Taboa) ao redor de fontes degradadas." 
    },
    curvas: { 
        titulo: "🚜 Engenharia de Curvas de Nível e Terraceamento", 
        intro: "Técnicas mecânicas fundamentais de conservação de solo recomendadas para relevos ondulados...", 
        beneficios: ["Retenção quase total da camada de solo fértil superficial.", "Favorecimento massivo da recarga do lençol freático local por infiltração.", "Prevenção definitiva do assoreamento e contaminação de rios vizinhos."], 
        exemplo: "Uso do aparelho 'Pé-de-Galinha' ou nível de mangueira para demarcação exata das linhas de nível no terreno antes de abrir sulcos de plantio." 
    }
};

function mostrarModal(idAlvo) {
    const item = dadosEmbrapaPopups[idAlvo];
    if (!item) return;

    let bulletListHtml = "";
    item.beneficios.forEach(b => { bulletListHtml += `<li><i class="fa-solid fa-circle-check" style="color:var(--accent-lime); margin-right:6px;"></i> ${b}</li>`; });

    const layoutInjetado = `
        <div class="modal-box-body">
            <button id="btn-fechar-modal-generico" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">✕</button>
            <h2 style="color:var(--primary-green); font-weight:800; border-bottom:1px solid var(--border-gray); padding-bottom:12px; margin-bottom:16px;">${item.titulo}</h2>
            <div style="background:#f4f7f5; padding:18px; border-radius:8px; font-size:0.92rem; line-height:1.6; margin-bottom:16px; color:var(--text-dark); text-align:justify;">${item.intro}</div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:24px;">
                <div>
                    <h4 style="color:var(--primary-green); margin-bottom:10px; font-weight:700;">🎯 Impactos e Benefícios Reais:</h4>
                    <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px; font-size:0.88rem; line-height:1.4;">${bulletListHtml}</ul>
                </div>
                <div>
                    <h4 style="color:var(--primary-green); margin-bottom:10px; font-weight:700;">🚜 Aplicação Técnico no Campo:</h4>
                    <p style="font-size:0.88rem; line-height:1.5; background:#fff8e1; padding:12px; border-left:4px solid #ffb300; border-radius:4px; color:#5d4037;">${item.exemplo}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-content-injector').innerHTML = layoutInjetado;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    document.getElementById('btn-fechar-modal-generico').addEventListener('click', ocultarModal);
}

function ocultarModal() {
    document.getElementById('global-modal-overlay').classList.add('hidden');
    document.getElementById('modal-content-injector').innerHTML = '';
}

function fecharModalPorCliqueFora(e) {
    if (e.target.id === 'global-modal-overlay') ocultarModal();
}

const databaseQuestoes = {
    facil: [
        { q: "Qual o principal objetivo da rotação de culturas?", o: ["Desgastar o solo mais rápido", "Quebrar ciclos de pragas e doenças", "Usar apenas um tipo de adubo", "Aumentar o uso de químicos"], a: 1 },
        { q: "O que é adubação verde?", o: ["Pintar as plantas de verde", "Uso de plantas específicas para melhorar o solo", "Aplicar fertilizante sintético", "Irrigar com água tratada"], a: 1 },
        { q: "Qual inseto é um predador natural famoso no controle biológico (MIP)?", o: ["Lagarta-do-cartucho", "Joaninha", "Gafanhoto", "Cochonilha"], a: 1 },
        { q: "As curvas de nível servem principalmente para evitar o quê?", o: ["A erosão provocada pelas chuvas", "O crescimento das plantas", "A presença de pássaros", "O vento excessivo"], a: 0 },
        { q: "O que significa a sigla SAFs?", o: ["Sistemas Agroflorestais", "Sistemas de Adubação Forte", "Sustentabilidade Agrícola", "Associação de Produtores"], a: 0 },
        { q: "Qual a distância mínima recomendada para proteger uma nascente?", o: ["5 metros", "10 metros", "50 metros", "2 metros"], a: 2 },
        { q: "A palhada deixada sobre o solo ajuda a manter o quê?", o: ["O solo seco", "A umidade e a temperatura adequadas", "As pragas escondidas", "O solo compactado"], a: 1 },
        { q: "As plantas leguminosas ajudam a fixar qual elemento no solo?", o: ["Oxigênio", "Nitrogênio", "Ferro", "Cálcio"], a: 1 },
        { q: "O que o gado NÃO deve fazer na área de uma nascente protegida?", o: ["Ficar longe da cerca", "Pisotear e sujar a água", "Beber água fora da APP", "Sombra em árvores distantes"], a: 1 },
        { q: "A agroecologia busca imitar o funcionamento de qual sistema?", o: ["Uma fábrica industrial", "A própria natureza", "Um laboratório químico", "Uma cidade urbana"], a: 1 }
    ],
    medio: [
        { q: "No plantio consorciado de milho e soja, qual a vantagem da soja?", o: ["Sombra excessiva", "Fornecimento biológico de nitrogênio", "Atrair lagartas", "Produzir sementes inférteis"], a: 1 },
        { q: "Qual a principal função do terraceamento em declives acentuados?", o: ["Facilitar o trânsito de pedestres", "Fracionar e reter o fluxo volumoso das enxurradas", "Aumentar a evaporação da água", "Estilizar a paisagem rústica"], a: 1 },
        { q: "O nível econômico de dano no MIP serve para determinar o quê?", o: ["O preço final do grão no mercado", "O momento exato em que a praga causa prejuízo real justificando intervenção", "O custo do combustível do trator", "A quantidade de adubo por hectare"], a: 1 },
        { q: "Qual elemento é central na transição agroecológica?", o: ["Uso massivo de sementes transgênicas", "Redução gradual de insumos sintéticos industriais", "Abandono total da rotação de culturas", "Aumento do desmatamento legal"], a: 1 },
        { q: "Que benefício os Corredores Ecológicos trazem às propriedades?", o: ["Isolamento completo dos animais", "Livre trânsito e fluxo gênico da fauna silvestre", "Facilidade para queimar os campos", "Aumento da erosão nas margens"], a: 1 },
        { q: "A 'cobertura morta' atua como barreira contra qual processo físico?", o: ["Compactação subterrânea pura", "Impacto direto das gotas de chuva evitando o selamento superficial", "Evaporação profunda", "Crescimento de raíces pivotantes"], a: 1 },
        { q: "Por que árvores nativas são mantidas em pastagens no modelo sustentável?", o: ["Para atrapalhar o maquinário", "Proporcionar conforto térmico ao gado e reciclar nutrientes", "Secar o solo ao redor", "Impedir o nascimento do capim"], a: 1 },
        { q: "Qual destino correto deve ser dado às embalagens vazias de agrotóxicos?", o: ["Queimar nos fundos da propriedade", "Tríplice lavagem, perfuração e devolução nos centros credenciados", "Enterrar próximo ao riacho", "Reutilizar para água"], a: 1 },
        { q: "O dessecamento excessivo sem palhada expõe o solo a qual dano?", o: ["Lixiviação extrema provocada pelo vento e chuva", "Aumento excessivo de matéria orgânica", "Crescimento espontâneo de árvores", "Encharcamento perpétuo"], a: 0 },
        { q: "A compostagem transforma resíduos orgânicos em qual material?", o: ["Fertilizante químico solúvel", "Adubo estabilizado rico em húmus e nutrientes", "Defensivo sintético de alta potência", "Plástico biodegradável"], a: 1 }
    ],
    dificil: [
        { q: "Qual enzima bacteriana é responsável pela quebra do triplo enlace do N2 na fixação biológica?", o: ["Amilase bacteriana", "Nitrogenase", "Polimerase II", "Celulase termoativa"], a: 1 },
        { q: "Como os Sistemas Agroflorestais mitigam as oscilações térmicas extremas no microclima?", o: ["Através do bombeamento hidráulico subterrâneo", "Pelo amortecimento térmico promovido pela densidade do dossel arbóreo", "Gerando correntes de vento térmicas", "Por reflexão total das radiações ultravioletas"], a: 1 },
        { q: "O selamento superficial do solo decorre de qual dinâmica?", o: ["Energia cinética do impacto direto das gotas de chuva sobre a terra desnuda", "Crescimento radicular lateral de monoculturas", "Uso prolongado de adubação orgânica líquida", "Falta de minerais magnéticos no subsolo"], a: 0 },
        { q: "Como a rotação de culturas altera as propriedades biológicas do solo?", o: ["Estilizando a estrutura molecular do oxigênio", "Exsudando compostos carbonados diversos que fomentam microbiota especializada benéfica", "Neutralizando permanentemente o pH natural", "Eliminando os macroorganismos decompositores"], a: 1 },
        { q: "Qual a justificativa físico-química para a tríplice lavagem de embalagens?", o: ["Limpar o rótulo para facilitar a leitura", "Desprender mais de 99,9% dos resíduos químicos impregnados maximizando a descontaminação", "Alterar a composição molecular do plástico", "Permitir o reuso doméstico"], a: 1 },
        { q: "Na engenharia de solo, qual o princípio hidráulico das curvas de nível com terraços de retenção?", o: ["Acelerar o escoamento hídrico", "Infiltrar a água por redução da energia potencial gravitacional da enxurrada", "Evaporar o excesso de chuva", "Drenar a umidade para fora"], a: 1 },
        { q: "Qual a principal limitação ecológica no uso continuado de bioinseticidas à base de Bacillus thuringiensis (Bt)?", o: ["Eles volatilizam rapidamente abaixo de 10°C", "Seleção de populações de pragas resistentes caso manejados sem rotação de princípios ativos", "Intoxicação severa de polinizadores", "Incompatibilidade mecânica"], a: 1 },
        { q: "A micorrização atua de qual forma nas raíces das culturas agrícolas?", o: ["Atacando tecidos celulares meristemáticos", "Expandindo a área de absorção hídrica e fosfática através de hifas fúngicas simbióticas", "Inibindo o crescimento de pelos absorventes", "Tornando as raíces impermeáveis"], a: 1 },
        { q: "O processo de lixiviação consiste em qual fenômeno pedológico?", o: ["Acúmulo de palhada densa", "Lavagem e transporte de nutrientes solúveis rumo às camadas profundas pelo fluxo hídrico descendente", "Fixação estável de minerais", "Subida capilar de sais minerais"], a: 1 },
        { q: "Qual a meta estrutural final de uma transição agroecológica complexa de nível 3?", o: ["Trocar um insumo comercial industrial por outro biológico isolado", "Redesenhar o agroecossistema para funcionar autonomamente mimetizando processos naturais", "Mecanizar totalmente as áreas de preservação florestal", "Substituir a lavoura por pastagem intensiva"], a: 1 }
    ]
};

let nivelQuizAtual = 'facil';
let indiceQuestaoAtual = 0;
let totalAcertosQuiz = 0;

function mudarNivelQuiz(novoNivel) {
    nivelQuizAtual = novoNivel;
    indiceQuestaoAtual = 0;
    
    if(novoNivel === 'facil') totalAcertosQuiz = 0;

    document.getElementById('lbl-nivel-atual').innerText = novoNivel;
    document.getElementById('btn-next-question').disabled = true;

    renderizarQuestaoQuiz();
}

function renderizarQuestaoQuiz() {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    const dadosQuestao = listaQuestoes[indiceQuestaoAtual];

    const totalQ = listaQuestoes.length;
    const porcentagem = ((indiceQuestaoAtual + 1) / totalQ) * 100;
    document.getElementById('quiz-txt-progress').innerText = `Questão ${indiceQuestaoAtual + 1} de ${totalQ}`;
    document.getElementById('quiz-bar-fill').style.width = `${porcentagem}%`;
    document.getElementById('quiz-question-title').innerText = dadosQuestao.q;

    const caixaOpcoes = document.getElementById('quiz-options-box');
    caixaOpcoes.innerHTML = "";

    dadosQuestao.o.forEach((opcao, indice) => {
        const btn = document.createElement('button');
        btn.innerText = opcao;
        btn.className = "quiz-option-btn"; 
        
        btn.addEventListener('click', () => checarRespostaQuiz(indice, btn));
        caixaOpcoes.appendChild(btn);
    });

    document.getElementById('btn-next-question').disabled = true;
}

function checarRespostaQuiz(indiceSelecionado, elementoClicado) {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    const respostaCorreta = listaQuestoes[indiceQuestaoAtual].a;
    const todosBotoes = document.getElementById('quiz-options-box').querySelectorAll('button');

    todosBotoes.forEach(b => b.disabled = true);

    if (indiceSelecionado === respostaCorreta) {
        elementoClicado.style.background = "#e8f5e9";
        elementoClicado.style.borderColor = "#2e7d32";
        elementoClicado.style.color = "#2e7d32";
        elementoClicado.style.fontWeight = "700";
        totalAcertosQuiz++;
    } else {
        elementoClicado.style.background = "#ffebee";
        elementoClicado.style.borderColor = "#c62828";
        elementoClicado.style.color = "#c62828";
        todosBotoes[respostaCorreta].style.background = "#e8f5e9";
        todosBotoes[respostaCorreta].style.borderColor = "#2e7d32";
    }

    const metricEl = document.getElementById('metric-quiz');
    if(metricEl) metricEl.innerText = `${totalAcertosQuiz}/30 (Parcial)`;
    
    document.getElementById('btn-next-question').disabled = false;
}

function proximaQuestao() {
    const listaQuestoes = databaseQuestoes[nivelQuizAtual];
    indiceQuestaoAtual++;

    if (indiceQuestaoAtual < listaQuestoes.length) {
        renderizarQuestaoQuiz();
    } else {
        finalizarNivelQuiz();
    }
}

function finalizarNivelQuiz() {
    let proxNivel = '';
    let titulo = '';
    let msg = '';

    if (nivelQuizAtual === 'facil') {
        proxNivel = 'medio';
        titulo = "🌱 Nível Fácil Concluído!";
        msg = `Você terminou o nível inicial. Acertos até agora: ${totalAcertosQuiz}. Deseja avançar para o nível Médio?`;
    } else if (nivelQuizAtual === 'medio') {
        proxNivel = 'dificil';
        titulo = "🌿 Nível Médio Concluído!";
        msg = `Excelente desempenho! Acertos totais: ${totalAcertosQuiz}. Deseja encarar o Desafio Final (Difícil)?`;
    } else {
        const porcentagemAcertos = (totalAcertosQuiz / 30) * 100;
        if (porcentagemAcertos >= 70) {
            gerarCertificado();
            liberarCertificadoNoProgresso();
        } else {
            mostrarReprovacao(porcentagemAcertos);
        }
        return;
    }

    const modalHtml = `
        <div class="text-center-box">
            <h2 class="modal-titulo">${titulo}</h2>
            <p>${msg}</p>
            <div class="btn-gap">
                <button id="btn-avancar-nivel" class="btn-primary">Avançar Nível ➡️</button>
                <button id="btn-ficar-nivel" class="btn-secondary">Ficar Aqui</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');

    document.getElementById('btn-avancar-nivel').addEventListener('click', () => {
        mudarNivelQuiz(proxNivel);
        ocultarModal();
    });
    document.getElementById('btn-ficar-nivel').addEventListener('click', ocultarModal);
}

function mostrarReprovacao(porcentagem) {
    const modalHtml = `
        <div class="text-center-box">
            <h2 class="modal-titulo" style="color: #c62828;">⚠️ Quase lá!</h2>
            <p style="margin: 15px 0;">Você concluiu os desafios com <strong>${porcentagem.toFixed(1)}%</strong> de acertos (${totalAcertosQuiz}/30).</p>
            <p style="margin-bottom: 20px;">Para emitir o certificado de Especialista em Agroecologia, é necessário atingir no mínimo <strong>70% de aproveitamento</strong>.</p>
            <div class="btn-gap">
                <button id="btn-reiniciar-quiz" class="btn-primary">🔄 Tentar Novamente</button>
                <button id="btn-fechar-aviso" class="btn-secondary">Fechar</button>
            </div>
        </div>
    `;
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');

    document.getElementById('btn-reiniciar-quiz').addEventListener('click', () => {
        mudarNivelQuiz('facil');
        ocultarModal();
    });
    document.getElementById('btn-fechar-aviso').addEventListener('click', ocultarModal);
}

function gerarCertificado() {
    const metricEl = document.getElementById('metric-quiz');
    if(metricEl) metricEl.innerText = `${totalAcertosQuiz}/30 (Aprovado)`;
    
    const modalHtml = `
        <div class="certificado-box">
            <span class="certificado-icone">👨‍🌾</span>
            <h1 class="certificado-titulo">Certificado de Excelência</h1>
            <h3 class="certificado-subtitulo">Raízes do Amanhã | Agroecologia</h3>
            <p class="certificado-texto">
                Certificamos que o Aluno(a) online demonstrou notável domínio nos módulos de 
                manejo sustentável, cumprindo com distinção a jornada de aprendizagem 
                teórica e prática do projeto, com uma taxa de acertos de ${((totalAcertosQuiz/30)*100).toFixed(0)}%.
            </p>
            <div class="btn-gap">
                <button id="btn-fechar-certificado" class="btn-secondary">Fechar</button>
                <button id="btn-download-certificado" class="btn-primary">📥 Baixar Documento</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    
    document.getElementById('btn-fechar-certificado').addEventListener('click', ocultarModal);
    document.getElementById('btn-download-certificado').addEventListener('click', executarDownloadRealCertificado);
}

// GERAÇÃO E DOWNLOAD REAL DO CERTIFICADO CONFORME O SEGUNDO MODELO SOLICITADO
function executarDownloadRealCertificado() {
    const porcentagem = ((totalAcertosQuiz / 30) * 100).toFixed(0);
    const htmlConteudo = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Certificado Raízes do Amanhã</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Plus+Jakarta+Sans:wght@400;700&display=swap');
            body { 
                margin: 0; 
                padding: 30px; 
                background: #f4f6f4; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 95vh;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .border-cert { 
                width: 900px; 
                height: 600px; 
                background: #fbfbf7; 
                border: 15px double #2d5a27;
                outline: 2px solid #aa8730;
                outline-offset: -8px;
                position: relative; 
                padding: 40px 60px; 
                box-sizing: border-box; 
                text-align: center;
                box-shadow: 0 12px 25px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .border-cert::before {
                content: "🌱";
                font-size: 38px;
                margin-bottom: 10px;
            }
            h1 { 
                font-family: 'Cinzel', serif; 
                color: #1a3c17; 
                font-size: 30px; 
                margin: 0 0 8px 0;
                font-weight: 800;
                letter-spacing: 1px;
            }
            h2 { 
                font-family: 'Cinzel', serif; 
                color: #aa8730; 
                font-size: 19px; 
                margin: 0 0 30px 0;
                font-weight: 600;
                letter-spacing: 1.5px;
            }
            p { 
                color: #333; 
                line-height: 1.8; 
                font-size: 16px; 
                margin: 12px 0;
                max-width: 740px;
            }
            .destaque { 
                font-weight: 700; 
                color: #1a3c17; 
                border-bottom: 1px dotted #aa8730;
            }
            .data-linha {
                margin-top: 25px !important;
                font-style: italic;
                color: #555;
            }
            .footer-cert { 
                margin-top: 45px;
                font-family: 'Cinzel', serif;
                font-size: 11px; 
                letter-spacing: 1px; 
                color: #666;
                text-transform: uppercase;
                border-top: 1px solid #e0d9c5;
                padding-top: 12px;
                width: 80%;
                font-weight: 700;
            }
        </style>
    </head>
    <body>
        <div class="border-cert">
            <h1>CERTIFICADO DE EXCELÊNCIA AGROECOLÓGICA</h1>
            <h2>Projeto Integrado Raízes do Amanhã</h2>
            <p>Certificamos para os devidos fins de direito e avaliação curricular que o <span class="destaque">ALUNO(A) ONLINE</span> concluiu com aproveitamento de excelência o ecossistema pedagógico digital de sustentabilidade, atingindo a marca avaliativa de <span class="destaque">${totalAcertosQuiz} acertos de 30 possíveis (${porcentagem}% de rendimento)</span> nas lições teóricas e computacionais.</p>
            <p class="data-linha">Antônio Olinto - PR, 14 de Junho de 2026.</p>
            <div class="footer-cert">
                Plataforma de Monitoramento de Impacto Agroecológico & Inteligência Tecnológica Computacional
            </div>
        </div>
    </body>
    </html>`;

    const blob = new Blob([htmlConteudo], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'certificado_raizes_do_amanha.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function liberarCertificadoNoProgresso() {
    const caixaCertificado = document.getElementById('status-certificado-box');
    if(caixaCertificado) {
        caixaCertificado.className = "certificado-status-liberado";
        caixaCertificado.innerHTML = `
            <div class="lock-icon">🏆</div>
            <h4>Parabéns! Certificado Liberado</h4>
            <p style="margin-bottom:15px;">Sua nota foi superior a 70% no Quiz Geral. Clique abaixo para realizar o download oficial:</p>
            <button id="btn-download-progresso" class="btn-primary">📥 Baixar Certificado</button>
        `;
        document.getElementById('btn-download-progresso').addEventListener('click', executarDownloadRealCertificado);
    }
}

function abrirMidia(tipoMidia) {
    const container = document.getElementById('media-viewport-container');
    const box = document.getElementById('media-frame-box');
    const titulo = document.getElementById('media-viewport-title');

    container.classList.remove('hidden');
    box.innerHTML = "";

    if (tipoMidia === 'pdf') {
        titulo.innerHTML = "📄 Livro Técnico: Conservando os Solos (Manual do Acervo Digital da UFPR)";
        const urlPdf = "https://acervodigital.ufpr.br/xmlui/bitstream/handle/1884/85232/Conservando_os_solos.pdf?sequence=1&isAllowed=y";
        box.innerHTML = `<iframe src="https://docs.google.com/gview?url=${encodeURIComponent(urlPdf)}&embedded=true" style="width:100%; height:100%; border:none;"></iframe>`;
    } else if (tipoMidia === 'video') {
        titulo.innerHTML = "🎥 Videoaula Prática: Preservação de Nascentes Rurais";
        box.innerHTML = `<iframe src="https://www.youtube.com/embed/FHraCDyIhrI" style="width:100%; height:100%; border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    container.scrollIntoView({ behavior: 'smooth' });
}

function fecharMidia() {
    document.getElementById('media-viewport-container').classList.add('hidden');
    document.getElementById('media-frame-box').innerHTML = "";
}

function mostrarReferencias() {
    const modalHtml = `
        <div class="referencias-box">
            <h2 class="modal-titulo">📚 Referências Bibliográficas</h2>
            <hr style="border: 1px solid #ccc; margin-bottom: 15px;">
            <ul class="referencias-lista">
                <li><strong>Sistema FAEP/SENAR-PR:</strong> Diretrizes e manuais pedagógicos do Programa Agrinho 2026.</li>
                <li><strong>EMBRAPA:</strong> Acervo científico sobre o Sistema de Plantio Direto (SPD) e Manejo Integrado de Pragas (MIP).</li>
                <li><strong>UFPR:</strong> Acervo Digital - Livro Técnico "Conservando os Solos".</li>
                <li><strong>IBGE:</strong> Censo Agropecuário e indicadores de sustentabilidade na agricultura familiar.</li>
            </ul>
            <div class="btn-gap">
                <button id="btn-fechar-ref" class="btn-secondary">Fechar</button>
            </div>
        </div>
    `;
    document.getElementById('modal-content-injector').innerHTML = modalHtml;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    document.getElementById('btn-fechar-ref').addEventListener('click', ocultarModal);
}

const cartasMemoriaOriginais = [
    { nome: "Plantio Direto", icone: "🚜" }, { nome: "Plantio Direto", icone: "🚜" },
    { nome: "Adubação Verde", icone: "🌿" }, { nome: "Adubação Verde", icone: "🌿" },
    { nome: "Rotação Culturas", icone: "🔄" }, { nome: "Rotação Culturas", icone: "🔄" },
    { nome: "Controle Biológico", icone: "🐞" }, { nome: "Controle Biológico", icone: "🐞" },
    { nome: "Mata Ciliar", icone: "🌳" }, { nome: "Mata Ciliar", icone: "🌳" },
    { nome: "Cerca Proteção", icone: "💧" }, { nome: "Cerca Proteção", icone: "💧" }
];

let vetorTemporarioCartas = [];
let jogadasEfetuadas = 0;
let segundosJogo = 0;
let timerIdInterv = null;
let jogoIniciado = false;

function embaralharFisherYates(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function iniciarTimerJogo() {
    if (jogoIniciado) return;
    jogoIniciado = true;
    segundosJogo = 0;
    clearInterval(timerIdInterv);
    timerIdInterv = setInterval(() => {
        segundosJogo++;
        const mins = String(Math.floor(segundosJogo / 60)).padStart(2, '0');
        const secs = String(segundosJogo % 60).padStart(2, '0');
        document.getElementById('timer-val').innerText = `${mins}:${secs}`;
    }, 1000);
}

function inicializarJogo() {
    clearInterval(timerIdInterv);
    document.getElementById('timer-val').innerText = "00:00";
    document.getElementById('moves-val').innerText = "0";
    jogadasEfetuadas = 0;
    jogoIniciado = false;
    vetorTemporarioCartas = [];

    const cartasEmbaralhadas = embaralharFisherYates([...cartasMemoriaOriginais]);
    const canvas = document.getElementById('canvas-tabuleiro-memoria');
    canvas.innerHTML = "";

    cartasEmbaralhadas.forEach(item => {
        const bloco = document.createElement('div');
        bloco.className = "memory-tile";

        bloco.innerHTML = `
            <div class="tile-back">🌱</div>
            <div class="tile-front" style="display:none; flex-direction:column; align-items:center; justify-content:center; height:100%; font-weight:700;">
                <span style="font-size:1.6rem; margin-bottom:4px;">${item.icone}</span>
                <span style="font-size:0.75rem; color:var(--primary-green); text-align:center;">${item.nome}</span>
            </div>
        `;

        bloco.addEventListener('click', () => virarCartaTabuleiro(bloco, item));
        canvas.appendChild(bloco);
    });
}

function virarCartaTabuleiro(elementoCarta, objetoDado) {
    if (elementoCarta.classList.contains('flipped') || elementoCarta.classList.contains('matched') || vetorTemporarioCartas.length >= 2) return;

    iniciarTimerJogo();

    elementoCarta.classList.add('flipped');
    elementoCarta.querySelector('.tile-back').style.display = "none";
    elementoCarta.querySelector('.tile-front').style.display = "flex";

    vetorTemporarioCartas.push({ el: elementoCarta, d: objetoDado });

    if (vetorTemporarioCartas.length === 2) {
        jogadasEfetuadas++;
        document.getElementById('moves-val').innerText = jogadasEfetuadas;

        if (vetorTemporarioCartas[0].d.nome === vetorTemporarioCartas[1].d.nome) {
            vetorTemporarioCartas[0].el.classList.add('matched');
            vetorTemporarioCartas[1].el.classList.add('matched');
            vetorTemporarioCartas = [];

            if (document.querySelectorAll('.memory-tile.matched').length === cartasMemoriaOriginais.length) {
                clearInterval(timerIdInterv);
                setTimeout(() => { alert(`🎉 Vitória! Missão computacional completada em ${jogadasEfetuadas} jogadas!`); }, 400);
            }
        } else {
            setTimeout(() => {
                vetorTemporarioCartas[0].el.classList.remove('flipped');
                vetorTemporarioCartas[0].el.querySelector('.tile-back').style.display = "flex";
                vetorTemporarioCartas[0].el.querySelector('.tile-front').style.display = "none";

                vetorTemporarioCartas[1].el.classList.remove('flipped');
                vetorTemporarioCartas[1].el.querySelector('.tile-back').style.display = "flex";
                vetorTemporarioCartas[1].el.querySelector('.tile-front').style.display = "none";

                vetorTemporarioCartas = [];
            }, 900);
        }
    }
}