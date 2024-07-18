import { useState, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { nameAtom, opponentNameAtom, opponentStateAtom, opponentScoreAtom, scoreAtom, resAtom, stateAtom } from '../data/atoms';
import { io } from 'socket.io-client';
import { Button, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2';
import DrawScreen from './DrawScreen';
import CopyScreen from './CopyScreen';

const HomeScreen = () => {
  const setOpponentState = useSetRecoilState(opponentStateAtom);
  const setState = useSetRecoilState(stateAtom);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [name, setName] = useRecoilState(nameAtom);
  const [opponentName, setOpponentName] = useRecoilState(opponentNameAtom);
  const [opponentScore, setOpponentScore] = useRecoilState(opponentScoreAtom);
  const [res, setRes] = useRecoilState(resAtom);
  const [socket, setSocket] = useState(null);
  const [gameOn, setGameOn] = useState(false);
  const [role, setRole] = useState('');
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (opponentName && role) {
      setGameOn(true);
    }
  }, [opponentName, role]);

  useEffect(() => {
    if (name && !socket) {
      const newSocket = io("https://photo-copy-backend.vercel.app:3000", {
        autoConnect: true,
      });

      newSocket.emit("request_to_play", {
        playerName: name,
      });

      setLoading(true);

      newSocket.on("OpponentFound", async (data) => {
        setLoading(false);
        setOpponentName(data.opponentName);
        setRole(data.role);
        await Swal.fire({
          title: "Opponent Found",
          text: `Opponent: ${data.opponentName}. Starting the game...`,
          icon: "info",
          showConfirmButton: false,
          timer: 2500
        });
      });

      newSocket.on("OpponentLeft", async () => {
        if (round) {
          await Swal.fire({
            title: "Opponent Left",
            showCancelButton: false,
          });
        }
        resetGame();
      });

      newSocket.on("Result", (data) => {
        setRes(data.res);
      });

      newSocket.on("StateFromServer", (data) => {
        setOpponentState(data.state);
      });

      setSocket(newSocket);
    }
  }, [name, socket]);

  const inputName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Please enter your name first.";
        }
      }
    });
    return result;
  };

  const playButton = async () => {
    const result = await inputName();
    if (!result.isConfirmed) {
      return;
    }
    setName(result.value);
  };

  const resetRound = () => {
    setRole((prevRole) => (prevRole === 'R1' ? 'R2' : 'R1'));
    setRound((prevRound) => prevRound + 1);
    setState([0, 0, 0]);
    setRes(null);
    setOpponentState([0, 0, 0]);
  };

  const resetGame = () => {
    window.location.reload();
  };

  const checkWinner = async () => {
    if (round >= 1) {
      if (opponentScore === 1) {
        await Swal.fire({
          title: "You lost the Game",
          icon: "error"
        });
        resetGame();
      }
      if (score === 1) {
        await Swal.fire({
          title: "You won the Game",
          icon: "success"
        });
        resetGame();
      }
    }
  };

  const result = async () => {
    if (res === false) {
      await Swal.fire({
        title: "You won the Round",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
      setScore((prevScore) => prevScore + 1);
    } else if (res === true) {
      await Swal.fire({
        title: "You lost the Round",
        icon: "error",
        showConfirmButton: false,
        timer: 1000,
      });
      setOpponentScore((prevScore) => prevScore + 1);
    }
    checkWinner();
    resetRound();
  };

  if (!gameOn) {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <CircularProgress />
            <p className="text-white text-3xl">Finding an opponent...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <img src="/Logo.png" className="w-64 mb-4" alt="logo" />
          <Button onClick={playButton} variant="outlined">Play</Button>
        </div>
      </div>
    );
  } else {
    if (res === null) {
      return role === 'R1' ? <DrawScreen socket={socket} /> : <CopyScreen socket={socket} />;
    } else {
      result();
      return null;
    }
  }
};

export default HomeScreen;
