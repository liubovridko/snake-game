import React from 'react';
import axios from '../../axios.js';

import useKeyPress from '../../hooks/useKeyPress';
import useInterval from '../../hooks/useInterval';
import { Header } from '../../components/Header/';
import { ListOfLeaders } from './ListOfLeaders.jsx';
import { ControlButton } from './ControlButton.jsx';
import { Cell } from '../Cell/';
import styles from './GameBoard.module.scss';

import { useAppContext } from '../../AppContext';

export const GameBoard = () => {
  const [cellCount] = React.useState(20);
  const [duration, setDuration] = React.useState(250);
  const [speedLevel, setSpeedLevel] = React.useState(1);

  const [head, setHead] = React.useState({ x: 1, y: 10 });
  const [body, setBody] = React.useState([
    { x: 1, y: 11 },
    { x: 1, y: 12 },
  ]);

  const [tail, setTail] = React.useState({ x: 1, y: 13 });
  //const [pellet, setPellet] = React.useState({ x: 3, y: 5 });

  const [activePellet, setActivePellet] = React.useState({
    type: 'small',
    points: 1,
    position: { x: 5, y: 5 },
  });
  const [totalPelletPoints, setTotalPelletPoints] = React.useState(0);
  const [direction, setDirection] = React.useState('up');
  const [pelletEaten, setPelletEaten] = React.useState(false);

  const [changeDirection, setChangeDirection] = React.useState(false);
  const { name, score, setScore, gameState, setGameState } = useAppContext();

  const keyPressed = useKeyPress(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

  const moveBodyAndTail = () => {
    if (!pelletEaten) {
      setTail(body[body.length - 1]);
    } else {
      setPelletEaten(false);
    }
    const nBody = pelletEaten ? body : body.filter((x, y) => y !== body.length - 1);
    setBody([head, ...nBody]);
    setChangeDirection(false);
  };

  const cellIsInSnake = ({ x, y }) => {
    if (
      body.some((c) => c.x === x && c.y === y) ||
      (head.x === x && head.y === y) ||
      (tail.x === x && tail.y === x)
    )
      return true;
    return false;
  };

  const getRandomCell = () => {
    let x;
    let y;

    do {
      x = Math.floor(Math.random() * (cellCount - 1 - 0 + 1) + 0);
      y = Math.floor(Math.random() * (cellCount - 1 - 0 + 1) + 0);
    } while (cellIsInSnake({ x, y }));
    return {
      x,
      y,
    };
  };

  const checkAndSetHead = (h) => {
    if (body.some((b) => b.x === h.x && b.y === h.y) || (h.x === tail.x && h.y === tail.y)) {
      setGameState('finished');
      setSpeedLevel(1);
    } else if (h.x === activePellet.position.x && h.y === activePellet.position.y) {
      setPelletEaten(true);
      setScore(score + activePellet.points);

      const newTotalPelletPoints = totalPelletPoints + activePellet.points;

      if (newTotalPelletPoints >= 50) {
        setSpeedLevel(speedLevel + 1);
        setTotalPelletPoints(0); // Reset the total pellet points
      } else {
        setTotalPelletPoints(newTotalPelletPoints);
      }

      // Randomly select a new type of pellet
      const randomPelletType = getRandomPelletType();
      setActivePellet({
        type: randomPelletType.type,
        points: randomPelletType.points,
        position: getRandomCell(),
      });
    }

    setHead(h);
  };

  const getRandomPelletType = () => {
    // You can define the types and their respective points here
    const pelletTypes = [
      { type: 'small', points: 1 },
      { type: 'medium', points: 5 },
      { type: 'large', points: 10 },
    ];

    // Randomly select a pellet type
    const randomIndex = Math.floor(Math.random() * pelletTypes.length);
    return pelletTypes[randomIndex];
  };

  const moveSnake = () => {
    switch (direction) {
      case 'up':
        if (head.y === 0) {
          checkAndSetHead({ ...head, y: cellCount - 1 });
        } else {
          checkAndSetHead({ ...head, y: head.y - 1 });
        }
        break;
      case 'down':
        if (head.y === cellCount - 1) {
          checkAndSetHead({ ...head, y: 0 });
        } else {
          checkAndSetHead({ ...head, y: head.y + 1 });
        }
        break;
      case 'right':
        if (head.x === cellCount - 1) {
          checkAndSetHead({ ...head, x: 0 });
        } else {
          checkAndSetHead({ ...head, x: head.x + 1 });
        }
        break;
      case 'left':
        if (head.x === 0) {
          checkAndSetHead({ ...head, x: cellCount - 1 });
        } else {
          checkAndSetHead({ ...head, x: head.x - 1 });
        }
        break;
      default:
        break;
    }
    moveBodyAndTail();
  };

  const handleKeyDown = (key) => {
    if (!changeDirection) {
      setChangeDirection(true);
      switch (key) {
        case 'ArrowUp':
          if (direction !== 'down') {
            setDirection('up');
          }
          break;
        case 'ArrowDown':
          if (direction !== 'up') {
            setDirection('down');
          }
          break;
        case 'ArrowRight':
          if (direction !== 'left') {
            setDirection('right');
          }
          break;
        case 'ArrowLeft':
          if (direction !== 'right') {
            setDirection('left');
          }
          break;
        default:
          break;
      }
    }
  };

  const updateUserData = async () => {
    try {
      const { data } = await axios.put('/update', { name, score });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleGameStateSwitch = () => {
    if (gameState === 'started') {
      setGameState('paused');
    } else if (gameState === 'finished') {
      setHead({ x: 1, y: 10 });
      setBody([
        { x: 1, y: 11 },
        { x: 1, y: 12 },
      ]);
      setTail({ x: 1, y: 13 });
      setDirection('up');
      setGameState('started');
      updateUserData();
    } else {
      setGameState('started');
    }
  };

  React.useEffect(() => {
    if (keyPressed) {
      handleKeyDown(keyPressed);
    }
  }, [keyPressed]);

  useInterval(
    () => {
      moveSnake();
    },
    gameState === 'started' ? duration / speedLevel : null,
  );

  useInterval(
    () => {
      setActivePellet({
        type: 'small',
        points: 1,
        position: getRandomCell(),
      });
    },
    gameState === 'started' ? duration * cellCount * 2 : null,
    pelletEaten,
  );

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.board}>
          {[...Array(cellCount).keys()].map((y) => (
            <div className={styles.row} id={y} key={y}>
              {[...Array(cellCount).keys()].map((x) => (
                <Cell
                  head={head}
                  body={body}
                  tail={tail}
                  x={x}
                  y={y}
                  key={`${x}-${y}`}
                  pellet={activePellet}
                />
              ))}
            </div>
          ))}
        </div>

        <ControlButton
          score={score}
          gameState={gameState}
          handleGameStateSwitch={handleGameStateSwitch}
        />
        <ListOfLeaders />
      </div>
    </>
  );
};
