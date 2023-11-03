import React from "react";
import styles from "./Header.module.scss";
import Container from "@mui/material/Container";
import { useAppContext } from "../../AppContext";

export const Header = () => {
	const { score, name } = useAppContext();
	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<h1>Snake Game</h1>
					<div>Score: {score}</div>
					<div>Gamer :{name}</div>
				</div>
			</Container>
		</div>
	);
};
