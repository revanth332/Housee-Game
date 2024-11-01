import { LogOut,Box,CircleUser  } from 'lucide-react';
import { User } from '../App';
export default function Header({logout,currentUser}:{logout : () => void,currentUser : User}) {
  return (
    <div className="px-5 md:row-span-1 col-span-full md:col-span-9 bg-softColor shadow-softShadow md:rounded-xl rounded-lg flex justify-between  items-center">
        <h1 className="font-bold text-slate-700 text-2xl">Housie</h1>
        <div className='flex'><p className=" text-blue-500 font-medium flex"><Box /><span className='ml-1'>{currentUser.info.roomNumber}</span></p><p className="ml-5 flex text-blue-500 font-medium"><CircleUser /><span className='ml-1'>{currentUser.info.username}</span></p> <button onClick={logout} className="text-red-500 ml-5"><LogOut className='w-5 h-5' />  </button> </div>
    </div>
  )
}
