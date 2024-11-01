import { Mic, MicOff, Ticket , User2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Housie, User, UserInfo} from "../App";
export default function Participants({
  handleAllowTalk,
  currentUser,
  housie,
  editUser
}: {
  handleAllowTalk: () => void;
  currentUser : User,
  housie : Housie,
  editUser : (user : UserInfo) => void
}) {
    const [searchTerm,setSearchTerm] = useState<string>("");
    const [orderedUsers,setOrderedUsers] = useState<UserInfo []>([])
    const filteredUsers = orderedUsers?.filter(user => user.username.includes(searchTerm))

    useEffect(() => {
      setOrderedUsers(() => {
        const currentUserValue : UserInfo | undefined = housie.participants?.find((user : UserInfo) => user.username === currentUser.info.username);
        const otherUserValues =  housie.participants?.filter((user : UserInfo) => user.username !== currentUser.info.username);
        const totalUserValues =  currentUserValue ? [currentUserValue, ...otherUserValues] : otherUserValues;
        return totalUserValues;
      })
    },[currentUser])

  return (
    <div className="bg-softColor shadow-softShadow md:rounded-2xl rounded-lg md:p-5 p-2 row-start-2 col-start-5 col-end-13 row-end-7 md:row-span-6 md:col-span-3 overflow-y-auto">
      <h2 className="text-xl pt-2 font-bold text-gray-500 mb-2">Participants</h2>
      <input onChange={(e) => setSearchTerm(e.target.value)} className="bg-softColor shadow-softShdowInner mb-3 w-full rounded-xl p-2 border-slate-400 outline-none" type="text" name="user" id="user" placeholder="Type.."  />
      {filteredUsers?.map((user, index) => (
        <div
          key={index}
          className="bg-softColor shadow-softShadow rounded-xl p-2 mb-2 text-slate-700 flex justify-between items-center"
        >
          <div className="flex items-center justify-center">
            <p className="flex items-center justify-center"><User2 className="w-5 h-5 mr-1"/> {user.username}</p>
            <p className="flex ml-3 items-center justify-center"><Ticket className="w-5 h-5  mr-1"/> {currentUser.info.ticketCount}</p>
          </div>

          <div className="flex items-center w-14 justify-between">
          <Pencil onClick={() => editUser(user)} className="text-green-600 w-5" />
            {user.username === currentUser.info.username ? (
              user.micAllowed ? (
                <>
                  {/* <p className="border mr-2 rounded-full bg-green-400 w-3 h-3 animate-ping"></p>
                   */}
                  <Mic onClick={handleAllowTalk} className="text-green-600 w-5" />
                </>
              ) : (
                <MicOff onClick={handleAllowTalk} className="text-red-500 w-5" />
              )
            ) : (
              user.micAllowed ? <p className="border mr-2 rounded-full bg-green-600 w-2 h-2 animate-ping"></p> : <MicOff className="text-red-500 w-5" />
              // <p className="text-white">{username}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
