import { FiCheck } from "react-icons/fi";

export default function Tile({genNums,number,marked,appear,makeMark}:{genNums:number[],number : number,marked:boolean,appear:boolean,makeMark:(num:number) => void}) {
  return (
    appear ? 
    <div
    className={`w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer `}
    onClick={() => makeMark(number)}
  >
    {marked && <div className="w-14 h-14 flex items-center justify-center rounded-full cursor-pointer absolute z-10">
        <FiCheck className="text-black text-2xl font-bold" />
    </div>}
    <span className={`${!marked && genNums?.includes(number) ? "animate-ping text-red-400" : null}`}>{number}</span>
  </div>
  : <div
  className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 cursor-pointer" />
  )
}
