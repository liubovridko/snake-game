import * as React from 'react';
import { styled } from '@mui/material/styles';
import axios from '../../axios.js';
import { useAppContext } from '../../AppContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { amber } from '@mui/material/colors';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Demo = styled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
}));

export const ListOfLeaders = () => {
	const [dense, setDense] = React.useState(false);
	const [secondary, setSecondary] = React.useState(false);
	const [listLeaders, setListLeaders] = React.useState([]);
	const { gameState } = useAppContext();

	React.useEffect(() => {
		fetchLeaders();
	}, [gameState]);

	const fetchLeaders = async () => {
		try {
			const { data } = await axios.get('/gamers');
			setListLeaders(data);
		} catch (err) {
			console.warn(err);
		}
	};

	return (
		<Grid item xs={12} md={6}>
			<Typography sx={{ mt: 2, mb: 2 }} align="center" variant="h6" component="div">
				List leaders
			</Typography>
			<Demo>
				<List dense={dense}>
					{listLeaders.map((obj) => (
						<ListItem
							secondaryAction={<ListItemText primary={obj.score} />}
							key={obj.name}
						>
							<ListItemIcon>
								<EmojiEventsIcon sx={{ color: amber[500] }} />
							</ListItemIcon>
							<ListItemText
								primary={obj.name}
								secondary={secondary ? 'Secondary text' : null}
							/>
						</ListItem>
					))}
				</List>
			</Demo>
		</Grid>
	);
};
