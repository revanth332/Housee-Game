import { useEffect } from "react";
import Tile from "./Tile";
import {
  generateUniqueRandomNumbers,
  Housie,
  NumberTile,
  randomNumberInRange,
} from "../App";

export default function Ticket({
  id,
  emitGameCompleteSignal,
  emitJaldi5,
  emitRow1Complete,
  emitRow2Complete,
  emitRow3Complete,
  housie,
  handleHousie,
}: {
  id: number;
  emitGameCompleteSignal: () => void;
  emitJaldi5: () => void;
  emitRow1Complete: () => void;
  emitRow2Complete: () => void;
  emitRow3Complete: () => void;
  housie: Housie;
  handleHousie: (newHousie: Housie) => void;
}) {
  useEffect(() => {
    const skippingIndexesRow1: number[] = generateIndexes();
    const skippingIndexesRow2: number[] = generateIndexes();
    const skippingIndexesRow3: number[] = generateIndexes();
    const newTiles: NumberTile[] = generateUniqueRandomNumbers();
    const newHousie: Housie = {
      ...housie,
      tickets: [
        ...housie.tickets,
        {
          ticketId: id,
          skippingIndexesRow1,
          skippingIndexesRow2,
          skippingIndexesRow3,
          isRow1Completed: false,
          isRow2Completed: false,
          isRow3Completed: false,
          numberTiles: newTiles,
        },
      ],
    };
    handleHousie(newHousie);
    localStorage.setItem("housie", JSON.stringify(newHousie));
  }, []);

  const makeMark = (num: number) => {
    console.log(num);
    if (
      num === housie.currentRandomValue ||
      housie.generatedRandomNumbers?.includes(num)
    ) {
      const newTiles = housie.tickets[id].numberTiles.map((item) =>
        item.number === num ? { ...item, isMarked: true } : item
      );

      const totalMarkedCount = newTiles.reduce(
        (count, tile) => (tile.isMarked ? count + 1 : count),
        0
      );

      const row1MarkedCount = newTiles
        .slice(0, 9)
        .reduce((count, tile) => (tile.isMarked ? count + 1 : count), 0);

      const row2MarkedCount = newTiles
        .slice(9, 18)
        .reduce((count, tile) => (tile.isMarked ? count + 1 : count), 0);
      const row3MarkedCount = newTiles
        .slice(18, 27)
        .reduce((count, tile) => (tile.isMarked ? count + 1 : count), 0);

      if (totalMarkedCount === 5) {
        emitJaldi5();
      }

      if (row1MarkedCount === 5) {
        emitRow1Complete();
      }

      if (row2MarkedCount === 5) {
        emitRow2Complete();
      }

      if (row3MarkedCount === 5) {
        emitRow3Complete();
      }

      if (
        row1MarkedCount === 5 &&
        row2MarkedCount === 5 &&
        row3MarkedCount === 5
      ) {
        emitGameCompleteSignal();
      }
    }
  };

  const generateIndexes = () => {
    const newNumbers: number[] = [];
    while (newNumbers.length < 5) {
      const randomNumber = randomNumberInRange(0, 8);
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    return newNumbers;
  };

  return (
    <div className="flex flex-col shadow-softShadow p-3 rounded-xl">
      {
        [...new Array(3)].map((_,indx) => (
          <div key={indx} className="grid grid-cols-9 w-full relative overflow-hidden">
          <div
            className={`absolute z-50 bg-slate-600 w-full h-1 top-1/2 transition ease-in-out ${
              housie.tickets[id]?.isRow1Completed
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          ></div>
          {housie.tickets[id]?.numberTiles.slice((indx*9) + 0, (indx*9)+9).map((item, indx) => (
            <Tile
              key={indx}
              index={indx}
              numberTile={item}
              makeMark={makeMark}
              ticketDetails={housie.tickets[id]}
              genNumbers={housie.generatedRandomNumbers}
            />
          ))}
        </div>
        ))
      }

    </div>
  );
}
