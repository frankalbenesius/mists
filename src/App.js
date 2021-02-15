import { useEffect, useState } from "react";
import shuffle from "lodash/shuffle";

import img0 from "./img/0.png";
import img1 from "./img/1.png";
import img2 from "./img/2.png";
import img3 from "./img/3.png";
import img4 from "./img/4.png";
import img5 from "./img/5.png";
import img6 from "./img/6.png";
import img7 from "./img/7.png";

const SYMBOLS = [
  {
    id: 0,
    img: img0,
    is: {
      circled: true,
      flower: false,
      filled: false,
    },
  },
  {
    id: 1,
    img: img1,
    is: {
      circled: true,
      flower: true,
      filled: false,
    },
  },
  {
    id: 2,
    img: img2,
    is: {
      circled: true,
      flower: true,
      filled: true,
    },
  },
  {
    id: 3,
    img: img3,
    is: {
      circled: false,
      flower: true,
      filled: true,
    },
  },
  {
    id: 4,
    img: img4,
    is: {
      circled: false,
      flower: true,
      filled: false,
    },
  },
  {
    id: 5,
    img: img5,
    is: {
      circled: false,
      flower: false,
      filled: false,
    },
  },
  {
    id: 6,
    img: img6,
    is: {
      circled: false,
      flower: false,
      filled: true,
    },
  },
  {
    id: 7,
    img: img7,
    is: {
      circled: true,
      flower: false,
      filled: true,
    },
  },
];
const POSITIONS = ["top", "right", "bottom", "left"];

function generatePuzzle() {
  const [puzzleProperty, ...otherProperties] = shuffle([
    "circled",
    "flower",
    "filled",
  ]);
  const puzzlePropertyValue = Math.random() < 0.5;
  const fourCorrectSymbols = SYMBOLS.filter(
    (symbol) => symbol.is[puzzleProperty] === puzzlePropertyValue
  );
  const [correctSymbol] = shuffle([...fourCorrectSymbols]);

  const incorrectSymbols = SYMBOLS.filter(
    (symbol) =>
      symbol.is[puzzleProperty] === !puzzlePropertyValue &&
      (symbol.is[otherProperties[0]] !== correctSymbol.is[otherProperties[0]] ||
        symbol.is[otherProperties[1]] !== correctSymbol.is[otherProperties[1]])
  );
  const threeIncorrectSymbols = shuffle(incorrectSymbols).slice(0, 3);

  const [correctPosition] = shuffle(["top", "right", "left"]);
  const incorrectPositions = POSITIONS.filter((x) => x !== correctPosition);

  let puzzle = {
    correctPosition,
    [correctPosition]: { ...correctSymbol },
  };

  incorrectPositions.forEach((incorrectPosition, index) => {
    puzzle[incorrectPosition] = {
      ...threeIncorrectSymbols[index],
    };
  });

  return puzzle;
}
const firstPuzzle = generatePuzzle();

function App() {
  const [state, setState] = useState({
    score: 0,
    game: 0,
    ...firstPuzzle,
  });

  const handleClick = (position) => () => {
    const nextPuzzle = generatePuzzle();
    setState((s) => {
      const score = position === s.correctPosition ? s.score + 1 : 0;
      return {
        game: s.game + 1,
        score,
        ...nextPuzzle,
      };
    });
  };

  return (
    <div className="App">
      <div className="QuizContainer">
        {POSITIONS.map((position) => {
          const symbol = state[position];
          return (
            <Symbol
              key={symbol.id + position}
              game={state.game}
              position={position}
              symbol={symbol}
              onClick={handleClick(position)}
              debug={false}
            />
          );
        })}
        <div className="Score">{state.score}</div>
      </div>
    </div>
  );
}

export default App;

function Symbol({ game, position, symbol, onClick, debug = false }) {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (position === "top") {
      console.log("triggered", game, new Date());
    }
    setHidden(true);
    const ms = position === "bottom" ? 250 : Math.random() * 1800 + 400;
    const to = setTimeout(() => {
      setHidden(false);
    }, ms);
    return () => clearTimeout(to);
  }, [game]);

  let classes = ["Symbol", position];
  if (hidden) {
    classes = [...classes, "hidden"];
  }

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      <img src={symbol.img} alt={symbol.ID} />
      {debug && (
        <div className="Debug">
          <div>
            {position} &mdash; {symbol.id}
          </div>
          <div>circled: {JSON.stringify(symbol.is.circled)}</div>
          <div>flower: {JSON.stringify(symbol.is.flower)}</div>
          <div>filled: {JSON.stringify(symbol.is.filled)}</div>
        </div>
      )}
    </div>
  );
}
