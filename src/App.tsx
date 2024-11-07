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
import WinModal from "./components/WinModal";

const URL = import.meta.env.VITE_SOCKET_URL;

export const randomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateUniqueRandomNumbers = () => {
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
  const tiles: NumberTile[] = newNumbers.map((num) => {
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
  isEditing: boolean;
};

export type TicketDetails = {
  ticketId: number;
  skippingIndexes: number[][];
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
  roomNumber: string;
  currentStoreIndex: number;
  participants: UserInfo[];
  jaldi5Status: Status;
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
  const [winModal,setWinModal] = useState(false);
  const [intervalId, setIntervalId] = useState<number>(0);
  const [counterInterval, setCounterInterval] = useState<number>(0);

  const initialHosie = {
    roomNumber: "",
    participants: [],
    jaldi5Status: { isCompleted: false, winnerName: "" },
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

  const intialUser = {
    tickets: [],
    info: {
      username: "",
      micAllowed: false,
      roomNumber: "",
      isAdmin: false,
      ticketCount: 0,
      isEditing: false,
    },
  };
  const [housie, setHousie] = useState<Housie>(initialHosie);
  const [currentUser, setCurrentUser] = useState<User>(intialUser);

  const handleHousie = (newHousie: Housie) => {
    console.log("update called : ", newHousie);
    setHousie((prev) => ({ ...prev, ...newHousie }));
  };

  const handleCurrentUser = (updatedUser: User) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const emitJaldi5 = () => {
    console.log("jaldi 5 emitted")
    const newHousie = {
      ...housie,
      jaldi5Status: {
        isCompleted: true,
        winnerName: currentUser.info.username,
      },
    };
    if (!housie.jaldi5Status.isCompleted) {
      toast("Juldi5 Completed");
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("jaldi5Complete", newHousie, currentUser);
      handleHousie(newHousie);
    }
  };

  const emitRow1Complete = () => {
    const newHousie = {
      ...housie,
      firstRowStatus: {
        isCompleted: true,
        winnerName: currentUser.info.username,
      },
    };
    if (!housie.firstRowStatus.isCompleted) {
      toast("First Row completed");
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("row1Complete", newHousie, currentUser);
      handleHousie(newHousie);
    }
  };

  const emitRow2Complete = () => {
    const newHousie = {
      ...housie,
      secondRowStatus: {
        isCompleted: true,
        winnerName: currentUser.info.username,
      },
    };
    if (!housie.secondRowStatus.isCompleted) {
      toast("Second Row completed");
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("row2Complete", newHousie, currentUser);
      handleHousie(newHousie);
    }
  };

  const emitRow3Complete = () => {
    const newHousie = {
      ...housie,
      thirdRowStatus: {
        isCompleted: true,
        winnerName: currentUser.info.username,
      },
    };
    if (!housie.thirdRowStatus.isCompleted) {
      toast("Third Row completed");
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("row3Complete", newHousie, currentUser);
      handleHousie(newHousie);
    }
  };

  const emitTicketUpdate = (
    newTicketCount: number,
    selectedUser: string,
    newHousie: Housie,
    generatedTickets: TicketDetails[]
  ) => {
    socket.emit(
      "ticketUpdate",
      newTicketCount,
      selectedUser,
      newHousie,
      generatedTickets
    );
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
    handleWinModal();
    socket.emit("win", currentUser);
  };

  const resetGame = () => {
    localStorage.clear();
    setWinModal(false)
    setLogged(false);
    dialogRef.current?.showModal();
    if (formRef.current) {
      formRef.current.reset();
    }
    handleHousie(initialHosie);
    handleCurrentUser(intialUser);
  };

  const logout = () => {
    clearInterval(counterInterval);
    clearInterval(intervalId);
    resetGame();
    const newParticipants = housie.participants.filter(
      (participant) => participant.username !== currentUser.info.username
    );
    console.log(newParticipants);
    const newHousie = { ...housie, participants: newParticipants };
    socket.emit("exit", newHousie, currentUser);
  };

  const handleWinModal = () => {
    setWinModal(prev => !prev);
  }

  const handleAllowTalk = () => {
    setCurrentUser((prevUser) => {
      const isAllowed = !prevUser.info.micAllowed;
      if (isAllowed) {
        startRecording();
      } else {
        stopRecording();
      }
      const newCurrentUser = {
        ...prevUser,
        info: { ...prevUser.info, micAllowed: isAllowed },
      };
      return newCurrentUser;
    })

    setHousie((prevHousie) => {
      const newParticipants = prevHousie.participants.map((participant) =>
        participant.username === currentUser.info.username
          ? { ...participant, micAllowed: !participant.micAllowed }
          : participant
      );
      const newHousie = { ...prevHousie, participants: newParticipants };
      localStorage.setItem("housie", JSON.stringify(newHousie));
      socket.emit("micAllow", newHousie);
      return newHousie;
    })
   
  };

  const setRandomNumber = () => {
    handleClick();

    if (!counterInterval) {
      const newCounterIntervalId = setInterval(() => {
        setHousie((prevHousie) => {
          let newCurrentTimerValue = prevHousie.currentTimerValue - 1;
          // console.log("interval : 1000",newCurrentTimerValue)
          if (newCurrentTimerValue === 0) {
            newCurrentTimerValue = 5;
          }
          const newHousie = {
            ...prevHousie,
            currentTimerValue: newCurrentTimerValue,
          };
          localStorage.setItem("housie", JSON.stringify(newHousie));
          socket.emit("housie", newHousie, currentUser);
          return newHousie;
        });
      }, 1000);
      setCounterInterval(newCounterIntervalId);
    }

    if (!intervalId) {
      // console.log("interval 5000");

      const newIntervalId = setInterval(() => {
        setHousie((prevHousie) => {
          const newCurrentStoreIndex = prevHousie.currentStoreIndex + 1;
          // console.log("newCurrentStoreIndex : "+newCurrentStoreIndex)
          const newCurrentRandomValue =
            prevHousie.numberStore[newCurrentStoreIndex];
          const newGeneratedRandomNumbers = [
            ...prevHousie.generatedRandomNumbers,
            newCurrentRandomValue,
          ];
          const newHousie = {
            ...prevHousie,
            currentStoreIndex: newCurrentStoreIndex,
            currentRandomValue: newCurrentRandomValue,
            generatedRandomNumbers: newGeneratedRandomNumbers,
          };

          localStorage.setItem("housie", JSON.stringify(newHousie));
          socket.emit("housie", newHousie, currentUser);
          if (newCurrentStoreIndex === newHousie.numberStore.length - 1) {
            clearInterval(intervalId);
          }

          return newHousie;
        });
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

  const housieRef = useRef(housie); // Create a ref for housie
  const currentUserRef = useRef(currentUser); // Create a ref for currentUser

  // Update the refs whenever housie or currentUser changes
  useEffect(() => {
    housieRef.current = housie;
  }, [housie]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    socket.connect();

    socket.on("entered", (incomingHousie: Housie, incomingUser: User) => {
      // console.log(incomingHousie.roomNumber,currentUserRef.current.info.roomNumber)
      setHousie((prevHousie) => {
        if (
          incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
        ) {
          const updatedHousie = {
            ...prevHousie,
            ...incomingHousie,
          };
          // console.log("Updated Housie:", updatedHousie);

          toast.info(incomingUser.info.username + " has joined the game");
          localStorage.setItem("housie", JSON.stringify(updatedHousie));

          return updatedHousie; // Return the new updated state
        }

        return prevHousie; // Return the previous state if room numbers don't match
      });
    });

    socket.on("cancel",(incomingRoomNumber) => {
      if(incomingRoomNumber === currentUserRef.current.info.roomNumber){
        if(currentUserRef.current.info.isAdmin){
          clearInterval(counterInterval);
          clearInterval(intervalId);
        }
        resetGame();
      }
    })

    socket.on("micAllow",(incomingHousie) => {
      setHousie((prevHousie) => {
        if (
          incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
        ) {
          const updatedHousie = {
            ...prevHousie,
            ...incomingHousie,
          };
          localStorage.setItem("housie", JSON.stringify(updatedHousie));

          return updatedHousie; // Return the new updated state
        }

        return prevHousie; // Return the previous state if room numbers don't match
      });
    })

    socket.on(
      "ticketUpdate",
      (newTicketCount, selectedUser, incomingHousie, incomingTickets) => {
        setHousie((prevHousie) => {
          if (
            incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
          ) {
            const updatedHousie = {
              ...prevHousie,
              ...incomingHousie,
            };
            localStorage.setItem("housie", JSON.stringify(updatedHousie));

            return updatedHousie; // Return the new updated state
          }

          return prevHousie; // Return the previous state if room numbers don't match
        });

        setCurrentUser((prevUser) => {
          if (selectedUser === currentUserRef.current.info.username) {
            const newUser = {
              ...prevUser,
              info: {
                ...currentUser.info,
                ticketCount: newTicketCount,
              },
              tickets: incomingTickets,
            };
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            return newUser;
          }
          return prevUser;
        });
      }
    );

    socket.on(
      "jaldi5Complete",
      (incomingHousie: Housie, incomingUser: User) => {
        console.log(incomingHousie.jaldi5Status,"jaldi5 recieved")
        setHousie((prevHousie) => {
          if (
            incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
          ) {
            const updatedHousie = {
              ...prevHousie,
              ...incomingHousie,
            };
            // console.log("Updated Housie:", updatedHousie);

            toast.info(incomingUser.info.username + " has completed Jaldi5");
            localStorage.setItem("housie", JSON.stringify(updatedHousie));

            return updatedHousie; // Return the new updated state
          }

          return prevHousie; // Return the previous state if room numbers don't match
        });
      }
    );

    socket.on("row1Complete", (incomingHousie: Housie, incomingUser: User) => {
      setHousie((prevHousie) => {
        if (
          incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
        ) {
          const updatedHousie = {
            ...prevHousie,
            ...incomingHousie,
          };
          // console.log("Updated Housie:", updatedHousie);

          toast.info(incomingUser.info.username + " has completed Row1");
          localStorage.setItem("housie", JSON.stringify(updatedHousie));

          return updatedHousie; // Return the new updated state
        }

        return prevHousie; // Return the previous state if room numbers don't match
      });
    });

    socket.on("row2Complete", (incomingHousie: Housie, incomingUser: User) => {
      setHousie((prevHousie) => {
        if (
          incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
        ) {
          const updatedHousie = {
            ...prevHousie,
            ...incomingHousie,
          };
          // console.log("Updated Housie:", updatedHousie);

          toast.info(incomingUser.info.username + " has completed Row 2");
          localStorage.setItem("housie", JSON.stringify(updatedHousie));

          return updatedHousie; // Return the new updated state
        }

        return prevHousie; // Return the previous state if room numbers don't match
      });
    });

    socket.on("row3Complete", (incomingHousie: Housie, incomingUser: User) => {
      setHousie((prevHousie) => {
        if (
          incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
        ) {
          const updatedHousie = {
            ...prevHousie,
            ...incomingHousie,
          };
          // console.log("Updated Housie:", updatedHousie);

          toast.info(incomingUser.info.username + " has Completed Row 3");
          localStorage.setItem("housie", JSON.stringify(updatedHousie));

          return updatedHousie; // Return the new updated state
        }

        return prevHousie; // Return the previous state if room numbers don't match
      });
    });

    socket.on("win", (incomingUser: User) => {
      if (incomingUser.info.roomNumber === currentUserRef.current.info.roomNumber) {
        setExitMessage(incomingUser.info.username + " has won the game 🎊🎉✨");
      }
    });

    socket.on("exit", (incomingHousie: Housie, incomingUser: User) => {
      console.log(incomingHousie);
      if (incomingHousie.roomNumber === currentUser.info.roomNumber) {
        if (incomingUser.info.isAdmin) {
          resetGame();
        } else {
          setHousie((prevHousie) => {
            if (
              incomingHousie.roomNumber ===
              currentUserRef.current.info.roomNumber
            ) {
              const updatedHousie = {
                ...prevHousie,
                ...incomingHousie,
              };
              // console.log("Updated Housie:", updatedHousie);

              toast.info(incomingUser.info.username + " has left the game");
              localStorage.setItem("housie", JSON.stringify(updatedHousie));

              return updatedHousie; // Return the new updated state
            }

            return prevHousie; // Return the previous state if room numbers don't match
          });
        }
      }
    });

    socket.on("audioStream", (audioData, incomingUser: User) => {
      console.log("audio recieved")
      if (
        incomingUser.info.roomNumber === currentUserRef.current.info.roomNumber
      ) {
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

    socket.on("housie", (incomingHousie: Housie, incomingUser: User) => {
      if (
        incomingUser.info.isAdmin &&
        incomingHousie.roomNumber === currentUserRef.current.info.roomNumber
      ) {
        handleHousie(incomingHousie);
      }
    });
    return () => {
      socket.off("housie");
      socket.off("entered");
      socket.off("jaldi5Complete");
      socket.off("row1Complete");
      socket.off("row2Complete");
      socket.off("row3Complete");
      socket.off("exit");
      socket.off("win");
      socket.off("audioStream");
      socket.disconnect();
    };
  }, [currentUser, housie]);

  const startRecording = () => {
    // console.log("strted recording")
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        var audioChunks: Blob[] = [];

        mediaRecorderRef.current.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        mediaRecorderRef.current.addEventListener("stop", function () {
          var audioBlob = new Blob(audioChunks);
          audioChunks = [];
          var fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);
          fileReader.onloadend = function () {
            var base64String = fileReader.result;
            socket.emit("audioStream", base64String, currentUserRef.current);
          };
          if(mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "recording") mediaRecorderRef.current.start();
          setTimeout(function () {
            if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
          }, 1000);
        });

        if(mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "recording") mediaRecorderRef.current.start();
        setTimeout(function () {
          if(mediaRecorderRef.current) mediaRecorderRef.current.stop();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current = null;
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("currentUser");
    const localHousie = localStorage.getItem("housie");

    if (localUser && localHousie) {
      handleCurrentUser(JSON.parse(localUser));
      handleHousie(JSON.parse(localHousie));
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
    if (username) {
      username =
        username.toString().charAt(0).toUpperCase() +
        username.toString().substring(1);
    }
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
            const newStore = generateRandomNums();
            const updatedUser = {
              ...currentUser,
              info: {
                ...currentUser.info,
                username: username.toString(),
                roomNumber: roomCode.toString(),
                isAdmin: type.toString() === "createRoom",
              },
            };
            const newHousie = {
              ...housie,
              roomNumber: roomCode.toString(),
              participants: response.data.users,
              numberStore: newStore,
            };
            socket.emit("entered", newHousie, updatedUser);
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
      <WinModal msg={exitMessage} logout={logout} handleWinModal={handleWinModal} open={winModal} />
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
            handleCurrentUser={handleCurrentUser}
          />
          <Participants
            handleAllowTalk={handleAllowTalk}
            currentUser={currentUser}
            housie={housie}
            handleCurrentUser={handleCurrentUser}
            handleHousie={handleHousie}
            emitTicketUpdate={emitTicketUpdate}
          />
        </>
      )}
    </div>
  );
}

export default App;
