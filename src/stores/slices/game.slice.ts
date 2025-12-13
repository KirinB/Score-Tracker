import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Types
export type Player = {
  id: number;
  name: string;
  score: number;
};

export type GameSnapshot = {
  players: Player[];
  currentPlayerId: number;
};

export type PenaltyPoint = {
  key: number; // bi 3,6,9
  value: number; // số điểm
};

export type GameState = {
  players: Player[];
  currentPlayerId: number;
  history: GameSnapshot[];
  round: number;
  penaltyPoints: PenaltyPoint[];
};

// LocalStorage keys
const STORAGE_KEY = "9bi_game_state";

// Load state từ localStorage
function loadState(): GameState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Save state vào localStorage
function saveState(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Initial State
const initialState: GameState = loadState() || {
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

// Slice
const gameSlice = createSlice({
  name: "game",
  initialState,
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

      // push current state vào history để undo
      state.history.push({
        players: state.players.map((p) => ({ ...p })),
        currentPlayerId: state.currentPlayerId,
      });

      const totalPenalty = penaltyKeys.reduce((sum, key) => {
        const p = state.penaltyPoints.find((pp) => pp.key === key);
        return p ? sum + p.value : sum;
      }, 0);

      state.players = state.players.map((p) => {
        if (loserIds.includes(p.id)) {
          return { ...p, score: p.score - totalPenalty };
        }
        if (p.id === state.currentPlayerId) {
          return { ...p, score: p.score + totalPenalty };
        }
        return p;
      });

      saveState(state);
    },
    undo(state) {
      const last = state.history.pop();
      if (last) {
        state.players = last.players;
        state.currentPlayerId = last.currentPlayerId;
      }
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
      state.penaltyPoints = [
        { key: 3, value: 1 },
        { key: 6, value: 2 },
        { key: 9, value: 3 },
      ];
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
  resetGame,
  resetAll,
} = gameSlice.actions;

export default gameSlice.reducer;
