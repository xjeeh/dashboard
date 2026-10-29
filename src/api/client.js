import axios from "axios";

/**
 * Em dev usamos o proxy do Vite (/api → localhost:3005) para evitar CORS.
 * O json-server continua sendo o que já roda na :3005.
 */
export const API_BASE = import.meta.env.DEV ? "/api" : "http://localhost:3005";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const defaultUserData = (userId) => ({
  id: userId,
  list: {},
  dietAll: {},
  calendarAll: {},
  calendarVisible: false,
  currentTab: 0,
  waterByDay: {},
  waterResetHour: 6,
  notepad: {
    x: "20px",
    y: "20px",
    width: "400px",
    height: "500px",
    isMinimized: false,
    isClosed: false,
    text: "",
  },
  postIt: {
    x: "0px",
    y: "50px",
    width: "300px",
    height: "200px",
    isMinimized: false,
    isClosed: false,
    text: "",
  },
  mindmap: {
    x: "100px",
    y: "100px",
    width: "800px",
    height: "600px",
    isMinimized: false,
    isClosed: false,
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  },
});

function missingCollectionError() {
  const err = new Error(
    'Coleção ausente: adicione "userData": [] no db.json do json-server (:3005) e reinicie o server.',
  );
  err.code = "MISSING_COLLECTION";
  return err;
}

export async function fetchUserData(userId) {
  const { data } = await api.get(`/userData/${userId}`);
  return data;
}

export async function createUserData(userId) {
  const { data } = await api.post(`/userData`, defaultUserData(userId));
  return data;
}

/**
 * Busca o documento do usuário; se não existir o registro, cria.
 * Se a coleção inteira não existir no db.json, avisa claramente.
 */
export async function ensureUserData(userId) {
  // Confirma se a rota /userData existe (coleção no db.json)
  try {
    await api.get("/userData");
  } catch (err) {
    if (err.response?.status === 404) throw missingCollectionError();
    throw err;
  }

  try {
    return await fetchUserData(userId);
  } catch (err) {
    if (err.response?.status === 404) {
      try {
        return await createUserData(userId);
      } catch (createErr) {
        if (createErr.response?.status === 404) throw missingCollectionError();
        throw createErr;
      }
    }
    throw err;
  }
}

export async function patchUserData(userId, partial) {
  const { data } = await api.patch(`/userData/${userId}`, partial);
  return data;
}
