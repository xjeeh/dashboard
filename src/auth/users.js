/**
 * Usuários e senhas hardcoded (cadeado por símbolos tattoo).
 * A senha é a sequência de ids dos símbolos.
 */
export const TATTOO_SYMBOLS = [
  { id: "heart", label: "Coração" },
  { id: "bolt", label: "Raio" },
  { id: "dagger", label: "Adaga" },
  { id: "skull", label: "Caveira" },
  { id: "rose", label: "Rosa" },
  { id: "snake", label: "Cobra" },
  { id: "star", label: "Estrela" },
  { id: "eye", label: "Olho" },
];

export const USERS = [
  {
    id: "jeeh",
    name: "Jeeh",
    // coração → raio → adaga
    password: ["heart", "bolt", "dagger"],
  },
  {
    id: "gih",
    name: "Gih",
    // rosa → caveira → estrela
    password: ["rose", "skull", "star"],
  },
];

export const AUTH_STORAGE_KEY = "dashboard-auth-user";

export function findUser(userId) {
  return USERS.find((u) => u.id === userId) || null;
}

export function verifyPassword(userId, sequence) {
  const user = findUser(userId);
  if (!user) return false;
  if (sequence.length !== user.password.length) return false;
  return user.password.every((sym, i) => sym === sequence[i]);
}
