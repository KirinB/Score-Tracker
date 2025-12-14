import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./stores";
import PlayerForm from "./components/PlayerForm";
import ScoreBoard from "./components/ScoreBoard";
import { useEffect, useState } from "react";
import { resetAll } from "./stores/slices/game.slice";

const App = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const [invalidState, setInvalidState] = useState(false);

  useEffect(() => {
    // Kiểm tra các key quan trọng
    if (
      !gameState ||
      !Array.isArray(gameState.players) ||
      !Array.isArray(gameState.history) ||
      typeof gameState.currentPlayerId !== "number"
    ) {
      // Nếu dữ liệu cũ bị lỗi, reset localStorage
      localStorage.removeItem("9bi_game_state");
      dispatch(resetAll());
      setInvalidState(true);
    }
  }, [dispatch, gameState]);

  if (invalidState) {
    return (
      <div className="p-4 text-center">
        <p>Dữ liệu cũ bị hỏng hoặc ứng dụng đã được cập nhật.</p>
        <p>Vui lòng reload trang để bắt đầu lại.</p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  if (!gameState.players || gameState.players.length === 0)
    return <PlayerForm />;

  return <ScoreBoard />;
};

export default App;
