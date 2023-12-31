import React, { createContext, useContext } from 'react';

const AppContext = createContext();

export function useAppContext() {
	return useContext(AppContext);
}

export function AppProvider({ children }) {
	const [score, setScore] = React.useState(0);
	const [name, setName] = React.useState('');
	const [gameState, setGameState] = React.useState('paused'); // paused, started, finished
	const [isShowBoard, setShowBoard] = React.useState(false);

	return (
		<AppContext.Provider
			value={{
				score,
				setScore,
				name,
				setName,
				isShowBoard,
				setShowBoard,
				gameState,
				setGameState,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}
