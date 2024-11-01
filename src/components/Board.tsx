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
  handleHousie,
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
  handleHousie: (newHousie: Housie) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // useEffect(() => {
  //   if (jaldi5){
  //     if(localStorage.getItem("jaldi5Finished") === null) emitJaldi5();
  //     toast("Jaldi 5 !!!");
  //   }
  // }, [jaldi5]);

  // useEffect(() => {
  //   // console.log("row1",row1Status)
  //   if (row1Status){
  //     if(localStorage.getItem("row1Finished")  === null) emitRow1Complete();
  //     toast("First Row completed!!!");
  //   }
  // }, [row1Status]);

  // useEffect(() => {
  //   // console.log("row2",row2Status)
  //   if (row2Status){
  //     if(localStorage.getItem("row2Finished") === null) emitRow2Complete();
  //     toast("Second Row completed !!!");
  //   }
  // }, [row2Status]);

  // useEffect(() => {
  //   // console.log("row3",row3Status)
  //   if (row3Status){
  //     if(localStorage.getItem("row3Finished") === null) emitRow3Complete()
  //     toast("Third Row completed !!!");
  //   }
  // }, [row3Status]);

  // useEffect(() => {
  //   // console.log("row1",row1Status)
  //   if (housee) {
  //     dialogRef.current?.showModal();
  //     emitGameCompleteSignal();
  //   }
  // }, [housee]);

  // useEffect(() => {
  //   // For remaining users
  //   if (exitMessage.includes("has")) {
  //     dialogRef.current?.showModal();
  //   }
  // },[exitMessage])

  const closeDialog = () => {
    dialogRef.current?.close();
    logout();
  };

  return (
    <div className="flex flex-col justify-around col-span-full row-start-7 row-end-13 md:col-span-9 md:row-span-11 items-center bg-softColor shadow-softShadow md:rounded-2xl rounded-lg">
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

      <div className="overflow-scroll w-full grid grid-cols-2 h-full gap-5 p-5 no-scrollbar">
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
            handleHousie={handleHousie}
          />
        ))}
      </div>

      <div className="border w-4/5 grid grid-rows-2 grid-cols-2 gap-5 py-3">
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.jaldi5Status.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Jaldi 5 :{" "}
              {housie.jaldi5Status.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Jaldi 5</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.firstRowStatus.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> First Row :{" "}
              {housie.firstRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">First Row</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.secondRowStatus.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Second Row :{" "}
              {housie.secondRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Second Row</p>
          )}
        </div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">
          {housie.thirdRowStatus.isCompleted ? (
            <p className="text-center">
              <Trophy className="text-orange-500 inline mr-3" /> Third Row :{" "}
              {housie.thirdRowStatus.winnerName}{" "}
            </p>
          ) : (
            <p className="text-center">Third Row</p>
          )}
        </div>
      </div>
    </div>
  );
}
