/**
 * Carga inicial do localStorage → PATCH /userData/jeeh
 * Trechos truncados no dump foram omitidos/parcialmente recuperados.
 */
const API = "http://localhost:3005";

const calendarAll = {
  "2025-05-16": [
    {
      id: "7cfc7620-8b8b-43b9-ac81-56c39a741621",
      desc: "Manutenção total Cleyton",
      category: "personal",
    },
  ],
};

const dietAll = {
  "2025-05-15": [
    {
      id: "0b0f4901-898e-4218-9d21-884872abb120",
      name: "Arroz 50g",
      quantity: "100",
      unit: "g",
      calories: "128.00",
      protein: "2.00",
      carb: "50.00",
      fat: "26.00",
      fiber: "50.00",
      time: "01:00",
      _base: { quantity: 50, calories: 64, protein: 1, carb: 25, fat: 13, fiber: 25 },
    },
    {
      id: "0afb6eea-b0eb-468e-965a-7b00065f8655",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "01:00",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "eaa6e1ab-6c72-4179-ad8f-228a7dacc90d",
      name: "Arroz 50g",
      quantity: "100",
      unit: "g",
      calories: "128.00",
      protein: "2.00",
      carb: "50.00",
      fat: "26.00",
      fiber: "50.00",
      time: "03:00",
      _base: { quantity: 50, calories: 64, protein: 1, carb: 25, fat: 13, fiber: 25 },
    },
    {
      id: "ecf5a45f-b7b7-4be0-b4cf-f5d55812f340",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "03:00",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "333d81d4-6801-4e0b-9403-bd85d470451f",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "12:01",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "758ae9e5-8e89-480a-973b-cae8056139ce",
      name: "Arroz 50g",
      quantity: "100",
      unit: "g",
      calories: "128.00",
      protein: "2.00",
      carb: "50.00",
      fat: "26.00",
      fiber: "50.00",
      time: "13:22",
      _base: { quantity: 50, calories: 64, protein: 1, carb: 25, fat: 13, fiber: 25 },
    },
  ],
  "2025-05-17": [
    {
      id: "6c5e2afc-a35f-41e9-a8a4-5c1b64311e5f",
      name: "Arroz 50g",
      quantity: "100",
      unit: "g",
      calories: "128.00",
      protein: "2.00",
      carb: "50.00",
      fat: "26.00",
      fiber: "50.00",
      time: "19:39",
      _base: { quantity: 50, calories: 64, protein: 1, carb: 25, fat: 13, fiber: 25 },
    },
    {
      id: "8276a898-77a0-4080-817a-a70d4c983896",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "19:39",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "ff6f6f03-917a-40af-b01c-7de2b636b117",
      name: "Arroz 50g",
      quantity: "100",
      unit: "g",
      calories: "128.00",
      protein: "2.00",
      carb: "50.00",
      fat: "26.00",
      fiber: "50.00",
      time: "19:39",
      _base: { quantity: 50, calories: 64, protein: 1, carb: 25, fat: 13, fiber: 25 },
    },
    {
      id: "ef6f8c56-66e0-446b-b591-5e4a17ba3a63",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "19:39",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "19783be2-b972-40e1-92d7-d490cb0e2a9f",
      name: "Monster Pipeline Punch",
      quantity: "473",
      unit: "ml",
      calories: "165",
      protein: "04",
      carb: "41",
      fat: "0",
      fiber: "03",
      time: "19:47",
      _base: { quantity: 473, calories: 165, protein: 4, carb: 41, fat: 0, fiber: 3 },
    },
  ],
  "2025-05-19": [
    {
      id: "1956738d-5daa-4b2f-aa83-2316625468fd",
      name: "Monster Pipeline Punch",
      quantity: "473",
      unit: "ml",
      calories: "165",
      protein: "04",
      carb: "41",
      fat: "0",
      fiber: "03",
      time: "15:04",
      _base: { quantity: 473, calories: 165, protein: 4, carb: 41, fat: 0, fiber: 3 },
    },
    {
      id: "b923da0a-53eb-4b4d-bbf6-28b19e46497d",
      name: "Frango Desfiado",
      quantity: "200",
      unit: "g",
      calories: "204.00",
      protein: "46.00",
      carb: "0.00",
      fat: "2.00",
      fiber: "4.00",
      time: "15:05",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
  ],
  "2025-05-20": [
    {
      id: "3caa5419-f5a2-42e8-a847-5121d9bf59fc",
      name: "Frango Desfiado",
      quantity: "100",
      unit: "g",
      calories: "102",
      protein: "23",
      carb: "0",
      fat: "1",
      fiber: "2",
      time: "02:55",
      _base: { quantity: 100, calories: 102, protein: 23, carb: 0, fat: 1, fiber: 2 },
    },
    {
      id: "7373e9d9-d3b7-43e7-8f86-1b37db604580",
      name: "Whey 10g",
      quantity: "1",
      unit: "shake",
      calories: "106",
      protein: "15",
      carb: "26666667",
      fat: "11",
      fiber: "06666667",
      time: "03:18",
      _base: { quantity: 1, calories: 106, protein: 15, carb: 26666667, fat: 11, fiber: 6666667 },
    },
  ],
};

const tobuyList = [
  {
    id: "24fafcc2-be66-4977-8619-337bc3f4a8e5",
    description: "Escritório: Clonador tag mais profissa (ou USB)",
    finished: true,
    priority: true,
  },
  {
    id: "41bf3269-c67e-4b33-bf1c-da783367df08",
    description: "Escritório 2: Cartucho impressora",
    finished: false,
    priority: false,
  },
  {
    id: "469a3427-a7ff-44a1-b25d-c36f057c9dcf",
    description: "Spray Cinza Grafite (tramontina)",
    finished: true,
    priority: false,
  },
  {
    id: "35bd92c0-76a3-4b29-955e-f7e703566733",
    description: "Gatos: pote de comida pequeno p/ sachê",
    finished: true,
    priority: true,
  },
  {
    id: "634a57fe-3269-4b2e-a6c6-6e37cdc9a6ae",
    description: "Gatos: Pote com tampa p/ guardar sachê aberto",
    finished: true,
    priority: true,
  },
  { id: "42549e3d-18ad-4cbb-9c8f-2d742465f82e", order: 6, description: "Kit reparo descarga", finished: true, priority: true },
  { id: "9e045f3b-5d04-4caa-829b-de0b3f1977a2", order: 4, description: "Lente de Contato", finished: true, priority: true },
  { id: "74af135f-13f1-410a-b261-124d79761f2e", order: 1, description: "Bicarbonáto de Sódio (5kg)", finished: true, priority: true },
  { id: "0eba1c56-45da-440b-b218-71490bc91809", order: 2, description: "Sacola Grande", finished: true, priority: true },
  { id: "6a705109-ceb7-4be0-a1c7-379b818114a9", order: 7, description: "Lixa 1000", finished: true, priority: true },
  { id: "56be0c28-f704-49d1-948a-92186465b18f", order: 8, description: "Cleyton Novo (1200)", finished: true, priority: false },
  {
    id: "a27da522-629b-403b-af1d-fe44f26816d3",
    order: 3,
    description: "Cozinha: Sacola Lixinho Pequena",
    finished: false,
    priority: false,
  },
  {
    id: "b1404239-a2f8-4f26-9bb8-dbeabdc9bc09",
    order: 8,
    description: "Quarto: Cama Nova (queen) [Valor antigo: R$4700]",
    finished: false,
    priority: false,
  },
  { id: "cb791862-4a0d-4e8d-806b-eeb1e8db6477", order: 9, description: "Quarto: Travesseiros Novos", finished: false, priority: false },
  { id: "7f33343a-bec8-45f6-b7f3-f302d377cf4a", order: 10, description: "15x Spray Preto Fosco", finished: true, priority: false },
  { id: "b28a422a-aba2-4ac6-8568-7fd632d352ac", order: 11, description: "Tapete Escorredor Cozinha", finished: true, priority: false },
  { id: "6088a0fe-554c-4885-a2d8-604df58931c5", order: 13, description: "Firestick 4k", finished: true, priority: false },
  { id: "44a5117e-cc4b-4016-9f9e-2eb6e6edf76a", order: 14, description: "Soldador de plástico", finished: false, priority: false },
  { id: "827cf731-c597-4148-8a78-45fe9ac0c35f", description: "Cozinha: Microondas Novo", finished: false, priority: false },
  { id: "20cc1786-2d27-428d-9a11-a06beb90f891", description: "Banheiro: Box Pia", finished: false, priority: true },
  { id: "c391417a-50d5-48d9-9143-c6bb69805736", description: "Banheiro: Armário Pia", finished: false, priority: false },
  { id: "24ba41b3-d8bf-45d7-9cfb-c5ac15063e9d", description: "Sala: Vaso planta grande", finished: true, priority: false },
  { id: "8bc33ca4-9b75-496f-bf52-7f8d964c6817", description: "Escritório 2: Guilhotina de mesa (A4)", finished: false, priority: false },
  { id: "a993e63d-d106-41a3-9f29-21b8eff50517", description: "Escritório 2: Silhouette (?)", finished: false, priority: false },
  { id: "4c50d552-1a96-4a2f-ad53-bcdbbb81041f", description: "Verniz brilhante", finished: false, priority: false },
  { id: "a64900be-7268-4388-b229-a1eb0220ce8e", description: "Canetinha Colorida", finished: true, priority: false },
];

const todoList = [
  { id: "a168f923-6f8b-40ca-a7d1-c3d211f9d511", description: "Cozinha: Interfone: Adaptar antena wifi", finished: true, priority: true },
  { id: "f5a94877-7ee9-44bd-88d2-fc9281de8b39", description: "Sistema: Esconder concluídos", finished: true, priority: true },
  { id: "c4f93ca3-13a0-41e1-9589-6dab39278e27", description: "Sistema: esconder completed", finished: true, priority: true },
  { id: "b0f8b537-30fc-4dfd-b198-43b9be4229fe", description: "Hall 2: Ziper no Cleytinho", finished: true, priority: true },
  { id: "7c8192bb-36e6-4be3-80fd-4bd316c00b9b", description: "Sistema: ToDo: Right Click: Move to Top/Bottom", finished: false, priority: true },
  { id: "acad1a42-d631-45ad-9110-696622d53b8c", description: "Escritório: Mouse double click", finished: true, priority: true },
  { id: "22c5b4e1-8687-422e-806e-c8d4d4dbab09", description: "Sistema: ToDo: Arrumar ordenação", finished: true, priority: true },
  { id: "1221c055-bff3-4535-8326-cbd57f7ea5dd", order: 36, description: "Energia: identificar fuga / gasto elevado", finished: true, priority: true },
  { id: "24f4b2f3-834c-4b99-8f26-a942bcaffe73", description: "Cleytinho: Tampa do reservatório de pó (colocar dobradiça)", finished: false, priority: true },
  { id: "734231b1-2257-4651-b20f-16e32bafa647", order: 8, description: "Notebook: Seu Alberto", finished: true, priority: true },
  { id: "f11ecb6b-4543-4c9a-9aed-7693d68e5499", description: "Escritório: Guardar caixinhas da prateleira antiga do modem", finished: true, priority: false },
  { id: "47dff4a8-db20-471d-8110-157c1ee906a5", order: 23, description: "Cortar Cabelo", finished: true, priority: true },
  { id: "29cb0d1d-8af2-4acb-b0dd-d7c9eeb76e4b", order: 14, description: "Descarga Banheiro Vazando", finished: true, priority: true },
  { id: "aab93318-59a8-4a1b-a28d-dd027271b21c", order: 15, description: "Quarto: Arrumar ventilador (rotação)", finished: false, priority: true },
  { id: "04bd6273-5d1e-47c7-9d4f-1ce6f6b84d6d", order: 24, description: "Lavar Grade Exaustor", finished: true, priority: false },
  { id: "985440ff-8297-49be-a07a-f9b182aa1804", order: 33, description: "Cozinha: Trocar gancho pano de prato", finished: true, priority: false },
  { id: "a7eaf7fa-ff59-4efb-a9e5-626fd250736a", order: 34, description: "Sala: Arrumar Cortina", finished: false, priority: false },
  { id: "ef3eb288-02fa-4490-b5ab-dd808f6f9324", order: 6, description: "Microfone: arrumar braço", finished: false, priority: true },
  { id: "391420d5-4d87-48b1-8f42-005bed825133", description: "Microfone: Diminuir elástico", finished: false, priority: false },
  { id: "116594ee-09b8-4c68-8852-122b846e9860", order: 32, description: "Notebook: Filho do Seu Alberto", finished: false, priority: false },
  { id: "da63c24d-8838-4f8d-9f35-bc14499ee6b5", order: 21, description: "Atualizar iOS", finished: true, priority: false },
  { id: "f9288ef1-b6af-44cf-a79f-ee49075373b4", order: 28, description: "Cleytinho: Fazer Rampa para voltar da Área de Serviço", finished: true, priority: true },
  { id: "7f3ce3b0-66e0-413f-9545-c9f443203375", order: 35, description: "Cleytinho: Organizar sala para adicionar na limpeza", finished: true, priority: true },
  { id: "9cdf5be7-d7dd-47dc-901c-3cbe41353764", order: 23, description: "Cavaletinho Gouvea", finished: true, priority: false },
  { id: "954ebd64-75e6-4334-bbae-0944091bbc82", order: 0, description: "Sistema: ToDo", finished: true },
  { id: "cca9e634-4e80-4ff6-bfd2-b71971b2b735", order: 26, description: "Sistema: Agenda/Calendário", finished: true, priority: false },
  { id: "66b59eef-7a3d-4b16-aeba-94730fddd996", order: 2, description: "Sistema: Dieta", finished: true },
  { id: "ec1edbed-816b-4190-8b0f-ed838b725e06", order: 12, description: "Escritório: Arrumar fios PC & Canaleta", finished: false },
  { id: "44c8df58-ac94-405e-8b9c-bb043602c3cd", order: 22, description: "Cozinha: Colocar prateleira (Interfone & Alexa)", finished: false },
  { id: "72870001-4023-42d8-a52a-0da2c4d5246e", order: 21, description: "Cozinha: Arrumar fios balcão", finished: true },
  { id: "67ec937c-7316-44e7-9370-8601793381e5", order: 10, description: "Quarto: Degraus Gatos", finished: false },
  { id: "74582adf-7b84-4cdd-b125-784de4f4ec5c", order: 17, description: "Recolocar Vidro desktop", finished: true },
];

const notepad = {
  x: "1042px",
  y: "568px",
  width: "238px",
  height: "284px",
  isMinimized: true,
  isClosed: false,
  text: `490107340451 - stagging 
490107224853 - dev

Daniel: arquiteto/PO (California)

Rahul: diretor que tá encabeçando esse projeto


Ramon - Porto Alegre/RS
Daniel: California
Caio - Rio Claro/SP
Rafael - Estiva Gerbi/SP
Thiago - São Jose do Rio Preto/SP
Arthur: Maceió

Storm, CARES e Athena
Apollo (grupo de aplicações)

2 main features:
login: AWS cognito -> one single pool => user management
permissions: consolidate in just one structure
 
 
 
1st step: json file in AWS
2nd step: groups with agency (middle of next year)
 
 
 
Start with Storm -> then CARES -> then Athena
Storm é o mais atualizado (React novo) -> Aplicação ira residir lá
 
Designer available -> early november

Storm - Our main serverless AFIS product, standard fingerprint investigation and matching software.
 
CARES/SNF - Our record management or background check software. SNF specifically adds archival features and will most likely be used as a "hub" for all products in the future. SNF is an evolution of CARES, as is considered internally as "CARES 2.0"
 
Athena(Also known as UE2) - Enrollment and appointment software. Example: you go somewhere to have your fingerprints taken for a job application or other civil reason. Athena has multiple portals for enrollment(livescan), appointment times, payment center, and administration.
 
ID2Secure - Currently in progress of being built but from what I understand acts as a simple enrollment solution via tablet for the main use of travel security.


amplify + cognito = jwt token
Alison

Dashboard - AI Prompt - create a new user with this values and company`,
  title: "Notepad",
  darkMode: true,
};

const postIt = {
  text: `Thiago Giovanella: CARES / Athena
Rodrigo Elias: ID2SEC

maçaneta porta: 4x17cm


Cama
Microondas Maior

Prancha - 3–5 séries de 20–40s (todo dia)

Gymnocalycium mihanovichii - cacto rubro

Ale: 
- Cortar atrás pontudo
- Evitar franja reta
- Progressiva vegana (dura 1 semana)
- Franja nas entrada muito curta
0.2 (+ rapido)

- Veneno tomada pernilongo
- Prender porta na parede (não bater)
- Ventilação Armários
- Softbox na parede
- Curtain holder (coração sigilism/neo-tribal - devimon - boca charizard)
- Pingente colar (coração, hexagono [tudo sigilism])
- Caixa pra extensão dos pisca-pisca com botão on/off
- Moldura quadro`,
  x: "769.609375px",
  y: "299px",
  isMinimized: true,
  width: "501px",
  height: "484px",
  isClosed: false,
};

const mindmap = {
  x: "298px",
  y: "44px",
  width: "1064px",
  height: "620px",
  isMinimized: true,
  isClosed: false,
  nodes: [
    {
      id: "node-1756708760143",
      type: "custom",
      position: { x: 279.23285177963044, y: 313.33020777811885 },
      data: {
        label: "Pintar Coisas",
        autoEdit: false,
        style: { background: "#f3f4f6", border: "2px solid #d1d5db", borderRadius: "6px", padding: "8px" },
        forceEdit: false,
        isBoxStyle: true,
      },
      measured: { width: 118, height: 44 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711414768",
      type: "custom",
      position: { x: -257.0983803817676, y: 234.14840847345693 },
      data: { label: "Cleytinho", autoEdit: false, isBoxStyle: true },
      measured: { width: 95, height: 44 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711424891",
      type: "custom",
      position: { x: -77.09838038176758, y: 233.22427517267568 },
      data: { label: "Rampa", autoEdit: false, isBoxStyle: false },
      measured: { width: 76, height: 40 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711428409",
      type: "custom",
      position: { x: -77.09838038176758, y: 268.2242751726757 },
      data: { label: "Reposicionar", autoEdit: false, isBoxStyle: false },
      measured: { width: 121, height: 40 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711440502",
      type: "custom",
      position: { x: 97.59269674019208, y: 248.29324489923818 },
      data: { label: "Argamassa", autoEdit: false, isBoxStyle: false },
      measured: { width: 106, height: 40 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711465155",
      type: "custom",
      position: { x: -173.9562069351816, y: -417.3479788333907 },
      data: { label: "Carro", autoEdit: false, isBoxStyle: true, forceEdit: false },
      measured: { width: 67, height: 44 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1756711480846",
      type: "custom",
      position: { x: 11.352715942858708, y: -479.13859386996126 },
      data: { label: "Estofado portas", autoEdit: false, isBoxStyle: false },
      measured: { width: 143, height: 40 },
    },
    {
      id: "node-1756711486361",
      type: "custom",
      position: { x: 11.352715942858708, y: -444.13859386996126 },
      data: { label: "Estofado teto", autoEdit: false, isBoxStyle: false },
      measured: { width: 125, height: 40 },
    },
    {
      id: "node-1756711534493",
      type: "custom",
      position: { x: 459.23285177963044, y: 312.4060744773376 },
      data: { label: "Colar", autoEdit: false, isBoxStyle: false },
      measured: { width: 63, height: 40 },
      selected: false,
    },
    {
      id: "node-1756947416258",
      type: "custom",
      position: { x: 459.23285177963044, y: 347.4060744773376 },
      data: { label: "Pé das cômodas \n/ balcão", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 144, height: 64 },
      selected: false,
    },
    {
      id: "node-1765481173960",
      type: "custom",
      position: { x: 601.1465332587018, y: -420.9520059213202 },
      data: { label: "Impressões 3D", autoEdit: false, isBoxStyle: true, forceEdit: false },
      measured: { width: 132, height: 44 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1765481214493",
      type: "custom",
      position: { x: 781.1465332587018, y: -491.8761392221015 },
      data: { label: "Veneno tomada Pernilongo", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 229, height: 40 },
      selected: false,
    },
    {
      id: "node-1765481231492",
      type: "custom",
      position: { x: 781.1465332587018, y: -456.8761392221015 },
      data: { label: "Prender porta", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 129, height: 40 },
    },
    {
      id: "node-1765481245222",
      type: "custom",
      position: { x: 781.1465332587018, y: -421.8761392221015 },
      data: { label: "Ventilação Armários", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 175, height: 40 },
    },
    {
      id: "node-1765481256945",
      type: "custom",
      position: { x: 781.1465332587018, y: -386.8761392221015 },
      data: { label: "Softbox Parede", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 139, height: 40 },
      selected: false,
      dragging: false,
    },
    {
      id: "node-1765481269826",
      type: "custom",
      position: { x: 781.1465332587018, y: -351.8761392221015 },
      data: { label: "Curtain Holder", autoEdit: false, isBoxStyle: false, forceEdit: false },
      measured: { width: 135, height: 40 },
    },
  ],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
};

const payload = {
  currentTab: 2,
  calendarVisible: false,
  calendarAll,
  dietAll,
  list: {
    todo: { list: todoList, backup: todoList, showCompleted: false },
    tobuy: { list: tobuyList, backup: tobuyList, showCompleted: false },
    car: { list: [], backup: [], showCompleted: true },
  },
  notepad,
  postIt,
  mindmap,
};

const res = await fetch(`${API}/userData/jeeh`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const text = await res.text();
console.log("status", res.status);
if (!res.ok) {
  console.error(text.slice(0, 500));
  process.exit(1);
}
const data = JSON.parse(text);
console.log("ok jeeh", {
  currentTab: data.currentTab,
  todo: data.list?.todo?.list?.length,
  tobuy: data.list?.tobuy?.list?.length,
  dietDays: Object.keys(data.dietAll || {}).length,
  calendarDays: Object.keys(data.calendarAll || {}).length,
  mindmapNodes: data.mindmap?.nodes?.length,
  notepadChars: data.notepad?.text?.length,
  postItChars: data.postIt?.text?.length,
});
