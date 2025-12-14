import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Types
export type Player = {
  id: number;
  name: string;
  score: number;
};

export type PenaltyPoint = {
  key: number; // bi 3,6,9
  value: number; // số điểm
};

export type HistoryEntry = {
  currentPlayerId: number; // người được điểm
  loserIds: number[]; // người mất điểm
  penaltyKeys: number[]; // bi 3,6,9
  totalPoints: number; // tổng điểm được / mất
};

export type GameState = {
  players: Player[];
  currentPlayerId: number;
  history: HistoryEntry[];
  round: number;
  penaltyPoints: PenaltyPoint[];
};

// LocalStorage key
const STORAGE_KEY = "9bi_game_state";

// Initial state mặc định
const initialState: GameState = {
  players: [],
  currentPlayerId: 0,
  history: [],
  round: 1,
  penaltyPoints: [
    { key: 3, value: 1 },
    { key: 6, value: 2 },
    { key: 9, value: 3 },
  ],
};

// Load state từ localStorage, validate
function loadState(): GameState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState;

  try {
    const parsed = JSON.parse(raw) as Partial<GameState>;
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
      round: typeof parsed.round === "number" ? parsed.round : 1,
    };
  } catch {
    console.warn("Invalid game state in localStorage, resetting...");
    localStorage.removeItem(STORAGE_KEY);
    return initialState;
  }
}

// Save state vào localStorage
function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Slice
const gameSlice = createSlice({
  name: "game",
  initialState: loadState(),
  reducers: {
    setPlayers(state, action: PayloadAction<Player[]>) {
      state.players = action.payload;
      state.currentPlayerId = action.payload[0]?.id || 0;
      state.history = [];
      state.round = 1;
      saveState(state);
    },
    setPenaltyPoints(state, action: PayloadAction<PenaltyPoint[]>) {
      state.penaltyPoints = action.payload;
      saveState(state);
    },
    nextRound(state) {
      state.players = state.players.map((p) => ({ ...p, score: 0 }));
      state.currentPlayerId = state.players[0]?.id || 0;
      state.history = [];
      state.round += 1;
      saveState(state);
    },
    setCurrentPlayer(state, action: PayloadAction<number>) {
      state.currentPlayerId = action.payload;
      saveState(state);
    },
    applyPenalty(
      state,
      action: PayloadAction<{ loserIds: number[]; penaltyKeys: number[] }>
    ) {
      const { loserIds, penaltyKeys } = action.payload;
      const totalPenalty = penaltyKeys.reduce((sum, key) => {
        const p = state.penaltyPoints.find((pp) => pp.key === key);
        return p ? sum + p.value : sum;
      }, 0);

      state.players = state.players.map((p) => {
        if (loserIds.includes(p.id))
          return { ...p, score: p.score - totalPenalty };
        if (p.id === state.currentPlayerId)
          return { ...p, score: p.score + totalPenalty };
        return p;
      });

      state.history.push({
        currentPlayerId: state.currentPlayerId,
        loserIds,
        penaltyKeys,
        totalPoints: totalPenalty,
      });

      saveState(state);
    },
    undo(state) {
      const last = state.history.pop();
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

      for (let i = 0; i < index; i++) {
        const entry = state.history[i];
        state.players = state.players.map((p) => {
          if (entry.loserIds.includes(p.id))
            return { ...p, score: p.score - entry.totalPoints };
          if (p.id === entry.currentPlayerId)
            return { ...p, score: p.score + entry.totalPoints };
          return p;
        });
      }

      state.history = state.history.slice(0, index);
      saveState(state);
    },
    resetGame(state) {
      state.players = state.players.map((p) => ({ ...p, score: 0 }));
      state.currentPlayerId = state.players[0]?.id || 0;
      state.history = [];
      saveState(state);
    },
    resetAll(state) {
      state.players = [];
      state.currentPlayerId = 0;
      state.history = [];
      state.round = 1;
      state.penaltyPoints = [...initialState.penaltyPoints];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const {
  setPlayers,
  setPenaltyPoints,
  nextRound,
  setCurrentPlayer,
  applyPenalty,
  undo,
  undoToIndex,
  resetGame,
  resetAll,
} = gameSlice.actions;

export default gameSlice.reducer;
