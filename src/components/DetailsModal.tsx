import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { generateUniqueRandomNumbers, Housie, NumberTile, randomNumberInRange, TicketDetails, User } from "../App";
import { useRef } from "react";

export default function DetailsModal({
  housie,
  currentUser,
  handleShowModal,
  selectedUser,
  open,
  handleHousie,
  handleCurrentUser,
  emitTicketUpdate
}: {
  housie : Housie,
  currentUser : User,
  handleShowModal : () => void,
  selectedUser : string,
  open : boolean,
  handleHousie : (housie : Housie) => void,
  handleCurrentUser : (user : User) => void,
  emitTicketUpdate : (newTicketCount : number,selectedUser : string,newHousie : Housie,generatedTickets : TicketDetails[]) => void
}) {
  const ticketCountRef = useRef<HTMLInputElement>(null);

  const generateIndexes = () => {
    const newNumbers: number[] = [];
    while (newNumbers.length < 5) {
      const randomNumber = randomNumberInRange(0, 8);
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    return newNumbers;
  };

  const editUser = () => {
    if(ticketCountRef.current){
      handleShowModal();
      const newTicketCount = Number(ticketCountRef.current?.value);
      const generatedTickets = [];
      for(let i=0;i<newTicketCount;i++){
        const skippingIndexesRow1: number[] = generateIndexes();
        const skippingIndexesRow2: number[] = generateIndexes();
        const skippingIndexesRow3: number[] = generateIndexes();
        const newTiles: NumberTile[] = generateUniqueRandomNumbers();
        const newTicket = {
            ticketId:i,
            skippingIndexes : [skippingIndexesRow1,
                              skippingIndexesRow2,
                              skippingIndexesRow3],
            isRow1Completed: false,
            isRow2Completed: false,
            isRow3Completed: false,
            numberTiles: newTiles,
        }
        generatedTickets.push(newTicket);
      }
      
      const newHousie = {
        ...housie,
        participants: housie.participants.map((participant) =>
          participant.username === selectedUser
            ? {
                ...participant,
                isEditing: !participant.isEditing,
                ticketCount: newTicketCount,
              }
            : participant
        ),
      };
      console.log(selectedUser,currentUser.info.username)
      if(selectedUser === currentUser.info.username){
        const newUser = {
          ...currentUser,
          info : {
            ...currentUser.info,
            ticketCount: newTicketCount
          },
          tickets : generatedTickets
        }
        localStorage.setItem("currentUser",JSON.stringify(newUser));
        handleCurrentUser(newUser);
      }
      localStorage.setItem("housie",JSON.stringify(newHousie));
      handleHousie(newHousie);
      emitTicketUpdate(newTicketCount,selectedUser,newHousie,generatedTickets);
    }
    
  }
  return (
    <Dialog
      open={open}
      onClose={handleShowModal}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 sm:mt-0 sm:text-left w-full">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Enter the number of tickets
                  </DialogTitle>
                  <div className="mt-2 w-full">
                    <div className="w-full">
                      <input
                        ref={ticketCountRef}
                        type="number"
                        id="visitors"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={editUser}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Submit
              </button>
              <button
                type="button"
                data-autofocus
                onClick={handleShowModal}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
