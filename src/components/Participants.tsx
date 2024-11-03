import { Mic, MicOff, Ticket , User2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Housie, TicketDetails, User, UserInfo} from "../App";
import DetailsModal from "./DetailsModal";
export default function Participants({
  handleAllowTalk,
  currentUser,
  housie,
  handleCurrentUser,
  handleHousie,
  emitTicketUpdate
}: {
  handleAllowTalk: () => void;
  currentUser : User,
  housie : Housie,
  handleCurrentUser : (user : User) => void
  handleHousie : (housie : Housie) => void
  emitTicketUpdate : (newTicketCount : number,selectedUser : string,newHousie : Housie,generatedTickets : TicketDetails[]) => void
}) {
    const [searchTerm,setSearchTerm] = useState<string>("");
    const [orderedUsers,setOrderedUsers] = useState<UserInfo []>([])
    const filteredUsers = orderedUsers?.filter(user => user.username.includes(searchTerm))
    const [selectedUser,setSelectedUser] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
      setOrderedUsers(() => {
        const currentUserValue : UserInfo | undefined = housie.participants?.find((user : UserInfo) => user.username === currentUser.info.username);
        const otherUserValues =  housie.participants?.filter((user : UserInfo) => user.username !== currentUser.info.username);
        const totalUserValues =  currentUserValue ? [currentUserValue, ...otherUserValues] : otherUserValues;
        return totalUserValues;
      })
    },[currentUser,housie])

    const handleEditingUser = (user : string) => {
      handleShowModal();
      setSelectedUser(user);
    }

    const handleShowModal = () => {
      setShowDetailsModal(prev => !prev);
    }

  return (
    <div className="bg-softColor shadow-softShadow md:rounded-2xl rounded-lg row-start-2 col-start-5 col-end-13 row-end-7 md:row-span-8 md:col-span-3 overflow-y-auto">
      <DetailsModal housie={housie} currentUser={currentUser} handleShowModal={handleShowModal} selectedUser={selectedUser} open={showDetailsModal} handleHousie={handleHousie} handleCurrentUser={handleCurrentUser} emitTicketUpdate={emitTicketUpdate}/>
      
      <div className="md:p-5 p-2">
        <h2 className="text-xl pt-2 font-bold text-gray-500 mb-2">Participants</h2>
        <input onChange={(e) => setSearchTerm(e.target.value)} className="bg-softColor shadow-softShdowInner w-full rounded-xl p-2 border-slate-400 outline-none" type="text" name="user" id="user" placeholder="Type.."  />
        
      </div>
      <div className="overflow-auto md:p-5 md:pt-2 p-2 h-[70%]">
      {filteredUsers?.map((user, index) => (
        <div
          key={index}
          className="bg-softColor shadow-softShadow rounded-xl p-2 mb-3 text-slate-700"
        >
          <div className="">
            <div className="flex justify-between mb-1">
            <div className="flex items-center justify-center"><User2 className="w-5 h-5 mr-2"/> {user.username}</div>
            <div className="flex">
          {currentUser.info.isAdmin && <Pencil onClick={() => handleEditingUser(user.username)} className="text-green-600 w-5 mr-2" /> }
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
            <div className="flex items-center"><Ticket className="w-5 h-5 mr-2"/> {user.ticketCount}</div>
          </div>
        </div>
      ))}
      </div>

    </div>
  );
}
