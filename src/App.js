import React from "react";

import { useAppContext } from "./AppContext";

import { StartBlock } from "./components/StartBlock/";
import { GameBoard } from "./components/GameBoard/";

function App() {
	const { isShowBoard } = useAppContext();
	return <>{isShowBoard ? <GameBoard /> : <StartBlock />}</>;
}

export default App;
