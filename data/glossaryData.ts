import type { GlossaryItem, Acronym } from '../types';

export const acronymsData: Acronym[] = [
  { term: "BI", definition: "Business Intelligence" },
  { term: "IA", definition: "Inteligência Artificial" },
  { term: "KPI", definition: "Key Performance Indicator (Indicador-Chave de Desempenho)" },
  { term: "MRP", definition: "Material Requirements Planning (Planejamento das Necessidades de Materiais)" },
  { term: "OTIF", definition: "On-Time In-Full (Entregas no Prazo e Completas)" },
  { term: "PCP", definition: "Planejamento e Controle da Produção" },
  { term: "RPA", definition: "Robotic Process Automation (Automação Robótica de Processos)" },
  { term: "S&OE", definition: "Sales and Operations Execution (Execução de Vendas e Operações)" },
  { term: "S&OP", definition: "Sales and Operations Planning (Planejamento de Vendas e Operações)" },
  { term: "SKU", definition: "Stock Keeping Unit (Unidade de Manutenção de Estoque)" },
  { term: "SLOB", definition: "Slow-Moving and Obsolete Stock (Estoque de Baixo Giro e Obsoleto)" },
  { term: "VMI", definition: "Vendor-Managed Inventory (Estoque Gerenciado pelo Fornecedor)" },
];

export const glossaryData: GlossaryItem[] = [
  // NÍVEL 1
  {
    id: 1, type: 'practice', practice: "Sistema de Controle de Estoque (ERP)", shortPractice: "Controle em ERP", level: 1, y: 500, weight: 5, priority: 1,
    description: "Utilização de um sistema ERP (Enterprise Resource Planning) como fonte única da verdade para controle de saldos, entradas e saídas de materiais.",
    riskAssociated: "Alto custo de estoque",
    mitigation: "A falta de visibilidade centralizada leva a compras excessivas para evitar faltas, imobilizando capital. O ERP fornece essa visão.",
    implementation: "Garantir codificação de todos os itens, registrar todas as movimentações em tempo real e realizar contagens físicas periódicas para validação.",
    goalPossible: "Acuracidade de inventário > 98%.",
    actions: []
  },
  {
    id: 101, type: 'risk', practice: "Alto custo de estoque", shortPractice: "Custo de Estoque", level: 1, y: 595,
    description: "Capital excessivo imobilizado em materiais, aumentando custos de armazenagem e risco de obsolescência."
  },
  {
    id: 2, type: 'practice', practice: "Processos de Materiais Mapeados", shortPractice: "Processos Mapeados", level: 1.2, y: 430, weight: 5, priority: 2,
    description: "Processos básicos de recebimento, armazenagem e expedição são documentados e padronizados, ainda que reativos.",
    riskAssociated: "Rupturas constantes",
    mitigation: "Processos não definidos geram falhas operacionais que resultam em falta de material e paradas de produção.",
    implementation: "Mapear o fluxo de valor (VSM) das operações de materiais, identificar gargalos e definir procedimentos operacionais padrão (POPs).",
    goalPossible: "Reduzir em 30% o tempo gasto em atividades operacionais não planejadas.",
    actions: []
  },
  {
    id: 102, type: 'risk', practice: "Rupturas constantes", shortPractice: "Rupturas", level: 1.2, y: 610,
    description: "Falta de materiais críticos que causam paradas de produção, perda de vendas e insatisfação do cliente."
  },
  {
    id: 13, type: 'practice', practice: "Medição de Acuracidade de Inventário", shortPractice: "Acuracidade", level: 1.5, y: 350, weight: 5, priority: 3,
    description: "Implementação de um programa de contagem cíclica para medir e corrigir a acuracidade do estoque registrado no sistema.",
    riskAssociated: "Dados pouco confiáveis",
    mitigation: "Sem medição, a confiança nos dados do sistema é baixa, levando a decisões de compra e produção equivocadas.",
    implementation: "Definir frequência de contagem por curva ABC, treinar equipe e estabelecer processo de análise de causa raiz para as divergências.",
    goalPossible: "Atingir 98% de acuracidade de estoque por SKU.",
    actions: []
  },
  // NÍVEL 2
  {
    id: 3, type: 'practice', practice: "Políticas de Estoque (Curva ABC)", shortPractice: "Política ABC", level: 2, y: 400, weight: 7, priority: 1,
    description: "Criação de regras claras para controle de inventário, como classificação de itens (ABC) e definição de estoque de segurança e ponto de pedido.",
    riskAssociated: "Dados pouco confiáveis",
    mitigation: "Sem políticas, os cadastros (lead time, estoque de segurança) são inconsistentes, levando a erros de planejamento.",
    implementation: "Definir regras com base em melhores práticas (Curva ABC, criticidade), treinar a equipe e auditar a conformidade.",
    goalPossible: "100% dos itens classificados e com política de estoque definida no sistema.",
    actions: []
  },
  {
    id: 103, type: 'risk', practice: "Dados pouco confiáveis", shortPractice: "Dados Ruins", level: 2, y: 620,
    description: "Informações de estoque e cadastros incorretos no sistema, levando a decisões de compra equivocadas."
  },
  {
    id: 14, type: 'practice', practice: "Medição de OTIF de Fornecedores", shortPractice: "Medição OTIF", level: 2.5, y: 440, weight: 5, priority: 3,
    description: "Estabelecer o indicador OTIF (On-Time In-Full) para medir a performance de entrega dos fornecedores.",
    riskAssociated: "Visibilidade limitada da cadeia",
    mitigation: "Medir o OTIF expõe problemas de performance dos fornecedores, sendo o primeiro passo para melhorar a confiabilidade da cadeia.",
    implementation: "Definir as regras de medição (janelas de entrega, tolerâncias) e criar um processo para registrar e reportar os dados.",
    goalPossible: "Alcançar OTIF de 95% com os principais fornecedores.",
    actions: []
  },
  {
    id: 4, type: 'practice', practice: "Uso funcional do MRP", shortPractice: "MRP Funcional", level: 2.3, y: 340, weight: 8, priority: 2,
    description: "Utilizar o módulo de Planejamento de Necessidades de Materiais do ERP para calcular as necessidades de compra de forma básica.",
    riskAssociated: "Visibilidade limitada da cadeia",
    mitigation: "O MRP centraliza a informação, melhorando a visão sobre as necessidades futuras e o status do estoque atual.",
    implementation: "Garantir acuracidade dos dados de entrada (estoque, lead time) e cadastrar parâmetros (mínimo, máximo).",
    goalPossible: "80% dos itens de matéria-prima planejados via MRP.",
    actions: []
  },
  {
    id: 104, type: 'risk', practice: "Visibilidade limitada da cadeia", shortPractice: "Visibilidade Limitada", level: 2.3, y: 625,
    description: "Falta de conhecimento sobre o status de pedidos, trânsito de materiais e capacidade dos fornecedores."
  },
  // NÍVEL 3
  {
    id: 5, type: 'practice', practice: "MRP Confiável e Automatizado", shortPractice: "MRP Confiável", level: 3, y: 310, weight: 8, priority: 1,
    description: "Evolução do uso do MRP, com dados acurados gerando sugestões de compra confiáveis e automáticas.",
    riskAssociated: "Metas desalinhadas entre áreas",
    mitigation: "Um MRP confiável fornece uma base de dados única, forçando o alinhamento entre planejamento, compras e produção.",
    implementation: "Processos de contagem cíclica, revisão periódica de parâmetros (estoque de segurança dinâmico).",
    goalPossible: "Aderência às sugestões do sistema > 90%.",
    actions: []
  },
  {
    id: 105, type: 'risk', practice: "Metas desalinhadas entre áreas", shortPractice: "Metas Desalinhadas", level: 3, y: 610,
    description: "Vendas, Produção e Materiais com objetivos conflitantes (ex: Vendas quer estoque alto, Finanças quer baixo), gerando ineficiências."
  },
  {
    id: 6, type: 'practice', practice: "Dashboards de BI para Análise", shortPractice: "Dashboards BI", level: 3.2, y: 275, weight: 7, priority: 2,
    description: "Criação de painéis visuais que consolidam os principais KPIs da área para análise rápida e decisão baseada em dados.",
    riskAssociated: "Previsão de demanda imprecisa",
    mitigation: "Dashboards permitem visualizar tendências históricas de consumo de forma clara, sendo o primeiro passo para uma previsão estruturada.",
    implementation: "Conectar ferramenta de BI (ex: Power BI) ao ERP, definir indicadores e construir os dashboards.",
    goalPossible: "Redução do tempo de geração de relatórios em 80%.",
    actions: []
  },
  {
    id: 30, type: 'practice', practice: "Expandir Governança da Área", shortPractice: "Expandir Governança", level: 3.4, y: 350, weight: 8, priority: 3,
    description: "Integrar a gestão de materiais de outras unidades/negócios sob as políticas e sistemas corporativos.",
    riskAssociated: "Metas desalinhadas entre áreas",
    mitigation: "A governança centralizada garante que todas as unidades trabalhem com os mesmos KPIs e objetivos, reduzindo silos.",
    implementation: "Mapear processos das novas áreas, planejar migração de dados e sistemas, e treinar as equipes locais.",
    goalPossible: "Aumentar a cobertura da governança para 80% do inventário total da companhia.",
    actions: [],
  },
  {
    id: 15, type: 'practice', practice: "Medição de Acuracidade de Demanda", shortPractice: "Forecast Accuracy", level: 3.5, y: 410, weight: 7, priority: 4,
    description: "Implementar a medição do Forecast Accuracy para avaliar a qualidade da previsão de vendas e seu impacto nos estoques.",
    riskAssociated: "Previsão de demanda imprecisa",
    mitigation: "O que não se mede, não se gerencia. Medir o erro da previsão é o primeiro passo para identificar suas causas e melhorá-la.",
    implementation: "Definir a métrica (ex: MAPE, WMAPE), o nível de agregação (SKU, família) e criar um processo para calcular e divulgar o resultado.",
    goalPossible: "Atingir X% de acuracidade na previsão (benchmark varia por indústria).",
    actions: []
  },
  {
    id: 106, type: 'risk', practice: "Previsão de demanda imprecisa", shortPractice: "Previsão Imprecisa", level: 3.2, y: 600,
    description: "Erro elevado entre a demanda prevista e a realizada, resultando em excesso ou falta de estoque."
  },
  // NÍVEL 4
   {
    id: 7, type: 'practice', practice: "Gestão de estoque consignado/VMI", shortPractice: "Consignado/VMI", level: 4, y: 300, weight: 6, priority: 2,
    description: "Implementar e expandir o uso de estoque de propriedade do fornecedor (consignado) ou VMI para categorias estratégicas.",
    riskAssociated: "Dependência de parceiros",
    mitigation: "A consignação/VMI cria uma colaboração mais profunda, alinhando interesses operacionais e financeiros com fornecedores.",
    implementation: "Selecionar fornecedores e itens estratégicos, definir acordos claros (SLA) e estabelecer processos de controle e visibilidade.",
    goalPossible: "Ter 20% do valor do inventário de matéria-prima em modelo consignado/VMI.",
    actions: [],
  },
  {
    id: 8, type: 'practice', practice: "Processo S&OP Estruturado", shortPractice: "Processo S&OP", level: 4.2, y: 205, weight: 7, priority: 1,
    description: "Processo tático mensal que alinha Vendas, Marketing, Finanças e Operações para equilibrar demanda e suprimento.",
    riskAssociated: "Dependência de parceiros",
    mitigation: "O S&OP fornece visibilidade de médio prazo aos fornecedores, permitindo que eles se planejem e melhorando a colaboração.",
    implementation: "Definir um ciclo mensal com reuniões estruturadas, envolver lideranças e usar dados consolidados.",
    goalPossible: "Aderência ao plano S&OP > 95%.",
    actions: []
  },
  {
    id: 107, type: 'risk', practice: "Dependência de parceiros", shortPractice: "Dependência", level: 4, y: 585,
    description: "Vulnerabilidade a disrupções na cadeia por falta de fornecedores alternativos ou baixa colaboração e visibilidade."
  },
   {
    id: 12, type: 'practice', practice: "Análise Preditiva com IA para Demanda", shortPractice: "IA para Demanda", level: 4.5, y: 255, weight: 7, priority: 3,
    description: "Utilizar modelos de Machine Learning/IA para prever a demanda futura com maior acuracidade, considerando sazonalidade e variáveis externas.",
    riskAssociated: "Previsão de demanda imprecisa",
    mitigation: "Modelos de IA podem identificar padrões complexos que métodos tradicionais não conseguem, melhorando a acuracidade do forecast.",
    implementation: "Coletar e limpar dados históricos, contratar especialista ou plataforma de IA, validar o modelo contra a realidade.",
    goalPossible: "Aumentar a acuracidade da previsão de demanda (Forecast Accuracy) em 15%.",
    actions: [],
  },
  // --- NÍVEL 5 ---
  {
    id: 9, type: 'practice', practice: "Otimização de Estoque com IA", shortPractice: "Otimização IA", level: 5, y: 180, weight: 8, priority: 1,
    description: "Utilizar IA para calcular dinamicamente os níveis ótimos de estoque de segurança e ponto de pedido por SKU/local (MEIO).",
    riskAssociated: "Alto Custo de Tecnologia",
    mitigation: "A otimização com IA permite um planejamento mais preciso, reduzindo o 'efeito chicote' (bullwhip effect) na cadeia de suprimentos.",
    implementation: "Adquirir ou desenvolver software especializado (MEIO - Multi-echelon inventory optimization) e treinar analistas para interpretar as sugestões.",
    goalPossible: "Redução de 15% no estoque de segurança mantendo ou melhorando o nível de serviço.",
    actions: []
  },
  {
    id: 10, type: 'practice', practice: "Planejamento Prescritivo (IA)", shortPractice: "Planej. Prescritivo", level: 5, y: 140, weight: 8, priority: 2,
    description: "Uso avançado de IA que simula cenários e recomenda as melhores ações a serem tomadas (ex: onde alocar estoque para maximizar margem).",
    riskAssociated: "Alto Custo de Tecnologia",
    mitigation: "O ROI de sistemas prescritivos é alto, justificando o custo através de otimizações de capital de giro e redução de perdas.",
    implementation: "Implementar plataformas de Supply Chain avançadas (Digital Twin) e integrar múltiplas fontes de dados (mercado, clima, etc.).",
    goalPossible: "Aumento da margem de contribuição em X% devido a decisões otimizadas.",
    actions: []
  },
  {
    id: 11, type: 'practice', practice: "Torre de Controle (Supply Chain)", shortPractice: "Torre de Controle", level: 5, y: 200, weight: 7, priority: 3,
    description: "Central de informações que monitora em tempo real toda a cadeia de suprimentos (end-to-end), alertando sobre desvios.",
    riskAssociated: "Alto Custo de Tecnologia",
    mitigation: "A visibilidade total provida pela torre de controle permite identificar ineficiências e gargalos, gerando economias que pagam o investimento.",
    implementation: "Integração total de sistemas (ERP, TMS, WMS), uso de IoT para rastreabilidade e dashboards centralizados.",
    goalPossible: "Redução do tempo de resposta a disrupções em 50%.",
    actions: []
  },
  {
    id: 108, type: 'risk', practice: "Alto Custo de Tecnologia", shortPractice: "Custo Tecnologia", level: 5, y: 570,
    description: "O investimento em sistemas avançados (IA, Torre de Controle) é alto e o ROI precisa ser claramente justificado e acompanhado."
  }
];