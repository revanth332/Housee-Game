import { useState } from "react";
import Tile from "./Tile";
import { randomNumberInRange } from "../App";

export default function Ticket() {
    const [indexSet1, setIndexSet1] = useState<number[]>([]);
    const [indexSet2, setIndexSet2] = useState<number[]>([]);
    const [indexSet3, setIndexSet3] = useState<number[]>([]);

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
