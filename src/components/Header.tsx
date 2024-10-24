import { LogOut,Box,CircleUser  } from 'lucide-react';
export default function Header({logout}:{logout : () => void}) {
  return (
    <div className="px-5 row-span-1 col-span-9 shadow-[3px_-3px_6px_#a1a1a1,-3px_3px_6px_#ffffff] bg-gradient-to-br from-[#f0f0f0] to-[#cacaca] rounded-xl flex justify-between  items-center">
        <h1 className="font-bold text-slate-700 text-2xl">Housie</h1>
        <div className='flex'><p className=" text-blue-500 font-medium flex"><Box /><span className='ml-1'>{localStorage.getItem("roomNo")}</span></p><p className="ml-5 flex text-blue-500 font-medium"><CircleUser /><span className='ml-1'>{localStorage.getItem("username")}</span></p> <button onClick={logout} className="text-red-500 ml-5"><LogOut className='w-5 h-5' />  </button> </div>
    </div>
  )
}
