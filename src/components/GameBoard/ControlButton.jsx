import Button from '@mui/material/Button';
import styles from './GameBoard.module.scss';
import { useAppContext } from '../../AppContext';

export const ControlButton = ({ handleGameStateSwitch, score }) => {
	const { gameState } = useAppContext();
	return (
		<div className={styles.startBtn}>
			{gameState !== 'finished' ? (
				<Button
					variant="contained"
					color="success"
					type="button"
					onClick={() => {
						handleGameStateSwitch();
					}}
				>
					{gameState === 'started' ? 'pause' : 'start'}
				</Button>
			) : (
				<>
					<Button
						variant="contained"
						color="success"
						type="button"
						onClick={() => {
							handleGameStateSwitch();
						}}
					>
						restart
					</Button>
					<h2>Game Over!!!</h2>
					<p>Your score:{score}</p>
				</>
			)}
		</div>
	);
};
