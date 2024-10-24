import { useState } from "react";

export default function Sidebar({
  randomNum,
  setRandomNumber,
  role,
  clicked
}: {
  randomNum: number;
  setRandomNumber: () => void;
  role: string;
  clicked:boolean;
}) {

  return (
    <div className="shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff] bg-gradient-to-br from-[#f0f0f0] to-[#cacaca] rounded-2xl flex justify-center items-center row-span-6 col-span-3">
      <div>
        <div className="text-center text-3xl mb-5 text-slate-700">{randomNum}</div>
        {
          role === "host" && <button
          className={`p-2 bg-gradient-to-br from-[#cacaca] to-[#f0f0f0] transition-shadow ease-in-out ${!clicked ? "shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff]" : null} rounded-xl w-[100px] text-slate-700`}
          onClick={setRandomNumber}
        >
          Click
          </button>
        }
      </div>
    </div>
  );
}
