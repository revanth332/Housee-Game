import Tile from "./Tile";
import {
  Housie,
  User,
} from "../App";

export default function Ticket({
  id,
  emitGameCompleteSignal,
  emitJaldi5,
  emitRow1Complete,
  emitRow2Complete,
  emitRow3Complete,
  housie,
  currentUser,
  handleCurrentUser,
}: {
  id: number;
  emitGameCompleteSignal: () => void;
  emitJaldi5: () => void;
  emitRow1Complete: () => void;
  emitRow2Complete: () => void;
  emitRow3Complete: () => void;
  housie: Housie;
  currentUser: User;
  handleCurrentUser: (user: User) => void;
}) {

  const makeMark = (num: number) => {
    console.log(num);
    if (
      num === housie.currentRandomValue ||
      housie.generatedRandomNumbers?.includes(num) || true
    ) {
      const newTiles = currentUser.tickets[id].numberTiles.map((item) =>
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
      console.log(totalMarkedCount,row1MarkedCount,row2MarkedCount,row3MarkedCount)
      const newCurrentUser = {...currentUser,tickets:currentUser.tickets.map(ticket => ticket.ticketId === id ? {...ticket,numberTiles : newTiles} : ticket)}
      localStorage.setItem("currentUser",JSON.stringify(newCurrentUser));
      handleCurrentUser(newCurrentUser);
    }
  };


  return (
    <div className="flex flex-col shadow-softShadow p-2 rounded-xl justify-center">
      {[...new Array(3)].map((_, indx) => (
        <div
          key={indx}
          className="grid grid-cols-9 w-full relative overflow-hidden"
        >
          <div
            className={`absolute z-50 bg-slate-600 w-full h-1 top-1/2 transition ease-in-out ${
              currentUser.tickets[id]?.isRow1Completed
                ? "translate-x-0"
                : "-translate-x-full"
            }`}
          ></div>
          {currentUser.tickets[id]?.numberTiles
            .slice(indx * 9 + 0, indx * 9 + 9)
            .map((item, index) => (
              <Tile
                key={index}
                index={index}
                numberTile={item}
                makeMark={makeMark}
                skippingIndexes={currentUser.tickets[id].skippingIndexes[indx]}
                genNumbers={housie.generatedRandomNumbers}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
