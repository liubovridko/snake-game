import React from "react";
import Button from "@mui/material/Button";
import axios from "../../axios.js";
import styles from "./StartBlock.module.scss";

import image from "../../image/background.webp";

import { useAppContext } from "../../AppContext";
import useInterval from "../../hooks/useInterval.js";

export const StartBlock = ({ isShowBoard }) => {
  const { score, name, setName, setShowBoard } = useAppContext();
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrorMessage("");
  };

  const onNameSubmit = async () => {
    try {
      const { data } = await axios.post("/gamer", { name, score });

      setShowBoard(true);
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.message === "Name already in use"
      ) {
        setErrorMessage("Name already in use. Please choose a different name.");
      } else {
        console.warn(err);
      }
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.name_input}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={handleNameChange}
        />

        <Button onClick={onNameSubmit} variant="contained">
          Start Game
        </Button>
        {errorMessage && (
          <div className={styles.error_message}>{errorMessage}</div>
        )}
      </div>
    </div>
  );
};
