import { useEffect, useRef, useState } from "react";
import { randomNumberInRange } from "../App";
import Ticket from "./Ticket";
import { ToastContainer, toast } from "react-toastify";
import { Trophy } from 'lucide-react';

type tile = {
  number: number;
  marked: boolean;
};

export default function Board({
  exitMessage,
  emitGameCompleteSignal,
  logout,
  randomNum,
  genNums,
  totalTiles,
  setTotalTiles,
  emitJaldi5,
  emitRow1Complete,
  emitRow2Complete,
  emitRow3Complete,
  jaldi5Winner,
  row1Winner,
  row2Winner,
  row3Winner,
  housie,
  handleHousie
}: {
  exitMessage: string;
  emitGameCompleteSignal: () => void;
  logout: () => void;
  randomNum: number;
  genNums: number[];
  totalTiles: tile[];
  setTotalTiles: React.Dispatch<React.SetStateAction<tile[]>>;
  emitJaldi5 : () => void;
  emitRow1Complete : () => void;
  emitRow2Complete : () => void;
  emitRow3Complete : () => void;
  jaldi5Winner : string,
  row1Winner : string,
  row2Winner : string,
  row3Winner : string,
  housie : Housie,
  handleHousie : () => void
}) {
  // const [numbers,setNumbers] = useState<tile[]>([])
  const [row1Status, setRow1Status] = useState(false);
  const [row2Status, setRow2Status] = useState(false);
  const [row3Status, setRow3Status] = useState(false);
  const [jaldi5, setJaldi5] = useState(false);
  const [housee, setHousee] = useState(false);

  const dialogRef = useRef<HTMLDialogElement | null>(null);


  useEffect(() => {
    if (jaldi5){
      if(localStorage.getItem("jaldi5Finished") === null) emitJaldi5();
      toast("Jaldi 5 !!!");
    }
  }, [jaldi5]);

  useEffect(() => {
    // console.log("row1",row1Status)
    if (row1Status){
      if(localStorage.getItem("row1Finished")  === null) emitRow1Complete();
      toast("First Row completed!!!");
    }
  }, [row1Status]);

  useEffect(() => {
    // console.log("row2",row2Status)
    if (row2Status){
      if(localStorage.getItem("row2Finished") === null) emitRow2Complete();
      toast("Second Row completed !!!");
    }
  }, [row2Status]);

  useEffect(() => {
    // console.log("row3",row3Status)
    if (row3Status){
      if(localStorage.getItem("row3Finished") === null) emitRow3Complete()
      toast("Third Row completed !!!");
    }
  }, [row3Status]);

  useEffect(() => {
    // console.log("row1",row1Status)
    if (housee) {
      dialogRef.current?.showModal();
      emitGameCompleteSignal();
    }
  }, [housee]);

  useEffect(() => {
    // For remaining users
    if (exitMessage.includes("has")) {
      dialogRef.current?.showModal();
    }
  },[exitMessage]) 



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

      <Ticket />

      <div className="border w-4/5 grid grid-rows-2 grid-cols-2 gap-5">
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">{jaldi5Winner !== "" ? <p className="text-center"><Trophy className="text-orange-500 inline mr-3"/> Jaldi 5 : {jaldi5Winner} </p> : <p className="text-center">Jaldi 5</p>  }</div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">{row1Winner !== "" ? <p className="text-center"><Trophy className="text-orange-500 inline mr-3"/> First Row : {row1Winner} </p> : <p className="text-center">First Row</p> }</div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">{row2Winner !== "" ? <p className="text-center"><Trophy className="text-orange-500 inline mr-3"/> Second Row : {row2Winner} </p> : <p className="text-center">Second Row</p> }</div>
        <div className="row-span-1 col-span-1 shadow-softShadow p-2 rounded-xl">{row3Winner !== "" ? <p className="text-center"><Trophy className="text-orange-500 inline mr-3"/> Third Row : {row3Winner} </p> : <p className="text-center">Third Row</p> }</div>
      </div>
    </div>
  );
}
