import { FiCheck } from "react-icons/fi";
const commonStyle = "m-2 rounded-full bg-gradient-to-br from-[#cacaca] to-[#f0f0f0] shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff]"
export default function Tile({genNums,number,marked,appear,makeMark}:{genNums:number[],number : number,marked:boolean,appear:boolean,makeMark:(num:number) => void}) {
  return (
    appear ? 
    <div
    className={`${commonStyle} w-16 h-16 flex items-center justify-center bg-gray-200 cursor-pointer`}
    onClick={() => makeMark(number)}
  >
    {marked && <div className={`${commonStyle} w-16 h-16 flex items-center justify-center rounded-full cursor-pointer absolute z-10`}>
        <FiCheck className="text-black text-2xl font-bold" />
    </div>}
    <span className={`${!marked && genNums?.includes(number) ? "animate-ping text-red-400" : null}`}>{number}</span>
  </div>
  : <div
  className={`${commonStyle} w-16 h-16 flex items-center justify-center bg-gray-200 cursor-pointer`} />
  )
}
