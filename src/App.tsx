import Board from "./components/Board"
import Sidebar from "./components/Sidebar"
import { useState } from "react";

function App() {
const [numbers,setNumbers] = useState<number[]>([]);

  return (
    <div className="grid grid-cols-4 w-screen h-screen bg-slate-100 gap-5 p-3">
      <Sidebar />
      <Board numbers={numbers}/>
    </div>
  )
}

export default App
