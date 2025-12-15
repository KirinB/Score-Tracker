import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type BiKey = 3 | 6 | 9;

export type Player = {
  id: number;
  name: string;
  score: number;
};

export type PenaltyPoint = {
  key: BiKey;
  value: number;
};

export type PenaltyEvent = {
  bi: BiKey;
  count: number;
};

export type HistoryEntry = {
  id: string;
  currentPlayerId: number;
  loserIds: number[];
  events: PenaltyEvent[];
  totalPoints: number;
  createdAt: number;
};

export type GameState = {
  version: number;
  players: Player[];
  currentPlayerId: number;
  history: HistoryEntry[];
  penaltyPoints: PenaltyPoint[];
};

const STORAGE_KEY = "9bi_game_state_v2";
const CURRENT_VERSION = 1;

const initialState: GameState = {
  version: CURRENT_VERSION,
  players: [],
  currentPlayerId: 0,
  history: [],
  penaltyPoints: [
    { key: 3, value: 1 },
    { key: 6, value: 2 },
    { key: 9, value: 3 },
  ],
};

/** Load state an toàn, tự reset nếu dữ liệu cũ hoặc lỗi */
function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw) as Partial<GameState>;

    // Kiểm tra version
    if (parsed.version !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return initialState;
    }

    return {
      ...initialState,
      ...parsed,
      players: Array.isArray(parsed.players) ? parsed.players : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      penaltyPoints: Array.isArray(parsed.penaltyPoints)
        ? parsed.penaltyPoints
        : initialState.penaltyPoints,
      currentPlayerId:
        typeof parsed.currentPlayerId === "number" ? parsed.currentPlayerId : 0,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
}

function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const gameSlice = createSlice({
  name: "game",
  initialState: loadState(),
  reducers: {
    setPlayers(state, action: PayloadAction<Player[]>) {
      state.players = action.payload.map((p) => ({ ...p, score: 0 }));
      state.currentPlayerId = action.payload[0]?.id ?? 0;
      state.history = [];
      saveState(state);
    },

    setCurrentPlayer(state, action: PayloadAction<number>) {
      state.currentPlayerId = action.payload;
      saveState(state);
    },

    setPenaltyPoints(state, action: PayloadAction<PenaltyPoint[]>) {
      state.penaltyPoints = action.payload;
      saveState(state);
    },

    applyPenalty(
      state,
      action: PayloadAction<{ loserIds: number[]; events: PenaltyEvent[] }>
    ) {
      const { loserIds, events } = action.payload;
      const totalPoints = events.reduce((sum, ev) => {
        const point =
          state.penaltyPoints.find((p) => p.key === ev.bi)?.value ?? 0;
        return sum + point * ev.count;
      }, 0);

      state.players = state.players.map((p) => {
        if (loserIds.includes(p.id))
          return { ...p, score: p.score - totalPoints };
        if (p.id === state.currentPlayerId)
          return { ...p, score: p.score + totalPoints };
        return p;
      });

      // Lịch sử mới nhất lên đầu
      state.history.unshift({
        id: crypto.randomUUID(),
        currentPlayerId: state.currentPlayerId,
        loserIds,
        events,
        totalPoints,
        createdAt: Date.now(),
      });

      saveState(state);
    },

    undo(state) {
      const last = state.history.shift();
      if (!last) return;

      state.players = state.players.map((p) => {
        if (last.loserIds.includes(p.id))
          return { ...p, score: p.score + last.totalPoints };
        if (p.id === last.currentPlayerId)
          return { ...p, score: p.score - last.totalPoints };
        return p;
      });

      saveState(state);
    },

    undoToIndex(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.history.length) return;

      state.players = state.players.map((p) => ({ ...p, score: 0 }));

      const remain = state.history.slice(index + 1).reverse();
      for (const entry of remain) {
        state.players = state.players.map((p) => {
          if (entry.loserIds.includes(p.id))
            return { ...p, score: p.score - entry.totalPoints };
          if (p.id === entry.currentPlayerId)
            return { ...p, score: p.score + entry.totalPoints };
          return p;
        });
      }

      state.history = state.history.slice(index + 1);
      saveState(state);
    },

    resetAll(state) {
      state.players = [];
      state.currentPlayerId = 0;
      state.history = [];
      state.penaltyPoints = [...initialState.penaltyPoints];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  setPlayers,
  setCurrentPlayer,
  setPenaltyPoints,
  applyPenalty,
  undo,
  undoToIndex,
  resetAll,
} = gameSlice.actions;

export default gameSlice.reducer;
