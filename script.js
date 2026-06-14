let totalAcertosQuiz = 0;
let indiceQuestaoAtual = 0;
let nivelQuizAtual = 'facil';
let respondido = false;

document.addEventListener("DOMContentLoaded", () => {
    // Gestão de abas
    const abas = ['painel', 'agroecologia', 'licoes', 'materiais', 'desafios', 'progresso'];
    abas.forEach(aba => {
        const btn = document.getElementById(`btn-tab-${aba}`);
        if(btn) btn.addEventListener('click', () => irParaAba(aba));
    });

    // Simulador
    document.getElementById('simulador-form').addEventListener('submit', (e) => e.preventDefault());
    ['solo', 'agua', 'insumos', 'biodiversidade'].forEach(id => {
        document.getElementById(id).addEventListener('change', executingDiagnostico);
    });

    // Agroecologia Modais
    document.querySelectorAll('.agro-card-extended').forEach(card => {
        card.addEventListener('click', () => { mostrarModal(card.getAttribute('data-modal')); });
    });

    // Quiz
    document.getElementById('btn-quiz-facil').addEventListener('click', () => mudarNivelQuiz('facil'));
    document.getElementById('btn-quiz-medio').addEventListener('click', () => mudarNivelQuiz('medio'));
    document.getElementById('btn-quiz-dificil').addEventListener('click', () => mudarNivelQuiz('dificil'));
    document.getElementById('btn-next-question').addEventListener('click', proximaQuestao);

    // Mídia e Jogo
    document.getElementById('btn-midia-pdf').addEventListener('click', () => abrirMidia('pdf'));
    document.getElementById('btn-midia-video').addEventListener('click', () => abrirMidia('video'));
    document.getElementById('btn-fechar-midia').addEventListener('click', () => {
        document.getElementById('media-viewport-container').classList.add('hidden');
        document.getElementById('media-frame-box').innerHTML = '';
    });
    document.getElementById('btn-reiniciar-jogo').addEventListener('click', inicializarJogo);

    // Overlay genérico
    document.getElementById('global-modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'global-modal-overlay') e.target.classList.add('hidden');
    });

    executingDiagnostico();
    renderizarQuestaoQuiz();
    inicializarJogo();
});

function irParaAba(nomeAba) {
    document.querySelectorAll('.view-pane').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(button => button.classList.remove('active'));
    document.getElementById(`view-${nomeAba}`).classList.add('active');
    document.getElementById(`btn-tab-${nomeAba}`).classList.add('active');
}

function executingDiagnostico() {
    const solo = document.getElementById('solo').value;
    const agua = document.getElementById('agua').value;
    const insumos = document.getElementById('insumos').value;
    const biodiversidade = document.getElementById('biodiversidade').value;

    let nota = 0;
    const pontos = { 'excelente': 25, 'alto': 18, 'medio': 10, 'baixo': 3 };
    nota += pontos[solo] + pontos[agua] + pontos[insumos] + pontos[biodiversidade];

    document.getElementById('pontos-valor').innerText = nota;
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
        detalheBox.className = "alert-box bom";
        detalheBox.innerHTML = `<strong>✨ Índice Impecável: ${nota}%</strong><br>Propriedade modelo! Os manejos adotados conservam a macroestrutura rústica do solo.`;
    } else if (nota >= 50) {
        badge.className = "pill-status state-wait";
        badge.innerText = "REGULAR";
        detalheBox.className = "alert-box alerta";
        detalheBox.innerHTML = `<strong>🌿 Índice Intermediário: ${nota}%</strong><br>Atenção às recomendações técnicas. É viável expandir o plantio direto.`;
    } else {
        badge.className = "pill-status state-wait";
        badge.innerText = "ALERTA CRÍTICO";
        detalheBox.className = "alert-box perigo";
        detalheBox.innerHTML = `<strong>⚠️ Risco Severo Detectado: ${nota}%</strong><br>Alto índice de degradação estrutural e lixiviação. Reveja as práticas.`;
    }
}

// OS 6 CARDS DETALHADOS ORIGINAIS RECUPERADOS
const dadosEmbrapaPopups = {
    rotacao: { 
        titulo: "🔄 Rotação e Diversificação Complexa", 
        intro: "A rotação de culturas consiste em alternar de forma planejada diferentes espécies vegetais em uma mesma área ao longo do tempo. Esta técnica rompe radicalmente a continuidade de hospedeiros, agindo como um controle preventivo essencial contra pragas, fungos e nematoides. O consórcio de raízes variadas promove descompactação mecânica natural.", 
        beneficios: ["Interrompe eficientemente o ciclo biológico de pragas rurais e patógenos.", "Promove a descompactação biológica natural do solo.", "Maximiza a diversidade da microbiota benéfica do solo."], 
        exemplo: "Planejamento estruturado: 1º Ano: Milho (Gramínea) → 2º Ano: Soja (Leguminosa) → 3º Ano: Nabo Forrageiro / Aveia Preta (Cobertura profunda)." 
    },
    adubacao: { 
        titulo: "🌱 Adubação Verde e Cobertura Viva", 
        intro: "Prática baseada no cultivo de plantas de rápido crescimento (leguminosas e gramíneas) com o objetivo exclusivo de enriquecer, proteger e reestruturar o solo. As leguminosas capturam o nitrogênio atmosférico e injetam na terra. A cobertura vegetal blinda o solo contra erosão hídrica, amortece a temperatura e suprime plantas daninhas.", 
        beneficios: ["Fixação biológica de Nitrogênio atmosférico de forma gratuita.", "Aporte maciço de matéria orgânica estável de altíssima qualidade.", "Eliminação do impacto erosivo das chuvas torrenciais na superfície."], 
        exemplo: "Cultivo intercalado ou em safrinha de Crotalária ou Mucuna Preta, seguido de roçagem para formar palhada protetora." 
    },
    mip: { 
        titulo: "🐞 Manejo Integrado de Pragas (MIP)", 
        intro: "O MIP é uma filosofia ecológica que gerencia as populações de pragas de modo a evitar prejuízos sem agredir o ecossistema. Em vez de pulverizações calendarizadas de venenos químicos, o produtor realiza amostragens semanais, priorizando defensivos de matriz biológica (vírus e bactérias) e insetos predadores benéficos.", 
        beneficios: ["Redução drástica no custo de insumos e dependência química.", "Preservação integral de polinizadores e predadores naturais.", "Mitigação completa de riscos de contaminação alimentar."], 
        exemplo: "Monitoramento ativo da Lagarta-do-cartucho com aplicação direcionada de extrato de Neem ou de Bacillus thuringiensis (Bt)." 
    },
    safs: { 
        titulo: "🌳 Sistemas Agroflorestais Planejados (SAFs)", 
        intro: "Os SAFs combinam árvores perenes (madeireiras ou frutíferas) com cultivos agrícolas em um arranjo espacial harmônico, imitando a complexidade de uma floresta. As raízes profundas reciclam nutrientes para a superfície, além de garantirem resiliência climática, conforto térmico e diversidade de renda.", 
        beneficios: ["Reciclagem eficiente de nutrientes profundos e proteção hídrica.", "Conforto térmico animal severo e diversificação de fontes de renda.", "Sequestro ativo de Carbono atmosférico."], 
        exemplo: "Consorciação: Fileiras de Eucalipto ou Erva-Mate intercaladas com cultivo de Milho e pastagens sombreadas para pecuária leiteira." 
    },
    nascentes: { 
        titulo: "💧 Recuperação e Proteção de Nascentes", 
        intro: "A salvaguarda de fontes d'água exige isolamento físico absoluto num raio mínimo de 50 metros ao redor do olho d'água para barrar o pisoteio bovino (que causa compactação e destruição). Com a área isolada, as raízes do reflorestamento funcionam como esponjas filtrantes, garantindo água limpa e contínua.", 
        beneficios: ["Garantia de segurança hídrica contínua e vazão estável.", "Filtragem biológica de resíduos e sedimentos suspensos.", "Retorno imediato da fauna endêmica e equilíbrio hidrológico."], 
        exemplo: "Instalação de cercamento com arame liso e plantio de espécies higrófitas nativas (como Ingá, Salgueiro e Taboa) ao redor da fonte." 
    },
    curvas: { 
        titulo: "🚜 Engenharia de Curvas de Nível", 
        intro: "Técnicas mecânicas fundamentais para relevos ondulados e encostas. O plantio em curvas de nível e o terraceamento criam obstáculos físicos que reduzem drasticamente a velocidade de escoamento das enxurradas, transformando energia destruidora em infiltração lenta e controlada, eliminando as voçorocas.", 
        beneficios: ["Retenção quase total da camada de solo fértil superficial.", "Favorecimento massivo da recarga do lençol freático local.", "Prevenção definitiva do assoreamento de rios vizinhos."], 
        exemplo: "Uso de nível de mangueira para demarcação exata das linhas de nível no terreno antes de abrir sulcos de plantio." 
    }
};

function mostrarModal(idAlvo) {
    const item = dadosEmbrapaPopups[idAlvo];
    if (!item) return;

    let bulletListHtml = "";
    item.beneficios.forEach(b => { bulletListHtml += `<li><span class="modal-check-icon">✅</span> ${b}</li>`; });

    const layoutInjetado = `
        <div class="modal-box-body">
            <button class="modal-btn-fechar" id="btn-fechar-modal">✕</button>
            <h2 class="modal-titulo-item">${item.titulo}</h2>
            <div class="modal-detailed-intro">${item.intro}</div>
            <div class="modal-detailed-grid">
                <div class="modal-detailed-col">
                    <h4>🎯 Impactos e Benefícios Reais:</h4>
                    <ul class="modal-detailed-list">${bulletListHtml}</ul>
                </div>
                <div class="modal-detailed-col">
                    <h4>🚜 Aplicação Técnica:</h4>
                    <p class="modal-detailed-exemplo">${item.exemplo}</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('modal-content-injector').innerHTML = layoutInjetado;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    document.getElementById('btn-fechar-modal').addEventListener('click', () => {
        document.getElementById('global-modal-overlay').classList.add('hidden');
    });
}

// AS 30 QUESTÕES ORIGINAIS RECUPERADAS INTEGRALMENTE
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
        { q: "Qual a principal função do terraceamento em declives acentuados?", o: ["Facilitar o trânsito de pedestres", "Fracionar e reter o fluxo das enxurradas", "Aumentar a evaporação da água", "Estilizar a paisagem rústica"], a: 1 },
        { q: "O nível econômico de dano no MIP serve para determinar o quê?", o: ["O preço final do grão no mercado", "O momento exato da intervenção contra a praga", "O custo do combustível do trator", "A quantidade de adubo por hectare"], a: 1 },
        { q: "Qual elemento é central na transição agroecológica?", o: ["Uso massivo de sementes transgênicas", "Redução gradual de insumos sintéticos industriais", "Abandono total da rotação de culturas", "Aumento do desmatamento legal"], a: 1 },
        { q: "Que benefício os Corredores Ecológicos trazem às propriedades?", o: ["Isolamento completo dos animais", "Livre trânsito e fluxo gênico da fauna silvestre", "Facilidade para queimar os campos", "Aumento da erosão nas margens"], a: 1 },
        { q: "A 'cobertura morta' atua como barreira contra qual processo físico?", o: ["Compactação subterrânea pura", "Impacto das gotas de chuva evitando selamento", "Evaporação profunda", "Crescimento de raíces pivotantes"], a: 1 },
        { q: "Por que árvores nativas são mantidas em pastagens no modelo sustentável?", o: ["Para atrapalhar o maquinário", "Proporcionar conforto térmico ao gado e reciclar nutrientes", "Secar o solo ao redor", "Impedir o nascimento do capim"], a: 1 },
        { q: "Qual destino correto deve ser dado às embalagens de agrotóxicos?", o: ["Queimar nos fundos da propriedade", "Tríplice lavagem e devolução nos centros credenciados", "Enterrar próximo ao riacho", "Reutilizar para água"], a: 1 },
        { q: "O dessecamento excessivo sem palhada expõe o solo a qual dano?", o: ["Lixiviação extrema provocada pelo vento e chuva", "Aumento excessivo de matéria orgânica", "Crescimento espontâneo de árvores", "Encharcamento perpétuo"], a: 0 },
        { q: "A compostagem transforma resíduos orgânicos em qual material?", o: ["Fertilizante químico solúvel", "Adubo estabilizado rico em húmus e nutrientes", "Defensivo sintético de alta potência", "Plástico biodegradável"], a: 1 }
    ],
    dificil: [
        { q: "Qual enzima bacteriana atua na quebra do enlace do N2 na fixação biológica?", o: ["Amilase bacteriana", "Nitrogenase", "Polimerase II", "Celulase termoativa"], a: 1 },
        { q: "Como os Sistemas Agroflorestais mitigam as oscilações térmicas?", o: ["Através do bombeamento hidráulico subterrâneo", "Amortecimento térmico da densidade do dossel arbóreo", "Gerando correntes de vento térmicas", "Por reflexão total das radiações"], a: 1 },
        { q: "O selamento superficial do solo decorre de qual dinâmica?", o: ["Energia cinética do impacto direto das gotas de chuva sobre a terra desnuda", "Crescimento radicular lateral", "Falta de minerais magnéticos", "Uso prolongado de orgânicos"], a: 0 },
        { q: "Como a rotação de culturas altera as propriedades do solo?", o: ["Estilizando a estrutura molecular do oxigênio", "Exsudando compostos que fomentam microbiota benéfica", "Neutralizando o pH natural", "Eliminando os macroorganismos decompositores"], a: 1 },
        { q: "Qual a justificativa para a tríplice lavagem de embalagens químicas?", o: ["Para reaproveitá-las para estocar grãos limpos", "Diluir até níveis atóxicos permitindo a reciclagem do plástico polimérico sem contaminação do lençol freático", "Exigência estética de usinas", "Para evitar que oxidem e percam a cor"], a: 1 },
        { q: "A integração Lavoura-Pecuária-Floresta (ILPF) promove:", o: ["A desertificação regionalizada", "A sinergia biológica, diversificação produtiva e balanço positivo de carbono (Carbono Neutro)", "Mortandade de polinizadores", "Incompatibilidade mecânica"], a: 1 },
        { q: "A micorrização atua de qual forma nas raíces das culturas agrícolas?", o: ["Atacando tecidos celulares meristemáticos", "Expandindo a área de absorção hídrica e fosfática através de hifas fúngicas", "Inibindo o crescimento de pelos absorventes", "Tornando as raízes impermeáveis"], a: 1 },
        { q: "O processo de lixiviação consiste em qual fenômeno pedológico?", o: ["Acúmulo de palhada densa", "Lavagem e transporte de nutrientes solúveis rumo às camadas profundas pelo fluxo descendente da água", "Fixação estável de minerais", "Subida capilar de sais"], a: 1 },
        { q: "O que caracteriza o Nível de Dano Econômico no MIP?", o: ["Limiar populacional da praga onde o custo de controle se iguala ao valor do prejuízo na cultura", "Número exato de insetos por metro", "Data do calendário para aplicar herbicida", "Volume de água da chuva"], a: 0 },
        { q: "Qual a meta estrutural final de uma transição agroecológica complexa?", o: ["Trocar um insumo comercial industrial por outro biológico isolado", "Redesenhar o agroecossistema para funcionar autonomamente mimetizando processos naturais", "Mecanizar totalmente as áreas", "Substituir lavoura por pastagem"], a: 1 }
    ]
};

function mudarNivelQuiz(novo) {
    nivelQuizAtual = novo;
    indiceQuestaoAtual = 0;
    if (novo === 'facil') totalAcertosQuiz = 0; 
    document.getElementById('lbl-nivel-atual').innerText = novo;
    renderizarQuestaoQuiz();
}

function renderizarQuestaoQuiz() {
    respondido = false;
    const btnNext = document.getElementById('btn-next-question');
    btnNext.classList.add('hidden');
    btnNext.disabled = true;

    const lista = databaseQuestoes[nivelQuizAtual];
    const questao = lista[indiceQuestaoAtual];

    document.getElementById('quiz-progress-text').innerText = `${indiceQuestaoAtual + 1}/${lista.length}`;
    document.getElementById('quiz-bar-fill').style.width = `${((indiceQuestaoAtual + 1) / lista.length) * 100}%`;

    document.getElementById('quiz-question-title').innerText = questao.q;
    const box = document.getElementById('quiz-options-container');
    box.innerHTML = "";

    questao.o.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "quiz-option";
        btn.innerText = opt;
        btn.onclick = () => verificarResposta(index, questao.a, btn);
        box.appendChild(btn);
    });
}

function verificarResposta(escolha, correta, botaoRef) {
    if (respondido) return;
    respondido = true;

    const botoes = document.querySelectorAll('.quiz-option');
    if (escolha === correta) {
        botaoRef.classList.add('correct');
        totalAcertosQuiz++;
    } else {
        botaoRef.classList.add('wrong');
        botoes[correta].classList.add('correct');
    }

    const btnNext = document.getElementById('btn-next-question');
    btnNext.classList.remove('hidden');
    btnNext.disabled = false;
    
    document.getElementById('metric-quiz').innerText = `${totalAcertosQuiz}/30`;
    atualizarCertificadoVisao();
}

function proximaQuestao() {
    indiceQuestaoAtual++;
    const lista = databaseQuestoes[nivelQuizAtual];
    
    if (indiceQuestaoAtual < lista.length) {
        renderizarQuestaoQuiz();
    } else {
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
            msg = `Excelente desempenho! Acertos totais até agora: ${totalAcertosQuiz}. Deseja encarar o Desafio Final (Difícil)?`;
        } else {
            const porcentagemAcertos = (totalAcertosQuiz / 30) * 100;
            if (porcentagemAcertos >= 70) {
                titulo = "🏆 Desafio Concluído com Sucesso!";
                msg = `Você obteve ${porcentagemAcertos.toFixed(1)}% de aproveitamento (${totalAcertosQuiz}/30). Seu certificado está liberado na aba Meu Progresso!`;
            } else {
                titulo = "⚠️ Quase lá!";
                msg = `Você obteve ${porcentagemAcertos.toFixed(1)}% de aproveitamento (${totalAcertosQuiz}/30). É necessário 70% para emitir o certificado. Tente novamente!`;
            }
            proxNivel = 'fim';
        }

        const modalHtml = `
            <div class="modal-box-body text-center-box">
                <h2 class="modal-titulo-item">${titulo}</h2>
                <p class="modal-msg-text">${msg}</p>
                <div class="btn-flex-center">
                    ${proxNivel !== 'fim' ? `<button id="btn-avancar-nivel" class="btn-gerar-cert">Avançar Nível ➡️</button>` : ''}
                    ${proxNivel === 'fim' && totalAcertosQuiz < 21 ? `<button id="btn-reiniciar-quiz" class="btn-gerar-cert">🔄 Tentar Novamente</button>` : ''}
                    <button id="btn-fechar-aviso" class="btn-level hard-btn">Fechar</button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-content-injector').innerHTML = modalHtml;
        document.getElementById('global-modal-overlay').classList.remove('hidden');

        if(document.getElementById('btn-avancar-nivel')) {
            document.getElementById('btn-avancar-nivel').addEventListener('click', () => {
                document.getElementById('global-modal-overlay').classList.add('hidden');
                mudarNivelQuiz(proxNivel);
            });
        }
        if(document.getElementById('btn-reiniciar-quiz')) {
            document.getElementById('btn-reiniciar-quiz').addEventListener('click', () => {
                document.getElementById('global-modal-overlay').classList.add('hidden');
                mudarNivelQuiz('facil');
            });
        }
        document.getElementById('btn-fechar-aviso').addEventListener('click', () => {
            document.getElementById('global-modal-overlay').classList.add('hidden');
        });
    }
}

function atualizarCertificadoVisao() {
    const box = document.getElementById('status-certificado-box');
    if (totalAcertosQuiz >= 21) {
        box.className = "certificado-status-liberado mt-15";
        box.innerHTML = `
            <div class="lock-icon">🏆</div>
            <h4 style="color:var(--primary-green);">Certificado Liberado!</h4>
            <p>Aprovado com excelência.</p>
            <button class="btn-gerar-cert mt-15" id="btn-emitir">Ver e Imprimir Certificado</button>
        `;
        document.getElementById('btn-emitir').addEventListener('click', exibirModalCertificado);
    }
}

function exibirModalCertificado() {
    const injector = document.getElementById('modal-content-injector');
    injector.innerHTML = `
        <div class="modal-box-body cert-referencias-box">
            <button id="fechar-cert" class="modal-btn-fechar">✕</button>
            <div class="cert-icone-topo">🌾</div>
            <h2 style="color:var(--primary-green); font-size: 2rem;">CERTIFICADO DO AGRINHO</h2>
            <p class="modal-msg-text">Certificamos que o utilizador demonstrou excelência técnica na plataforma <strong>Raízes do Amanhã</strong>, atingindo <strong>${totalAcertosQuiz}</strong> acertos no módulo de avaliação.</p>
            <p class="mt-15"><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <button class="btn-gerar-cert mt-15" onclick="window.print()">🖨️ Imprimir PDF</button>
        </div>
    `;
    document.getElementById('global-modal-overlay').classList.remove('hidden');
    document.getElementById('fechar-cert').addEventListener('click', () => {
        document.getElementById('global-modal-overlay').classList.add('hidden');
    });
}

// LÓGICA DO JOGO DA MEMÓRIA
const cartasOriginal = [
    { nome: 'arvore', icon: '🌳' }, { nome: 'agua', icon: '💧' },
    { nome: 'inseto', icon: '🐞' }, { nome: 'trator', icon: '🚜' },
    { nome: 'folha', icon: '🌿' }, { nome: 'sol', icon: '☀️' }
];

let vetorCartas = [];
let jogadas = 0;
let correspondencias = 0;
let timerId;
let tempo = 0;

function inicializarJogo() {
    clearInterval(timerId);
    tempo = 0; jogadas = 0; correspondencias = 0; vetorCartas = [];
    document.getElementById('timer-val').innerText = "00:00";
    document.getElementById('moves-val').innerText = "0";

    const board = document.getElementById('memory-game-board');
    board.innerHTML = "";

    let cartas = [...cartasOriginal, ...cartasOriginal].sort(() => Math.random() - 0.5);

    cartas.forEach(carta => {
        const tile = document.createElement('div');
        tile.className = "memory-tile";
        tile.innerHTML = `<div class="tile-back">🌾</div><div class="tile-front">${carta.icon}</div>`;
        tile.addEventListener('click', () => virarCarta(tile, carta.nome));
        board.appendChild(tile);
    });

    timerId = setInterval(() => {
        tempo++;
        const m = String(Math.floor(tempo / 60)).padStart(2, '0');
        const s = String(tempo % 60).padStart(2, '0');
        document.getElementById('timer-val').innerText = `${m}:${s}`;
    }, 1000);
}

function virarCarta(tile, nome) {
    if (vetorCartas.length >= 2 || tile.classList.contains('flipped')) return;

    tile.classList.add('flipped');
    vetorCartas.push({ el: tile, ref: nome });

    if (vetorCartas.length === 2) {
        jogadas++;
        document.getElementById('moves-val').innerText = jogadas;

        if (vetorCartas[0].ref === vetorCartas[1].ref) {
            vetorCartas[0].el.classList.add('matched');
            vetorCartas[1].el.classList.add('matched');
            correspondencias++;
            vetorCartas = [];
            
            if (correspondencias === cartasOriginal.length) {
                clearInterval(timerId);
                setTimeout(() => alert(`Vitória! Jogo concluído em ${jogadas} jogadas.`), 300);
            }
        } else {
            setTimeout(() => {
                vetorCartas[0].el.classList.remove('flipped');
                vetorCartas[1].el.classList.remove('flipped');
                vetorCartas = [];
            }, 1000);
        }
    }
}

function abrirMidia(tipo) {
    const box = document.getElementById('media-frame-box');
    const title = document.getElementById('media-viewport-title');
    document.getElementById('media-viewport-container').classList.remove('hidden');

    if (tipo === 'pdf') {
        title.innerText = "Manual de Solos (PDF)";
        const url = "https://acervodigital.ufpr.br/xmlui/bitstream/handle/1884/85232/Conservando_os_solos.pdf";
        box.innerHTML = `<iframe class="box-iframe-media" src="https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true"></iframe>`;
    } else if (tipo === 'video') {
        title.innerText = "Prática de Curvas de Nível (Vídeo)";
        box.innerHTML = `<iframe class="box-iframe-media" src="https://www.youtube.com/embed/EXEMPLO" allowfullscreen></iframe>`;
    }
}