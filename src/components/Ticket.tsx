import { useEffect, useState } from "react";
import Tile from "./Tile";
import { generateUniqueRandomNumbers, randomNumberInRange } from "../App";

export type tile = {
  number: number;
  marked: boolean;
};


export default function Ticket() {
    const [indexSet1, setIndexSet1] = useState<number[]>([]);
    const [indexSet2, setIndexSet2] = useState<number[]>([]);
    const [indexSet3, setIndexSet3] = useState<number[]>([]);
    const [tileNumbers,setTileNumbers] = useState<tile []>([]);

    useEffect(() => {
      setIndexSet1(() => {
        const indexes = generateIndexes();
        localStorage.setItem("indexSet1", JSON.stringify(indexes));
        return indexes;
      });
      setIndexSet2(() => {
        const indexes = generateIndexes();
        localStorage.setItem("indexSet2", JSON.stringify(indexes));
        return indexes;
      });
      setIndexSet3(() => {
        const indexes = generateIndexes();
        localStorage.setItem("indexSet3", JSON.stringify(indexes));
        return indexes;
      });

      setTileNumbers(() => {
        const newTiles = generateUniqueRandomNumbers();
        localStorage.setItem("totalTiles", JSON.stringify(newTiles));
        return newTiles;
      });

    }, []);

  
    const makeMark = (num: number) => {
      console.log(num);
      if (num === randomNum || genNums?.includes(num)) {
        setTotalTiles((prev: tile[]) => {
          const newTiles = prev.map((item) =>
            item.number === num ? { ...item, marked: true } : item
          );
          const markedCount = newTiles.reduce(
            (count, tile) => (tile.marked ? count + 1 : count),
            0
          );
          const Row1Count = newTiles
            .slice(0, 9)
            .reduce((count, tile) => (tile.marked ? count + 1 : count), 0);
          const Row2Count = newTiles
            .slice(9, 18)
            .reduce((count, tile) => (tile.marked ? count + 1 : count), 0);
          const Row3Count = newTiles
            .slice(18, 27)
            .reduce((count, tile) => (tile.marked ? count + 1 : count), 0);
  
          setJaldi5(() => {
            const bool = markedCount === 5;
            localStorage.setItem("jaldi5", bool + "");
            return bool;
          });
          setRow1Status(() => {
            const bool = Row1Count === 5;
            localStorage.setItem("row1Status", bool + "");
            return bool;
          });
          setRow2Status(() => {
            const bool = Row2Count === 5;
            localStorage.setItem("row2Status", bool + "");
            return bool;
          });
          setRow3Status(() => {
            const bool = Row3Count === 5;
            localStorage.setItem("row3Status", bool + "");
            return bool;
          });
          setHousee(() => {
            const bool = Row1Count === 5 && Row2Count === 5 && Row3Count === 5;
            localStorage.setItem("housee", bool + "");
            return bool;
          });
          localStorage.setItem("totalTiles", JSON.stringify(newTiles));
          return newTiles;
        });
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
    <div className="flex flex-col">
        <div className="grid grid-cols-9 w-full relative overflow-hidden">
          <div
            className={`absolute z-50 bg-slate-600 w-full h-1 top-1/2 transition ease-in-out ${
              row1Status ? "translate-x-0" : "-translate-x-full"
            }`}
          ></div>
          {totalTiles?.slice(0, 9).map((item, indx) => (
            <Tile
              genNums={genNums}
              key={indx}
              appear={indexSet1?.includes(indx)}
              number={item.number}
              marked={item.marked}
              makeMark={makeMark}
            />
          ))}
        </div>
        <div className="grid grid-cols-9 w-full relative overflow-hidden">
          <div
            className={`absolute z-50 bg-slate-600 w-full h-1 top-1/2 transition ease-in-out ${
              row2Status ? "translate-x-0" : "-translate-x-full"
            }`}
          ></div>
          {totalTiles?.slice(9, 18).map((item, indx) => (
            <Tile
              genNums={genNums}
              key={indx}
              appear={indexSet2?.includes(indx)}
              number={item.number}
              marked={item.marked}
              makeMark={makeMark}
            />
          ))}
        </div>
        <div className="grid grid-cols-9 w-full relative overflow-hidden">
          <div
            className={`absolute z-50 bg-slate-600 w-full h-1 top-1/2 transition ease-in-out ${
              row3Status ? "translate-x-0" : "-translate-x-full"
            }`}
          ></div>
          {totalTiles?.slice(18, 27).map((item, indx) => (
            <Tile
              genNums={genNums}
              key={indx}
              appear={indexSet3?.includes(indx)}
              number={item.number}
              marked={item.marked}
              makeMark={makeMark}
            />
          ))}
        </div>
      </div>
  )
}
