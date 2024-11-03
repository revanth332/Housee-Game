import { useRef } from "react";
import Ticket from "./Ticket";
import { ToastContainer } from "react-toastify";
import { Trophy } from "lucide-react";
import { Housie, User } from "../App";

export default function Board({
  exitMessage,
  emitGameCompleteSignal,
  logout,
  emitJaldi5,
  emitRow1Complete,
  emitRow2Complete,
  emitRow3Complete,
  housie,
  currentUser,
  handleCurrentUser,
}: {
  exitMessage: string;
  emitGameCompleteSignal: () => void;
  logout: () => void;
  emitJaldi5: () => void;
  emitRow1Complete: () => void;
  emitRow2Complete: () => void;
  emitRow3Complete: () => void;
  housie: Housie;
  currentUser: User;
  handleCurrentUser: (user: User) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const closeDialog = () => {
    dialogRef.current?.close();
    logout();
  };

  return (
    <div className="flex flex-col justify-around col-span-full row-start-7 row-end-13 md:col-span-9 md:row-span-11 items-center bg-softColor md:shadow-softShadow md:rounded-2xl rounded-lg">
      <ToastContainer />
      <dialog
        ref={dialogRef}
        className="h-[200px] w-[500px] border-none backdrop:bg-black/35 rounded-xl"
      >
        <div className="w-full h-full flex flex-col justify-evenly items-center">
          <div className="flex flex-col justify-evenly items-center font-bold text-2xl text-green-600">
            <div>{exitMessage}</div>
          </div>
          <div className="text-center">
            <button
              onClick={closeDialog}
              className="bg-blue-950 text-white rounded-xl w-[120px] p-2"
            >
              OK
            </button>
          </div>
        </div>
      </dialog>
      {
        currentUser.info.ticketCount > 0 ? <>
        <div className="overflow-scroll w-full grid lg:grid-cols-2 h-full gap-5 md:p-5 p-1 no-scrollbar">
        {[...new Array(currentUser.info.ticketCount)].map((_, index) => (
          <Ticket
            key={index}
            id={index}
            emitGameCompleteSignal={emitGameCompleteSignal}
            emitJaldi5={emitJaldi5}
            emitRow1Complete={emitRow1Complete}
            emitRow2Complete={emitRow2Complete}
            emitRow3Complete={emitRow3Complete}
            housie={housie}
            currentUser={currentUser}
            handleCurrentUser={handleCurrentUser}
          />
        ))}
      </div>

      <div className="border w-4/5 grid grid-rows-2 grid-cols-2 gap-5 py-3">
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.jaldi5Status?.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Jaldi 5 :{" "}
              {housie.jaldi5Status.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Jaldi 5</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.firstRowStatus?.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> First Row :{" "}
              {housie.firstRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">First Row</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.secondRowStatus?.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Second Row :{" "}
              {housie.secondRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Second Row</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.thirdRowStatus?.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Third Row :{" "}
              {housie.thirdRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Third Row</p>
          )}
        </div>
      </div>
        </> :
        <h1 className="h-full flex items-center text-3xl text-gray-500 font-bold">No Tickets Assigned</h1>
      }

    </div>
  );
}
