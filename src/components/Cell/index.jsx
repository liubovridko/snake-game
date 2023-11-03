import React from "react";

import styles from "./Cell.style.scss";

export const Cell = ({ head, body, tail, x, y, pellet }) => {
  const xPellet = pellet.position.x;
  const yPellet = pellet.position.y;
  let pelletClass = "";

  if (pellet) {
    switch (pellet.type) {
      case "small":
        pelletClass = "cell";
        break;
      case "medium":
        pelletClass = "cell-medium";
        break;
      case "large":
        pelletClass = "cell-large";
        break;
      default:
        pelletClass = "cell";
    }
  }
  if (x === head.x && y === head.y) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__head" />
      </div>
    );
  }
  if (body.some((b) => b.x === x && b.y === y)) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__body" />
      </div>
    );
  }
  if (x === tail.x && y === tail.y) {
    return (
      <div className="cell">
        <span className="cell--inner cell--inner__tail" />
      </div>
    );
  }
  if (x === xPellet && y === yPellet) {
    return (
      <div className={pelletClass}>
        <span className="cell--inner cell--inner__pellet" />
      </div>
    );
  }
  return <div className="cell" />;
};
