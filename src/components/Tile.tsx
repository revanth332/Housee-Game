import { FiCheck } from "react-icons/fi";
import { NumberTile } from "../App";
const commonStyle =
  "h-9 w-9 md:m-2 my-1 rounded-full hover:shadow-softShdowInner bg-softColor shadow-softShadow";
export default function Tile({
  index,
  numberTile,
  makeMark,
  skippingIndexes,
  genNumbers,
}: {
  index: number;
  numberTile: NumberTile;
  makeMark: (num: number) => void;
  skippingIndexes: number[];
  genNumbers: number[];
}) {
  return skippingIndexes.includes(index) ? (
    <div
      className={`${commonStyle} flex items-center justify-around bg-gray-200 cursor-pointer`}
      onClick={() => makeMark(numberTile.number)}
    >
      {numberTile.isMarked && (
        <div
          className={`${commonStyle} flex items-center justify-center rounded-full cursor-pointer absolute z-10`}
        >
          <FiCheck className="text-black text-2xl font-bold" />
        </div>
      )}
      <span
        className={`${
          !numberTile.isMarked && genNumbers?.includes(numberTile.number)
            ? "animate-ping text-red-400"
            : null
        }`}
      >
        {numberTile.number}
      </span>
    </div>
  ) : (
    <div
      className={`${commonStyle} flex items-center justify-center bg-gray-200 cursor-pointer`}
    />
  );
}
