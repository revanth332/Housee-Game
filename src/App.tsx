import { useEffect, useState } from "react"
import Board from "./components/Board"
import Sidebar from "./components/Sidebar"

export const randomNumberInRange = (min:number, max:number) => {
  return Math.floor(Math.random()
      * (max - min + 1)) + min;
};


function App() {
  const [randomNum,setRandomNum] = useState(0);
  const [genNums,setgenNums] = useState<number[]>([]);
  const [store,setStore] = useState<number[]>([]);
  const [count,setCount] = useState(-1);

  const setRandomNumber = () => {
    setCount((prev) => {
      const next = prev+1;
      setRandomNum(store[next]);
      setgenNums([...genNums,store[next]])
      return next;
    })
    
}

const generateRanNums = () => {
  const newNumbers : number[] = []
        while (newNumbers.length <= 90) {
          const randomNumber = randomNumberInRange(1,91);
          if (!newNumbers.includes(randomNumber)) {
            newNumbers.push(randomNumber);
          }
        }
        return newNumbers;
}

useEffect(() => {
  setStore(generateRanNums())
},[])

  return (
    <div className="grid grid-cols-4 w-screen h-screen bg-slate-100 gap-5 p-3">
      <Sidebar randomNum={randomNum} setRandomNumber={setRandomNumber}  />
      <Board randomNum={randomNum} genNums={genNums}/>
      
    </div>
  )
}

export default App
