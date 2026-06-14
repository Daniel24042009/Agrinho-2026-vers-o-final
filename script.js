/**
 * Raízes do Amanhã - Inteligência Sustentável
 * Core Application Script - Sistema de Monitorização e Fixação Agroecológica
 */

// ==========================================
// 1. SISTEMA DE NAVEGAÇÃO (TABS)
// ==========================================
const tabsConfig = {
    'btn-tab-painel': { id: 'view-painel', title: 'Monitoramento de Impacto Agroecológico', subtitle: 'Tecnologia aplicada ao desenvolvimento sustentável da Escola do Campo rural.' },
    'btn-tab-agroecologia': { id: 'view-agroecologia', title: 'Manual Técnico Interativo', subtitle: 'Navegue pelos cards e descubra soluções profundas que ajudam a produzir mais preservando a natureza.' },
    'btn-tab-licoes': { id: 'view-licoes', title: 'Lições do Campo', subtitle: 'Complete os 3 níveis (30 questões) para liberar o certificado do Agrinho.' },
    'btn-tab-materiais': { id: 'view-materiais', title: 'Recursos Didáticos e Apoio', subtitle: 'Manuais técnicos, referências bibliográficas e vídeos práticos.' },
    'btn-tab-desafios': { id: 'view-desafios', title: 'Jogo da Memória Computacional', subtitle: 'Pratique a memorização de conceitos agroecológicos fundamentais.' },
    'btn-tab-progresso': { id: 'view-progresso', title: 'Painel de Desempenho', subtitle: 'Acompanhe as suas métricas de aproveitamento e emita o seu certificado.' }
};

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const config = tabsConfig[btn.id];
        if (!config) return;

        // Alternar botões ativos
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Alternar visualizações ativas
        document.querySelectorAll('.view-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(config.id).classList.add('active');

        // Atualizar títulos do cabeçalho
        document.getElementById('page-title').textContent = config.title;
        document.getElementById('page-subtitle').textContent = config.subtitle;
    });
});

// ==========================================
// 2. SIMULADOR DE DIAGNÓSTICO SUSTENTÁVEL
// ==========================================
const formSimulador = document.getElementById('simulador-form');

function calcularDiagnostico() {
    const pesos = { excelente: 25, alto: 20, medio: 12, baixo: 5 };
    
    const solo = document.getElementById('solo').value;
    const agua = document.getElementById('agua').value;
    const insumos = document.getElementById('insumos').value;
    const biodiversidade = document.getElementById('biodiversidade').value;

    const pSolo = pesos[solo];
    const pAgua = pesos[agua];
    const pInsumos = pesos[insumos];
    const pBiodiv = pesos[biodiversidade];

    const totalScore = pSolo + pAgua + pInsumos + pBiodiv;

    // Atualizar interface gráfica de pontuação
    document.getElementById('pontos-valor').textContent = totalScore;
    document.getElementById('metric-simulador').textContent = totalScore + '%';

    // Gerir Badge de Status
    const statusBadge = document.getElementById('status-badge');
    statusBadge.className = 'pill-status state-active';
    
    if (totalScore >= 85) {
        statusBadge.textContent = 'SUSTENTABILIDADE EXCELENTE';
        statusBadge.style.background = '#e8f5e9';
        statusBadge.style.color = '#2e7d32';
    } else if (totalScore >= 55) {
        statusBadge.textContent = 'SUSTENTABILIDADE MODERADA';
        statusBadge.style.background = '#fff9c4';
        statusBadge.style.color = '#f57f17';
    } else {
        statusBadge.textContent = 'ALERTA: CRÍTICO';
        statusBadge.style.background = '#ffcdd2';
        statusBadge.style.color = '#c62828';
    }

    // Distribuir e animar barras de sub-métricas
    const pctCultivoVal = Math.round(((pSolo + pInsumos) / 50) * 100);
    const pctAmbientalVal = Math.round(((pAgua + pBiodiv) / 50) * 100);
    const pctGestaoVal = totalScore;

    document.getElementById('pct-cultivo').textContent = pctCultivoVal + '%';
    document.getElementById('bar-cultivo').style.width = pctCultivoVal + '%';

    document.getElementById('pct-ambiental').textContent = pctAmbientalVal + '%';
    document.getElementById('bar-ambiental').style.width = pctAmbientalVal + '%';

    document.getElementById('pct-gestao').textContent = pctGestaoVal + '%';
    document.getElementById('bar-gestao').style.width = pctGestaoVal + '%';

    // Gerar Feedback Detalhado Personalizado (Caixa de Alerta)
    const detalheBox = document.getElementById('resultado-diagnostico-detalhe');
    detalheBox.classList.remove('hidden');
    detalheBox.className = 'alert-box mt-15 ' + (totalScore >= 85 ? 'bom' : totalScore >= 55 ? 'alerta' : 'perigo');

    let feedbackHtml = `<strong>Recomendações Técnicas para Antônio Olinto:</strong><br><ul style="padding-left:15px; margin-top:5px;">`;
    if (solo === 'baixo') feedbackHtml += `<li>O arado intensivo degrada a estrutura do solo. Faça a transição urgente para o Plantio Direto e cobertura morta.</li>`;
    if (agua === 'baixo') feedbackHtml += `<li>Fontes desprotegidas causam contaminação. Instale cercas de isolamento para reter o gado e plante espécies nativas na APP.</li>`;
    if (insumos === 'baixo') feedbackHtml += `<li>Defensivos químicos sem receita ameaçam a biodiversidade. Adote o Manejo Integrado de Pragas (MIP).</li>`;
    if (biodiversidade === 'baixo') feedbackHtml += `<li>A ausência de vegetação quebra o microclima. Desenvolva Sistemas Agroflorestais (SAFs) para conectar corredores ecológicos.</li>`;
    
    if (totalScore >= 85) {
        feedbackHtml += `<li>A propriedade cumpre as diretrizes mais rigorosas da Agroecologia! Continue servindo de vitrine tecnológica na comunidade.</li>`;
    }
    feedbackHtml += `</ul>`;
    detalheBox.innerHTML = feedbackHtml;
}

if (formSimulador) {
    formSimulador.addEventListener('change', calcularDiagnostico);
    calcularDiagnostico(); // Inicialização automática
}

// ==========================================
// 3. MANUAL INTERATIVO (MODAIS DE CONTEÚDO)
// ==========================================
const modalOverlay = document.getElementById('global-modal-overlay');
const modalInjector = document.getElementById('modal-content-injector');

const agroecologiaDados = {
    rotacao: {
        titulo: "Rotação de Culturas",
        intro: "Prática planeada de alternar diferentes espécies de plantas numa mesma área ao longo do tempo, evitando o esgotamento nutricional do solo e combatendo patógenos.",
        beneficios: ["Quebra o ciclo de pragas e doenças específicas.", "Melhora a fixação de nutrientes pelas variações radiculares.", "Garante diversificação económica para o produtor."],
        exemplo: "Alternar culturas extratoras (como milho) com plantas recuperadoras (leguminosas/soja) e coberturas rústicas de inverno."
    },
    adubacao: {
        titulo: "Adubação Verde",
        intro: "Cultivo de plantas herbáceas (principalmente leguminosas e crucíferas) que protegem a superfície do solo e são posteriormente incorporadas ou mantidas como palhada.",
        beneficios: ["Fixação Biológica de Nitrogénio atmosférico (FBN).", "Aumento substancial de matéria orgânica no horizonte A.", "Amortece o impacto de chuvas intensas prevenindo a erosão laminar."],
        exemplo: "Semeadura de feijão-de-porco, guandu ou crotalária nas entrelinhas ou nos períodos de pousio da área agrícola."
    },
    mip: {
        titulo: "Manejo Integrado de Pragas (MIP)",
        intro: "Estratégia ecológica que monitoriza a densidade populacional das pragas, acionando ferramentas de controlo biológico, genético e cultural, deixando o químico estritamente como último recurso.",
        beneficios: ["Redução drástica nos custos com defensivos sintéticos.", "Preservação de insetos benéficos (predadores naturais como joaninhas).", "Aumenta a segurança fitossanitária de quem manuseia os alimentos."],
        exemplo: "Uso de armadilhas de feromónios e libertação orientada de microvespas (Trichogramma) para controlo biológico de lagartas."
    },
    safs: {
        titulo: "Sistemas Agroflorestais (SAFs)",
        intro: "Modelos produtivos que mimetizam a floresta natural, consorciando árvores lenhosas (frutíferas ou madeireiras) com culturas agrícolas anuais e/ou pecuária sustentável.",
        beneficios: ["Recuperação acelerada de solos degradados ou exauridos.", "Conexão biológica de fragmentos florestais e conservação da fauna.", "Geração de receitas múltiplas (madeira, frutas, grãos) a curto, médio e longo prazo."],
        exemplo: "Plantação consorciada de faixas de árvores nativas da Mata Atlântica com linhas de café, feijão e milho integrado."
    },
    nascentes: {
        titulo: "Proteção de Nascentes",
        intro: "Conjunto de intervenções mecânicas e biológicas destinadas a blindar os olhos d'água, garantindo o abastecimento hídrico limpo e seguro da bacia hidrográfica rural.",
        beneficios: ["Isolamento mecânico contra o pisoteamento e compactação do gado.", "Filtragem biológica natural de sedimentos e defensivos por matas ciliares.", "Aumento da perenidade dos riachos e córregos durante secas."],
        exemplo: "Cercamento obrigatório num raio mínimo de 50 metros ao redor da nascente e regeneração induzida através de mudas nativas."
    },
    curvas: {
        titulo: "Curvas de Nível (Terraceamento)",
        intro: "Técnica de engenharia rústica que consiste em cultivar seguindo linhas com a mesma altitude do terreno, quebrando a velocidade das águas pluviais.",
        beneficios: ["Reduz radicalmente a velocidade de arraste das enxurradas.", "Favorece a infiltração de água no solo, recarregando o lençol freático.", "Retém os nutrientes e adubações na vertente da encosta."],
        exemplo: "Utilização do 'Aparelho em A' ou nível de mangueira para demarcação exata dos terraços e sulcos de plantio em declives acentuados."
    }
};

document.querySelectorAll('[data-modal]').forEach(card => {
    card.addEventListener('click', () => {
        const chave = card.getAttribute('data-modal');
        const info = agroecologiaDados[chave];
        if (!info) return;

        modalInjector.innerHTML = `
            <div class="modal-box-body">
                <button class="modal-btn-fechar" id="btn-fechar-modal">✕</button>
                <h3 class="modal-titulo-item">🌱 ${info.titulo}</h3>
                <div class="modal-detailed-intro">${info.intro}</div>
                <div class="modal-detailed-grid">
                    <div class="modal-detailed-col">
                        <h4>Vantagens e Benefícios:</h4>
                        <ul class="modal-detailed-list">
                            ${info.beneficios.map(b => `<li><span class="modal-check-icon">✓</span> ${b}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-detailed-col">
                        <h4>Implementação Prática no Campo:</h4>
                        <div class="modal-detailed-exemplo">${info.exemplo}</div>
                    </div>
                </div>
            </div>
        `;
        modalOverlay.classList.remove('hidden');

        document.getElementById('btn-fechar-modal').addEventListener('click', () => {
            modalOverlay.classList.add('hidden');
        });
    });
});

// Fechar modal ao clicar fora da caixa branca
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
});

// ==========================================
// 4. QUIZ DE FIXAÇÃO CONTINUADA (30 QUESTÕES)
// ==========================================
const quizPerguntas = {
    facil: [
        { q: "Qual o foco principal da rotação de culturas?", o: ["Desgastar a fertilidade do solo", "Quebrar ciclos de pragas e preservar o solo", "Estimular a monocultura intensiva", "Substituir o uso de sementes"], c: 1 },
        { q: "As plantas leguminosas ajudam a fixar qual elemento no solo?", o: ["Nitrogénio", "Fósforo", "Potássio", "Ferro"], c: 0 },
        { q: "O que significa a sigla MIP?", o: ["Mapeamento Integrado de Pastos", "Manejo Integrado de Pragas", "Monitoramento de Insumos Poluentes", "Melhoria Inovadora da Produção"], c: 1 },
        { q: "A vegetação nativa nas margens de rios chama-se:", o: ["Mata Ciliar", "Mata Seca", "Pastagem Nativa", "Capoeira"], c: 0 },
        { q: "As curvas de nível atuam diretamente no combate à:", o: ["Geada", "Erosão provocada por enxurradas", "Seca extrema", "Compactação por tratores"], c: 1 },
        { q: "O Concurso Agrinho visa promover a educação ligada à:", o: ["Urbanização industrial", "Sustentabilidade e cidadania no campo", "Mecanização pesada de exportação", "Especulação imobiliária"], c: 1 },
        { q: "As embalagens vazias de agrotóxicos devem sofrer:", o: ["Queima controlada", "Tríplice lavagem e devolução correta", "Descarte em valas comuns", "Armazenamento no celeiro"], c: 1 },
        { q: "Qual prática NÃO faz parte da agroecologia?", o: ["Queimada completa da palhada", "Adubação verde", "Sistemas agroflorestais", "Controlo biológico"], c: 0 },
        { q: "O Plantio Direto baseia-se em semear sobre:", o: ["O solo arado recentemente", "A palhada da cultura anterior", "Terras limpas por herbicidas totais", "Valas de irrigação contínua"], c: 1 },
        { q: "Manter corredores ecológicos ajuda a:", o: ["Aumentar pragas", "Facilitar a livre circulação de animais nativos", "Dividir terrenos de forma rígida", "Reduzir o tamanho cultivável"], c: 1 }
    ],
    medio: [
        { q: "O revolvimento contínuo com arados pesados provoca:", o: ["Aumento da infiltração estável", "Destruição da agregação e perda de carbono", "Multiplicação de minhocas", "Melhoria física a longo prazo"], c: 1 },
        { q: "Qual o raio mínimo legal de proteção exigido numa nascente comum?", o: ["15 metros", "30 metros", "50 metros", "100 metros"], c: 2 },
        { q: "No MIP, os defensivos químicos seletivos devem ser usados como:", o: ["Primeira medida de prevenção", "Substitutos completos da rotação", "Último recurso, após monitorização e falha biológica", "Aplicação diária obrigatória"], c: 2 },
        { q: "Os Sistemas Agroflorestais (SAFs) caracterizam-se por consorciar:", o: ["Apenas animais confinados", "Árvores lenhosas com culturas agrícolas e/ou animais", "Lavouras e asfalto industrial", "Estufas hidropónicas de alta tecnologia"], c: 1 },
        { q: "A agricultura familiar sustentável busca equilibrar:", o: ["Lucro extremo e uso de químicos proibidos", "Produção de alimentos e conservação ambiental", "Substituição de mão de obra por robôs", "Monoculturas integradas globais"], c: 1 },
        { q: "A cobertura morta deixada na superfície do solo serve para:", o: ["Aumentar a evapotranspiração", "Reter a humidade e estabilizar a temperatura do solo", "Favorecer o crescimento de ervas daninhas", "Bloquear o desenvolvimento radicular"], c: 1 },
        { q: "Que inseto atua como agente biológico de topo contra os pulgões?", o: ["Lagarta-militar", "Joaninha", "Gafanhoto-das-pastagens", "Broca-do-café"], c: 1 },
        { q: "O acúmulo de terra no fundo dos rios devido à erosão é o:", o: ["Assoreamento", "Lixiviação", "Eutrofização", "Calagem"], c: 0 },
        { q: "A adubação verde reduz a necessidade de compra externa de adubos de:", o: ["Calcário dolomítico", "Ureia/Nitrogenados sintéticos", "Gesso agrícola", "Cloreto de potássio puro"], c: 1 },
        { q: "A transição agroecológica difere de mudanças abruptas por ser um:", o: ["Processo imediato sem planeamento", "Processo gradual de redesenho ecológico do agroecossistema", "Abandono total das áreas agrícolas", "Foco exclusivo em tecnologia urbana"], c: 1 }
    ],
    dificil: [
        { q: "Legalmente, a área de preservação em torno de olhos d'água é uma:", o: ["Reserva Legal (RL)", "Área de Preservação Permanente (APP)", "Área de Uso Restrito Temporário", "Unidade de Conservação Integral"], c: 1 },
        { q: "O conceito de Nível de Dano Económico (NDE) serve para estipular:", o: ["O extermínio completo de insetos da área", "Quando o prejuízo da praga supera o custo financeiro do controlo", "O limite máximo de venda do grão", "A quantidade de adubo por hectare"], c: 1 },
        { q: "A inibição química exercida por certas raízes sobre plantas daninhas chama-se:", o: ["Alelopatia", "Simbiose", "Eutrofização", "Calagem biológica"], c: 0 },
        { q: "Nos SAFs, as árvores desempenham papel fundamental ao:", o: ["Sombrear totalmente impedindo novos cultivos", "Ciclar nutrientes profundos e criar microclimas estáveis", "Consumir os recursos hídricos superficiais das plantas anuais", "Eliminar a microfauna do solo"], c: 1 },
        { q: "A lixiviação e escoamento em massa de adubos químicos para rios gera a:", o: ["Eutrofização por proliferação de algas", "Salinização acelerada", "Compactação subsuperficial", "Desertificação hidrológica"], c: 0 },
        { q: "O 'Aparelho em A' é um instrumento rústico utilizado para:", o: ["Medir radiação solar", "Marcar curvas de nível no terreno declivoso", "Calibrar bicos de pulverizadores", "Testar a germinação de sementes"], c: 1 },
        { q: "A macroestrutura e porosidade biológica do solo são mantidas por:", o: ["Passagem contínua de grades de disco", "Atividade de minhocas, fungos e microrganismos", "Aplicação frequente de adubos clorados", "Compactação hidráulica controlada"], c: 1 },
        { q: "A certificação orgânica por OPAC destaca-se por basear-se no:", o: ["Controlo exclusivo de satélites internacionais", "Mecanismo de auditoria participativa e visitas mútuas entre produtores", "Laudo laboratorial pago de uma multinacional", "Decreto burocrático municipal"], c: 1 },
        { q: "O 'Biochar' (carvão vegetal pirolisado) atua no solo como:", o: ["Acidificante químico letal", "Condicionador estável aumentando a CTC e retendo água/nutrientes", "Substituto direto de defensivos hormonais", "Acelerador de erosão eólica"], c: 1 },
        { q: "A estabilidade biológica e resiliência de um ecossistema agroecológico baseia-se na:", o: ["Alta biodiversidade funcional e diversificação de nichos", "Padronização genética total de poucas espécies de alto valor", "Dependência total de pacotes químicos integrados", "Ausência completa de insetos e aves"], c: 0 }
    ]
};

let nivelAtual = 'facil';
let questaoIndex = 0;
let respostasUsuario = { facil: [], medio: [], dificil: [] };
let acertosGerais = 0;

const btnFacil = document.getElementById('btn-quiz-facil');
const btnMedio = document.getElementById('btn-quiz-medio');
const btnDificil = document.getElementById('btn-quiz-dificil');
const labelNivel = document.getElementById('lbl-nivel-atual');
const progressoTexto = document.getElementById('quiz-progress-text');
const barraQuizFill = document.getElementById('quiz-bar-fill');
const containerOpcoes = document.getElementById('quiz-options-container');
const btnProxima = document.getElementById('btn-next-question');

function renderizarQuestao() {
    const listaPerguntas = quizPerguntas[nivelAtual];
    const pergunta = listaPerguntas[questaoIndex];

    // Atualizar labels de cabeçalho do quiz
    const nomesNivel = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
    labelNivel.textContent = nomesNivel[nivelAtual];

    const indicadorGlobal = (nivelAtual === 'facil' ? 0 : nivelAtual === 'medio' ? 10 : 20) + questaoIndex + 1;
    progressoTexto.textContent = `${indicadorGlobal}/30`;
    barraQuizFill.style.width = `${(indicadorGlobal / 30) * 100}%`;

    document.getElementById('quiz-question-title').textContent = `${questaoIndex + 1}. ${pergunta.q}`;
    containerOpcoes.innerHTML = '';
    
    btnProxima.classList.add('hidden');
    btnProxima.disabled = true;

    pergunta.o.forEach((opcao, idx) => {
        const btnOpcao = document.createElement('button');
        btnOpcao.className = 'quiz-option';
        btnOpcao.textContent = opcao;

        // Caso a questão já tenha sido respondida anteriormente
        if (respostasUsuario[nivelAtual][questaoIndex] !== undefined) {
            const respondidoIdx = respostasUsuario[nivelAtual][questaoIndex];
            if (idx === pergunta.c) btnOpcao.classList.add('correct');
            else if (idx === respondidoIdx) btnOpcao.classList.add('wrong');
            btnOpcao.disabled = true;
            btnProxima.classList.remove('hidden');
            btnProxima.disabled = false;
        } else {
            // Evento de clique na opção
            btnOpcao.addEventListener('click', () => {
                respostasUsuario[nivelAtual][questaoIndex] = idx;
                
                document.querySelectorAll('.quiz-option').forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === pergunta.c) b.classList.add('correct');
                    else if (bIdx === idx) b.classList.add('wrong');
                });

                if (idx === pergunta.c) acertosGerais++;
                
                atualizarPainelProgresso();
                btnProxima.classList.remove('hidden');
                btnProxima.disabled = false;
            });
        }
        containerOpcoes.appendChild(btnOpcao);
    });
}

function atualizarPainelProgresso() {
    document.getElementById('metric-quiz').textContent = `${acertosGerais}/30`;
    const certBox = document.getElementById('status-certificado-box');

    if (certBox) {
        if (acertosGerais >= 21) {
            certBox.className = 'certificado-status-liberado';
            certBox.innerHTML = `
                <div class="lock-icon">🎓</div>
                <h4>Certificado Desbloqueado!</h4>
                <p>Excelente aproveitamento! Atingiu <strong>${Math.round((acertosGerais/30)*100)}% de acertos</strong> (${acertosGerais} de 30 questões) no Quiz.</p>
                <div class="btn-gap">
                    <button class="btn-gerar-cert" id="btn-abrir-doc-certificado">Visualizar Certificado do Agrinho</button>
                </div>
            `;
            document.getElementById('btn-abrir-doc-certificado').addEventListener('click', abrirCertificado);
        } else {
            certBox.className = 'certificado-status-bloqueado';
            certBox.innerHTML = `
                <div class="lock-icon">🔒</div>
                <h4>Certificado Indisponível</h4>
                <p>Atinja no mínimo <strong>70% de acertos</strong> (21 de 30 questões) no Quiz de Fixação para liberar o documento. Progresso Atual: ${acertosGerais} acertos.</p>
            `;
        }
    }
}

btnProxima.addEventListener('click', () => {
    questaoIndex++;
    if (questaoIndex >= 10) {
        if (nivelAtual === 'facil') {
            nivelAtual = 'medio'; questaoIndex = 0; marcarFocoNivel(btnMedio);
        } else if (nivelAtual === 'medio') {
            nivelAtual = 'dificil'; questaoIndex = 0; marcarFocoNivel(btnDificil);
        } else {
            questaoIndex = 9;
            alert('Trilha concluída! Verifique o seu aproveitamento e emita o certificado no painel de desempenho.');
            return;
        }
    }
    renderizarQuestao();
});

function marcarFocoNivel(btnAtivo) {
    [btnFacil, btnMedio, btnDificil].forEach(b => b.style.outline = 'none');
    btnAtivo.style.outline = '3px solid #1d2d24';
}

btnFacil.addEventListener('click', () => { nivelAtual = 'facil'; questaoIndex = 0; marcarFocoNivel(btnFacil); renderizarQuestao(); });
btnMedio.addEventListener('click', () => { nivelAtual = 'medio'; questaoIndex = 0; marcarFocoNivel(btnMedio); renderizarQuestao(); });
btnDificil.addEventListener('click', () => { nivelAtual = 'dificil'; questaoIndex = 0; marcarFocoNivel(btnDificil); renderizarQuestao(); });

// Inicialização das variáveis do Quiz
marcarFocoNivel(btnFacil);
renderizarQuestao();

// ==========================================
// 5. EMISSÃO DO CERTIFICADO AGRINHO ORIGINAL
// ==========================================
function abrirCertificado() {
    modalInjector.innerHTML = `
        <div class="modal-box-body text-center-box" style="max-width:750px; margin:auto;">
            <button class="modal-btn-fechar" id="btn-fechar-modal">✕</button>
            <div class="referencias-box">
                <div class="cert-icone-topo">🌾</div>
                <h2 class="modal-titulo">CERTIFICADO DE CONCLUSÃO</h2>
                <h4 class="certificado-subtitulo">CONCURSO AGRINHO 2026</h4>
                <p class="certificado-texto">
                    Certificamos que o aluno <strong>Daniel Ribeiro</strong> concluiu com êxito a trilha tecnológica e o plano de fixação integrada da plataforma digital <strong>Raízes do Amanhã - Inteligência Sustentável</strong>, atingindo os critérios de excelência em monitoramento e diagnóstico agroecológico rústico aplicados à Escola do Campo.
                </p>
                <div class="cert-rodape">
                    <div>
                        <strong>Antônio Olinto - PR</strong><br>
                        <span>Estado do Paraná</span>
                    </div>
                    <div style="text-align: right;">
                        <strong>Sistema FAEP / SENAR-PR</strong><br>
                        <span>Educação e Sustentabilidade</span>
                    </div>
                </div>
            </div>
            <div class="btn-flex-center" style="margin-top:20px;">
                <button class="nav-btn btn-imprimir" onclick="window.print()">🖨️ Imprimir Certificado</button>
            </div>
        </div>
    `;
    modalOverlay.classList.remove('hidden');
    document.getElementById('btn-fechar-modal').addEventListener('click', () => modalOverlay.classList.add('hidden'));
}

// ==========================================
// 6. RECURSOS DIDÁTICOS (REPRODUTOR DE MÍDIA)
// ==========================================
const btnPdf = document.getElementById('btn-midia-pdf');
const btnVideo = document.getElementById('btn-midia-video');
const mediaViewport = document.getElementById('media-viewport-container');
const mediaTitle = document.getElementById('media-viewport-title');
const mediaFrameBox = document.getElementById('media-frame-box');
const btnFecharMidia = document.getElementById('btn-fechar-midia');

if (btnPdf && btnVideo && mediaViewport) {
    btnPdf.addEventListener('click', () => {
        mediaViewport.classList.remove('hidden');
        mediaTitle.textContent = "📄 Manual de Solos (UFPR) — Repositório Académico";
        mediaFrameBox.innerHTML = `
            <div style="background:#edf2ef; padding:30px; border-radius:8px; text-align:center; border:1px dashed var(--primary-green);">
                <h4>[Simulador de Visualização de Documento PDF]</h4>
                <p style="font-size:0.9rem; color:var(--text-light); margin-top:8px;">Leitor integrado: Amostragem Química, Perfis de Solo e Fertilidade Orgânica no Campo.</p>
                <button class="nav-btn btn-imprimir mt-15" style="display:inline-block; font-size:0.85rem;" onclick="window.open('https://www.ufpr.br', '_blank')">Abrir Link Externo Institucional</button>
            </div>
        `;
        mediaViewport.scrollIntoView({ behavior: 'smooth' });
    });

    btnVideo.addEventListener('click', () => {
        mediaViewport.classList.remove('hidden');
        mediaTitle.textContent = "🎥 Práticas de Conservação Direta no Campo";
        mediaFrameBox.innerHTML = `
            <div style="background:#edf2ef; padding:40px; border-radius:8px; text-align:center; border:1px dashed var(--primary-green);">
                <div style="font-size:3rem; margin-bottom:10px;">🎥</div>
                <h4>Vídeo Didático: Construção Prática de Curvas de Nível e Proteção de Olhos d'Água</h4>
                <p style="font-size:0.9rem; color:var(--text-light);">[Reprodutor Multimédia Simulado — Demonstração Rústica para Escolas do Campo no Paraná]</p>
            </div>
        `;
        mediaViewport.scrollIntoView({ behavior: 'smooth' });
    });

    btnFecharMidia.addEventListener('click', () => {
        mediaViewport.classList.add('hidden');
        mediaFrameBox.innerHTML = '';
    });
}

// ==========================================
// 7. JOGO DA MEMÓRIA COM EFEITO VIRTUAL 3D
// ==========================================
const memoryGameBoard = document.getElementById('memory-game-board');
const btnReiniciarJogo = document.getElementById('btn-reiniciar-jogo');
const timerVal = document.getElementById('timer-val');
const movesVal = document.getElementById('moves-val');

let conjuntoCartas = ['🌾', '🌾', '🌱', '🌱', '🌿', '🌿', '🌳', '🌳', '💧', '💧', '🔄', '🔄', '🐞', '🐞', '🚜', '🚜'];
let cartasViradas = [];
let contagemPares = 0;
let totalJogadas = 0;
let cronometro = null;
let segundosPassados = 0;
let jogoIniciado = false;

function formatarTempo(s) {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const seg = (s % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
}

function iniciarCronometro() {
    if (cronometro) clearInterval(cronometro);
    segundosPassados = 0;
    cronometro = setInterval(() => {
        segundosPassados++;
        timerVal.textContent = formatarTempo(segundosPassados);
    }, 1000);
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function inicializarJogoMemoria() {
    memoryGameBoard.innerHTML = '';
    cartasViradas = [];
    contagemPares = 0;
    totalJogadas = 0;
    movesVal.textContent = '0';
    timerVal.textContent = '00:00';
    clearInterval(cronometro);
    jogoIniciado = false;

    const cartasEmbaralhadas = embaralhar([...conjuntoCartas]);

    cartasEmbaralhadas.forEach((emoji, index) => {
        const tile = document.createElement('div');
        tile.className = 'memory-tile';
        tile.setAttribute('data-emoji', emoji);

        tile.innerHTML = `
            <div class="tile-back">❓</div>
            <div class="tile-front">${emoji}</div>
        `;

        tile.addEventListener('click', () => {
            if (!jogoIniciado) {
                iniciarCronometro();
                jogoIniciado = true;
            }

            if (tile.classList.contains('flipped') || tile.classList.contains('matched') || cartasViradas.length >= 2) {
                return;
            }

            tile.classList.add('flipped');
            cartasViradas.push(tile);

            if (cartasViradas.length === 2) {
                totalJogadas++;
                movesVal.textContent = totalJogadas;

                const t1 = cartasViradas[0];
                const t2 = cartasViradas[1];

                if (t1.getAttribute('data-emoji') === t2.getAttribute('data-emoji')) {
                    t1.classList.add('matched');
                    t2.classList.add('matched');
                    contagemPares += 2;
                    cartasViradas = [];

                    if (contagemPares === conjuntoCartas.length) {
                        clearInterval(cronometro);
                        setTimeout(() => {
                            alert(`🎉 Parabéns! Completou o Jogo da Memória Ecológico em ${formatarTempo(segundosPassados)} com ${totalJogadas} jogadas!`);
                        }, 400);
                    }
                } else {
                    setTimeout(() => {
                        t1.classList.remove('flipped');
                        t2.classList.remove('flipped');
                        cartasViradas = [];
                    }, 1000);
                }
            }
        });

        memoryGameBoard.appendChild(tile);
    });
}

if (btnReiniciarJogo) {
    btnReiniciarJogo.addEventListener('click', inicializarJogoMemoria);
}

// Inicialização automática do Jogo ao carregar a página
inicializarJogoMemoria();