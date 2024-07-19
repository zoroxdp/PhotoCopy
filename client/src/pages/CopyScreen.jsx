import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { stateAtom, opponentNameAtom, opponentStateAtom, opponentScoreAtom, scoreAtom, resAtom } from '../data/atoms';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images';
import ImageBlender from '../components/ImageBlender';

const CopyScreen = ({ socket }) => {
  const [state, setState] = useRecoilState(stateAtom);
  const opponentName = useRecoilValue(opponentNameAtom);
  const setRes = useSetRecoilState(resAtom);
  const opponentState = useRecoilValue(opponentStateAtom);
  const opponentScore = useRecoilValue(opponentScoreAtom);
  const score = useRecoilValue(scoreAtom);
  const [isReceived, setIsReceived] = useState(false);
  const [layer, setLayer] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    if (opponentState.every(layer => layer !== 0)) {
      setIsReceived(true);
      setTimeout(() => setWait(true), 2500);
    }
  }, [opponentState]);

  useEffect(() => {
    setIsComplete(state.every(layer => layer !== 0));
  }, [state]);

  const selectShape = (type, id) => {
    const newState = [...state];
    newState[type] = state[type] === id ? 0 : id;
    setLayer(layer + (state[type] === 0 ? 1 : -1));
    setState(newState);
  };

  const fail = () => {
    socket.emit("Result", { res: false });
    setRes(true);
  }

  const submitState = () => {
    const isMatch = opponentState.toString() === state.toString();
    socket.emit("Result", { res: isMatch });
    setRes(!isMatch);
  };

  const renderShapes = (colors, lightColors, type) => {
    return colors.map((color, i) => (
      <img key={`${type}-${i}`}
        className={`w-20 h-20 ${state[type] === i + 1 ? 'border-4' : 'border'} p-2`}
        src={state[type] === i + 1 || state[type] === 0 ? lightColors[i] : color}
        onClick={() => selectShape(type, i + 1)}
      />
    ));
  };

  if (!isReceived) {
    return (
      <div className="flex flex-col justify-center items-center">
        <DotLottieReact className="w-48 h-48" src="/Waiting.lottie" loop autoplay />
        <div className="text-white text-4xl text-center">Wait while {opponentName} is drawing...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        {wait ? (
          <>
            <div className="text-4xl text-center text-white">Copy the Pattern</div>
            <div className="mt-6">
              <CountdownCircleTimer
                isPlaying
                duration={30}
                colors={['#80ff80', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[30, 20, 10, 0]}
                size={80}
                strokeWidth={8}
                onComplete={fail}
              >
                {({ remainingTime }) => <div className="text-4xl text-center text-white">{remainingTime}</div>}
              </CountdownCircleTimer>
            </div>
            <div className="flex justify-center my-8">
              <div className="border h-38 w-38 p-2"><ImageBlender state={opponentState} /></div>
              <img className="h-24 w-14 mt-6" src={`/L${layer}.svg`} alt="level" />
              <div className="border h-38 w-38 p-2 ml"><ImageBlender state={state} /></div>
            </div>
            <div className="grid grid-cols-4 my-2">
              {renderShapes(Yellow, YellowLight, 0)}
              {renderShapes(Pink, PinkLight, 1)}
              {renderShapes(Blue, BlueLight, 2)}
            </div>
            <div className="flex justify-center items-center gap-x-24">
              <div className="text-4xl text-center text-white">You: {score}</div>
              <div className="text-4xl text-center text-white">{opponentScore} :{opponentName}</div>
            </div>
            <img src="/Submit.svg" className={`mt-4 w-16 h-16 ${isComplete ? 'visible' : 'invisible'}`} onClick={submitState} />
          </>
        ) : (
          <div className="text-7xl font-bold text-white text-center">Copy</div>
        )}
      </div>
    </div>
  );
};

export default CopyScreen;
