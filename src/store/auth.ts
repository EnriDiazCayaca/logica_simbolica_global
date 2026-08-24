import { computed, reactive } from 'vue';
import { setActiveProgressUser } from './progress';

// Store de autenticación simple basado en localStorage.
// No existe backend todavía, así que "registro" e "inicio de sesión" se
// simulan por completo en el navegador: los usuarios se guardan en
// localStorage y las contraseñas se derivan con SHA-256 (Web Crypto API,
// disponible de forma nativa en el navegador) junto con una sal aleatoria
// por usuario. Esto NO reemplaza una autenticación real de servidor, pero
// evita guardar contraseñas en texto plano mientras no exista backend.

const USERS_KEY = 'logilearn:users';
const SESSION_KEY = 'logilearn:session';

interface StoredUser {
  username: string;
  salt: string;
  passwordHash: string;
}

interface AuthState {
  username: string | null;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignorar errores de almacenamiento (modo privado, cuota excedida, etc.)
  }
}

function loadSession(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function saveSession(username: string | null) {
  try {
    if (username) localStorage.setItem(SESSION_KEY, username);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignorar
  }
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

const state = reactive<AuthState>({ username: loadSession() });

// Sincroniza el store de progreso con el usuario activo al cargar la app.
setActiveProgressUser(state.username);

export const isAuthenticated = computed(() => state.username !== null);
export const currentUsername = computed(() => state.username);

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function register(username: string, password: string): Promise<AuthResult> {
  const cleanUsername = username.trim();
  if (cleanUsername.length < 3) {
    return { success: false, error: 'El usuario debe tener al menos 3 caracteres.' };
  }
  if (password.length < 4) {
    return { success: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  const users = loadUsers();
  if (users.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
    return { success: false, error: 'Ese usuario ya existe. Intenta iniciar sesión.' };
  }

  const salt = randomSalt();
  const passwordHash = await hashPassword(password, salt);
  users.push({ username: cleanUsername, salt, passwordHash });
  saveUsers(users);

  state.username = cleanUsername;
  saveSession(cleanUsername);
  setActiveProgressUser(cleanUsername);

  return { success: true };
}

export async function login(username: string, password: string): Promise<AuthResult> {
  const cleanUsername = username.trim();
  if (!cleanUsername || !password) {
    return { success: false, error: 'Ingresa tu usuario y contraseña.' };
  }

  const users = loadUsers();
  const user = users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (!user) {
    return { success: false, error: 'No existe una cuenta con ese usuario.' };
  }

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  state.username = user.username;
  saveSession(user.username);
  setActiveProgressUser(user.username);

  return { success: true };
}

export function logout() {
  state.username = null;
  saveSession(null);
  setActiveProgressUser(null);
}
