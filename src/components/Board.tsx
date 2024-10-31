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
  row3Winner
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
  row3Winner : string
}) {
  // const [numbers,setNumbers] = useState<tile[]>([])
  const [indexSet1, setIndexSet1] = useState<number[]>([]);
  const [indexSet2, setIndexSet2] = useState<number[]>([]);
  const [indexSet3, setIndexSet3] = useState<number[]>([]);
  const [row1Status, setRow1Status] = useState(false);
  const [row2Status, setRow2Status] = useState(false);
  const [row3Status, setRow3Status] = useState(false);
  const [jaldi5, setJaldi5] = useState(false);
  const [housee, setHousee] = useState(false);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (
      localStorage.getItem("indexSet1") &&
      localStorage.getItem("indexSet2")
    ) {
      // setNumbers(JSON.parse(localStorage.getItem("numbers") as string))
      setIndexSet1(JSON.parse(localStorage.getItem("indexSet1") as string));
      setIndexSet2(JSON.parse(localStorage.getItem("indexSet2") as string));
      setIndexSet3(JSON.parse(localStorage.getItem("indexSet3") as string));
      setRow1Status(JSON.parse(localStorage.getItem("row1Status") as string));
      setRow2Status(JSON.parse(localStorage.getItem("row2Status") as string));
      setRow3Status(JSON.parse(localStorage.getItem("row3Status") as string));
      setJaldi5(JSON.parse(localStorage.getItem("jaldi5") as string));
      setHousee(JSON.parse(localStorage.getItem("housee") as string));
    } else {
      localStorage.setItem("row1Status", "false");
      localStorage.setItem("row2Status", "false");
      localStorage.setItem("row3Status", "false");
      localStorage.setItem("jaldi5", "false");
      localStorage.setItem("housee", "false");

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
    }
  }, []);

  const makeMark = (num: number) => {
    console.log(num);
    if (row1Status && row2Status && row3Status) setHousee(true);
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
      {/* <h1 style={{fontFamily:"cursive"}} className="text-5xl font-semibold text-slate-800">HOUSEE✌ <br /> <span className="text-sm block text-slate-600 mx-auto text-center mt-5">Lets play!</span> </h1> */}
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
