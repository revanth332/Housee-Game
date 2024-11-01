import { FiCheck } from "react-icons/fi";
import { NumberTile, TicketDetails } from "../App";
const commonStyle =
  "h-9 w-9 md:w-9 md:h-9 m-2 rounded-full hover:shadow-softShdowInner bg-softColor shadow-softShadow";
export default function Tile({
  index,
  numberTile,
  makeMark,
  ticketDetails,
  genNumbers,
}: {
  index: number;
  numberTile: NumberTile;
  makeMark: (num: number) => void;
  ticketDetails: TicketDetails;
  genNumbers: number[];
}) {
  return ticketDetails.skippingIndexesRow1.includes(index) ? (
    <div
      className={`${commonStyle}  flex items-center justify-around bg-gray-200 cursor-pointer`}
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
