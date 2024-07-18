import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import Swal from 'sweetalert2';
import { stateAtom, opponentNameAtom, opponentStateAtom, opponentScoreAtom, scoreAtom } from '../data/atoms';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images'
import ImageBlender from '../components/ImageBlender';

const CopyScreen = ({ socket }) => {

  const [state, setState] = useRecoilState(stateAtom);
  const opponentName = useRecoilValue(opponentNameAtom);
  const opponentState = useRecoilValue(opponentStateAtom);
  const [opponentScore, setOpponentScore] = useRecoilState(opponentScoreAtom);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [received, setReceived] = useState(false);
  const [layer, setLayer] = useState(0);
  const [isComplete, setComplete] = useState(false);
  const [skipCount, setSkipCount] = useState(true);

  useEffect(() => {
    if (skipCount) setSkipCount(false);
    if (!skipCount) setReceived(true);
  }, [opponentState]);

  useEffect(() => {
    if (state[0] !== 0 && state[1] !== 0 && state[2] !== 0) {
      setComplete(true);
    } else {
      setComplete(false);
    }
  }, [state]);

  const select = (type, id) => {
    if (state[type] === id) {
      const newState = [...state];
      newState[type] = 0;
      setLayer(layer - 1);
      setState(newState);
    } else if (state[type] === 0) {
      const newState = [...state];
      newState[type] = id;
      setLayer(layer + 1);
      setState(newState);
    } else {
      const newState = [...state];
      newState[type] = id;
      setState(newState);
    }
  };

  const submit = () => {
    const flag = opponentState.toString() == state.toString();
    if (flag === true) {
      socket.socket.emit("Result", { res: true })
      setScore(score + 1);
      Swal.fire({
        title: "You got it right",
        icon: "success"
      });
    } else {
      socket.socket.emit("Result", { res: false })
      setOpponentScore(opponentScore + 1);
      Swal.fire({
        title: "You got it wrong",
        icon: "error"
      })
    }
  }

  const renderShapes = () => {
    const shapesList = [];
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img key={i} className={`w-20 h-20 ${state[0] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={state[0] === i + 1 || state[0] === 0 ? YellowLight[i] : Yellow[i]}
          onClick={() => select(0, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img key={4 + i} className={`w-20 h-20 ${state[1] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={state[1] === i + 1 || state[1] === 0 ? PinkLight[i] : Pink[i]}
          onClick={() => select(1, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img key={8 + i} className={`w-20 h-20 ${state[2] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={state[2] === i + 1 || state[2] === 0 ? BlueLight[i] : Blue[i]}
          onClick={() => select(2, i + 1)}
        />
      )
    }
    return shapesList;
  }

  if (received === true) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl text-center text-white">Copy It...</div>
          <div className="flex justify-center my-8">
            <div className="border h-38 w-38 p-2"><ImageBlender state={opponentState} /></div>
            <img className="h-24 w-14 mt-6" src={`/L${layer}.svg`} alt="level" />
            <div className="border h-38 w-38 p-2 ml"><ImageBlender state={state} /></div>
          </div>
          <div className="grid grid-cols-4 my-2">
            {renderShapes()}
          </div>
          <img src="/Submit.svg" className={`mt-4 w-16 h-16 ${isComplete ? 'visible' : 'invisible'}`} onClick={submit} />
        </div>
      </div
      >
    )
  }
  else if (received === false) {
    return (
      <div className='flex flex-col justify-center items-center'>
        <DotLottieReact className="w-48 h-48" src="/Waiting.lottie" loop autoplay />
        <div className="text-white text-4xl text-center">Wait while {opponentName} is drawing...</div>
      </div>
    )
  }
}

export default CopyScreen;
