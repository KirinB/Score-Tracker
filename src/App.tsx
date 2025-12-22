import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import type { RootState } from "./stores";

import PlayerForm from "./components/PlayerForm";
import ScoreBoard from "./components/ScoreBoard";
import Setting from "./pages/Setting";
import { resetAll } from "./stores/slices/game.slice";
import Contact from "./pages/Contact";

const App = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const [invalidState, setInvalidState] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (
      !gameState ||
      !Array.isArray(gameState.players) ||
      !Array.isArray(gameState.history) ||
      typeof gameState.currentPlayerId !== "number"
    ) {
      localStorage.removeItem("9bi_game_state");
      dispatch(resetAll());
      setInvalidState(true);
    }
  }, [dispatch, gameState]);

  if (invalidState) {
    return (
      <div className="p-4 text-center">
        <p>Dữ liệu cũ không tương thích.</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          !gameState.players || gameState.players.length === 0 ? (
            <PlayerForm />
          ) : (
            <ScoreBoard />
          )
        }
      />

      {/* Setting */}
      <Route path="/settings" element={<Setting />} />
      <Route path="/contact" element={<Contact />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
