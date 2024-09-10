import { randomNumberInRange } from "./Sidebar"
import Tile from "./Tile"

export default function Board({numbers}:{numbers:number[]}) {

    const generatedNumbers = new Array(27).fill(0).map((_, index) => {
        let num = randomNumberInRange(((index % 9) * 10) + 1, ((index % 9) * 10) + 9);
        while (numbers.includes(num)) {
          num = randomNumberInRange(((index % 9) * 10) + 1, ((index % 9) * 10) + 9);
        }
        numbers.push(num);
        return num;
      });

  return (
    <div className="flex justify-center col-span-3 items-center bg-white rounded-2xl">
        <div className="grid grid-cols-9">
            {generatedNumbers.map((item,indx) => {
        return <div className='w-[100px] bg-slate-400' ey={indx}>{item}</div>
})}
{/* return <Tile key={indx} number={() => getRandomNum(indx)} */}
        </div>
    </div>
  )
}
