import { useState } from "react"

export const randomNumberInRange = (min:number, max:number) => {
    return Math.floor(Math.random()
        * (max - min + 1)) + min;
};

export default function Sidebar() {
    const [number,setNumber] = useState<number>(0);

    const setRandomNumber = () => {
        const num = randomNumberInRange(1,100)
        setNumber(num);
    }
    
  return (
    <div className="flex justify-center items-center bg-white rounded-2xl">
        <div>
            <div className="text-center text-3xl mb-5">{number}</div>
            <button className="p-2 bg-black rounded-xl w-[100px] text-white" onClick={setRandomNumber}>Click</button>
        </div>
    </div>
  )
}
