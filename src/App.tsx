import { useSelector } from "react-redux";
import type { RootState } from "./stores";
import PlayerForm from "./components/PlayerForm";
import ScoreBoard from "./components/ScoreBoard";

const App = () => {
  const players = useSelector((state: RootState) => state.game.players);

  if (!players || players.length === 0) return <PlayerForm />;

  return <ScoreBoard />;
};

export default App;
