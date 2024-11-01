import { useEffect, useState } from "react";
import Board from "./components/Board";
import Sidebar from "./components/Sidebar";
import { socket } from "./components/Socket";
import { toast } from "react-toastify";
import { useRef } from "react";
import axios from "axios";
import Participants from "./components/Participants";
import Header from "./components/Header";
import { Loader2 } from "lucide-react";
import DetailsModal from "./components/DetailsModal";

const URL = import.meta.env.VITE_SOCKET_URL;

export const randomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUniqueRandomNumbers  = () => {
  var newNumbers: number[] = [];
  while (newNumbers.length < 27) {
    let index = newNumbers.length;
    const randomNumber = randomNumberInRange(
      (index % 9) * 10 + 1,
      (index % 9) * 10 + 9
    );
    if (!newNumbers.includes(randomNumber)) {
      newNumbers.push(randomNumber);
    }
  }
  const tiles : NumberTile[] = newNumbers.map((num) => {
    return { number: num, isMarked: false };
  });
  return tiles;
};

export type NumberTile = {
  number: number;
  isMarked: boolean;
};

export type UserInfo = {
  username: string;
  micAllowed: boolean;
  roomNumber: string;
  isAdmin: boolean;
  ticketCount: number;
  isEditing : boolean;
};

export type TicketDetails = {
  ticketId: number;
  skippingIndexesRow1: number[];
  skippingIndexesRow2: number[];
  skippingIndexesRow3: number[];
  isRow1Completed: boolean;
  isRow2Completed: boolean;
  isRow3Completed: boolean;
  numberTiles: NumberTile[];
};

export type User = {
  info: UserInfo;
  tickets: TicketDetails[];
};

export type Status = {
  isCompleted: boolean;
  winnerName: string;
};

export type Housie = {
  roomNumber : string,
  currentStoreIndex:number,
  participants: UserInfo[];
  tickets: TicketDetails[];
  jaldi5Status : Status,
  firstRowStatus: Status;
  secondRowStatus: Status;
  thirdRowStatus: Status;
  winStatus: Status;
  currentTimerValue: number;
  currentRandomValue: number;
  generatedRandomNumbers: number[];
  numberStore: number[];
};

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string>("");
  const [logged, setLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [clicked, setClicked] = useState(false);
  const [exitMessage, setExitMessage] = useState<string>(
    "🎊🎉✨Yayy! Housee!!!!"
  );
  const [intervalId, setIntervalId] = useState<number>(0);
  const [counterInterval, setCounterInterval] = useState<number>(0);

  const initialHosie = {
    roomNumber:"",
    participants: [],
    tickets: [],
    jaldi5Status : { isCompleted: false, winnerName: "" },
    firstRowStatus: { isCompleted: false, winnerName: "" },
    secondRowStatus: { isCompleted: false, winnerName: "" },
    thirdRowStatus: { isCompleted: false, winnerName: "" },
    winStatus: { isCompleted: false, winnerName: "" },
    currentTimerValue: 5,
    currentStoreIndex: -1,
    currentRandomValue: 0,
    generatedRandomNumbers: [],
    numberStore: [],
  };

  const intialUser ={
      tickets: [],
      info: {
        username: "",
        micAllowed: false,
        roomNumber: "",
        isAdmin: false,
        ticketCount: 1,
        isEditing : false
      },
      
    }
  const [housie, setHousie] = useState<Housie>(initialHosie);
  const [currentUser, setCurrentUser] = useState<User>(intialUser);

  const handleHousie = (newHousie : Housie) => {
    setHousie(newHousie);
  };

  const handleCurrentUser = (updatedUser : User) => {
    setCurrentUser(updatedUser)
  };

  const emitJaldi5 = () => {
    const newHousie = {...housie,jaldi5Status:{ isCompleted: true, winnerName: currentUser.info.username }}
    localStorage.setItem("housie", JSON.stringify(newHousie));
    socket.emit("jaldi5Complete", currentUser);
  };

  const emitRow1Complete = () => {
    const newHousie = {...housie,firstRowStatus:{ isCompleted: true, winnerName: currentUser.info.username }}
    localStorage.setItem("housie", JSON.stringify(newHousie));
    socket.emit("row1Complete", currentUser);
  };

  const emitRow2Complete = () => {
    const newHousie = {...housie,secondRowStatus:{ isCompleted: true, winnerName: currentUser.info.username }}
    localStorage.setItem("housie", JSON.stringify(newHousie));
    socket.emit("row2Complete", currentUser);
  };

  const emitRow3Complete = () => {
    const newHousie = {...housie,firstRowStatus:{ isCompleted: true, winnerName: currentUser.info.username }}
    localStorage.setItem("housie", JSON.stringify(newHousie));
    socket.emit("row3Complete", currentUser);
  };

  const handleClick = () => {
    setClicked((prev) => {
      const newVal = !prev;
      localStorage.setItem("isGameStarted", JSON.stringify(newVal));
      if (!newVal) {
        if (intervalId) {
          clearInterval(intervalId);
          setIntervalId(0);
        }
        if (counterInterval) {
          clearInterval(counterInterval);
          setCounterInterval(0);
        }
      }
      return newVal;
    });
  };

  const emitGameCompleteSignal = () => {
    socket.emit("win", currentUser);
  };

  const resetGame = () => {
    localStorage.clear();
    dialogRef.current?.showModal();
    if (formRef.current) {
      formRef.current.reset();
    }
    handleHousie(initialHosie)
    handleCurrentUser(intialUser);
  };

  const logout = () => {
    resetGame();
    const newParticipants = housie.participants.filter(participant => participant.username !== currentUser.info.username)
    const newHousie = {...housie,participants:newParticipants};
    socket.emit("exit", newHousie,currentUser);
  };

  const editUser = (user : UserInfo) => {
    const newHousie = {...housie,participants:housie.participants.map(participant => participant.username === user.username ? {...participant,isEditing : !participant.isEditing} : participant)};
    handleHousie(newHousie);
  }

  const handleAllowTalk = () => {
      const isAllowed = !currentUser.info.micAllowed;
      if (isAllowed) {
        startRecording();
      } else {
        stopRecording();
      }
      const newCurrentUser = {...currentUser,info:{...currentUser.info,micAllowed : isAllowed}};
      const newParticipants = housie.participants.map(participant => participant.username === currentUser.info.username ? {...participant,micAllowed:isAllowed} : participant)
      const newHousie = {...housie,participants:newParticipants};
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("housie", newHousie,newCurrentUser);
      setHousie(newHousie);
  };

  const setRandomNumber = () => {
    handleClick();

    if (!counterInterval) {
      const newIntervalId = setInterval(() => {
          let newCurrentTimerValue = housie.currentTimerValue - 1;
          if (newCurrentTimerValue === 0) {
            newCurrentTimerValue = 5;
          }
          const newHousie = {...housie,currentTimerValue:newCurrentTimerValue};
          localStorage.setItem("housie", JSON.stringify(newHousie));
          socket.emit("housie",newHousie,currentUser);
          handleHousie(newHousie);
      }, 1000);
      setCounterInterval(newIntervalId);
    }

    if (!intervalId) {
      console.log("inside inter");

      const newIntervalId = setInterval(() => {
          const newCurrentStoreIndex = housie.currentStoreIndex + 1;
          const newCurrentRandomValue = housie.numberStore[newCurrentStoreIndex]
          const newGeneratedRandomNumbers = [...housie.generatedRandomNumbers,newCurrentRandomValue]
          const newHousie = {...housie,currentStoreIndex:newCurrentStoreIndex,currentRandomValue:newCurrentRandomValue,generatedRandomNumbers:newGeneratedRandomNumbers};
          
          localStorage.setItem("housie", JSON.stringify(newHousie));
          socket.emit("housie",newHousie,currentUser);
          handleHousie(newHousie);

          if (newCurrentStoreIndex === housie.numberStore.length - 1) {
            clearInterval(intervalId);
          }

      }, 5000);
      setIntervalId(newIntervalId);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (counterInterval) {
        clearInterval(counterInterval);
      }
    };
  }, [intervalId]);


  useEffect(() => {
    socket.connect();

    socket.on("entered", (incomingHousie : Housie) => {
      if (incomingHousie.roomNumber === currentUser.info.roomNumber) {
        handleHousie(incomingHousie);
      }
    });

    socket.on("jaldi5Complete", (incomingUser : User) => {
      if (incomingUser.info.roomNumber === housie.roomNumber) {
        const newHousie = {...housie,secondRowStatus:{ isCompleted: true, winnerName: incomingUser.info.username }}
        localStorage.setItem("housie", JSON.stringify(newHousie));
        toast(incomingUser.info.username + " completed Jaldi 5");
      }
    });

    socket.on("row1Complete", (incomingUser : User) => {
      if (incomingUser.info.roomNumber === housie.roomNumber) {
        const newHousie = {...housie,secondRowStatus:{ isCompleted: true, winnerName: incomingUser.info.username }}
        localStorage.setItem("housie", JSON.stringify(newHousie));
        toast(incomingUser.info.username + " completed Row 1");
      }
    });

    socket.on("row2Complete", (incomingUser : User) => {
      if (incomingUser.info.roomNumber === housie.roomNumber) {
        const newHousie = {...housie,secondRowStatus:{ isCompleted: true, winnerName: incomingUser.info.username }}
        localStorage.setItem("housie", JSON.stringify(newHousie));
        toast(incomingUser.info.username + " completed Row 2");
      }
    });

    socket.on("row3Complete", (incomingUser : User) => {
      if (incomingUser.info.roomNumber === housie.roomNumber) {
        const newHousie = {...housie,firstRowStatus:{ isCompleted: true, winnerName: incomingUser.info.username }}
        localStorage.setItem("housie", JSON.stringify(newHousie));
        toast(incomingUser.info.username + " completed Row 3");
      }
    });

    socket.on("win", (incomingUser : User) => {
      if (incomingUser.info.roomNumber === housie.roomNumber) {
        setExitMessage(incomingUser.info.username + " has won the game 🎊🎉✨");
      }
    });

    socket.on("exit",(incomingHousie : Housie,incomingUser : User) => {
      if (incomingHousie.roomNumber === currentUser.info.roomNumber){
        if(incomingUser.info.isAdmin){
          resetGame();
        }
        else{
          handleHousie(incomingHousie);
        }
      }
    })

    socket.on("audioStream", (audioData, incomingUser : User) => {
      if (incomingUser.info.roomNumber === currentUser.info.roomNumber) {
        // console.log("talking: "+room+" "+roomNo)
        var newData = audioData.split(";");
        newData[0] = "data:audio/ogg;";
        newData = newData[0] + newData[1];

        var audio = new Audio(newData);
        // console.log(audio);
        if (!audio || document.hidden) {
          // console.log("returned")
          return;
        }
        audio.play();
      }
    });

    socket.on(
      "housie",
      (incomingHousie : Housie,incomingUser : User) => {

        if (!incomingUser.info.isAdmin && incomingHousie.roomNumber === currentUser.info.roomNumber) {
          handleHousie(incomingHousie)
        }

      }
    );

    return () => {
      socket.off("housie");
      socket.disconnect();
    };
  }, []);

  const startRecording = () => {
    // console.log("strted recording")
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        var audioChunks: Blob[] = [];

        mediaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          var audioBlob = new Blob(audioChunks);
          audioChunks = [];
          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            socket.emit("audioStream", base64String, currentUser);
          };
          mediaRecorder.start();
          setTimeout(function () {
            mediaRecorder.stop();
          }, 1000);
        });

        mediaRecorder.start();
        setTimeout(function () {
          mediaRecorder.stop();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current = null;
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("currentUser");
    const localHousie = localStorage.getItem("housie");

    if (localUser && localHousie ) {
      handleCurrentUser(JSON.parse(localUser));
      handleHousie(JSON.parse(localHousie))
      setLogged(true);
      dialogRef?.current?.close();
    } else {
      dialogRef.current?.showModal();
    }

  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get("type");
    const roomCode = formData.get("enterRoom");
    var username = formData.get("username");
    setIsLoading(true);
    axios
      .post(`${URL}/api/room`, {
        type,
        roomCode,
        username,
      })
      .then((response) => {
        if (response.data.success) {
          setLogged(true);
          if (username && roomCode && type) {
            username =
              username.toString().charAt(0).toUpperCase() +
              username.toString().substring(1);
            const newStore = generateRandomNums();
            const updatedUser = {
              ...currentUser,
              info: {
                ...currentUser.info,
                username,
                roomNumber: roomCode.toString(),
                isAdmin: type.toString() === "createRoom",
              },
            };
            const newHousie = {
              ...housie,
              participants: [
                ...housie.participants,
                {
                  username,
                  roomNumber: roomCode.toString(),
                  isAdmin: type.toString() === "createRoom",
                  micAllowed: false,
                  ticketCount: 1,
                  isEditing : false
                },
              ],
              numberStore: newStore,
            };
            socket.emit("entered", newHousie);
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            localStorage.setItem("housie", JSON.stringify(newHousie));
            handleCurrentUser(updatedUser);
            handleHousie(newHousie);
          }
          toast.success("Welcome to Housie!!!");
          dialogRef.current?.close();
        } else {
          setError(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to send room details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const generateRandomNums = () => {
    const newNumbers: number[] = [];
    while (newNumbers.length <= 90) {
      const randomNumber = randomNumberInRange(1, 91);
      if (!newNumbers.includes(randomNumber)) {
        newNumbers.push(randomNumber);
      }
    }
    return newNumbers;
  };

  return (
    <div className="grid grid-cols-12 grid-rows-12 w-screen h-screen bg-softColor gap-2 p-1 md:gap-3 md:p-3">
      <DetailsModal editingUser={housie.participants.find(participant => participant.isEditing === true)} editUser={editUser}/>
      <dialog
        ref={dialogRef}
        className="shadow-softShadow bg-softColor p-5 rounded-xl w-[500px]"
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Select Option
            </label>
            <select
              name="type"
              id="type"
              className="bg-softColor shadow-softShdowInner mt-1 block w-full p-3 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm outline-none"
              required
            >
              <option value="createRoom">Create Room</option>
              <option value="enterRoom">Enter Room</option>
            </select>
          </div>
          <div className="mb-3">
            <label
              htmlFor="enterRoom"
              className="block text-sm font-medium text-gray-700"
            >
              Room Code
            </label>
            <input
              type="text"
              name="enterRoom"
              id="enterRoom"
              className="bg-softColor shadow-softShdowInner outline-none mt-1 p-3 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter room code"
              required
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="bg-softColor shadow-softShdowInner outline-none mt-1 p-3 block w-full rounded-md border-gray-300 sm:text-sm"
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:justify-center lg:justify-start">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <Loader2 className="text-white animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-center mt-3">{error}</div>
          )}
        </form>
      </dialog>
      {logged && (
        <>
          <Sidebar
            setRandomNumber={setRandomNumber}
            clicked={clicked}
            handleClick={handleClick}
            housie={housie}
            currentUser={currentUser}
          />
          <Header logout={logout} currentUser={currentUser} />
          <Board
            exitMessage={exitMessage}
            emitGameCompleteSignal={emitGameCompleteSignal}
            logout={logout}
            emitJaldi5={emitJaldi5}
            emitRow1Complete={emitRow1Complete}
            emitRow2Complete={emitRow2Complete}
            emitRow3Complete={emitRow3Complete}
            housie={housie}
            currentUser={currentUser}
            handleHousie={handleHousie}
          />
          <Participants
            handleAllowTalk={handleAllowTalk}
            currentUser={currentUser}
            housie={housie}
            editUser={editUser}
          />
        </>
      )}
    </div>
  );
}

export default App;
