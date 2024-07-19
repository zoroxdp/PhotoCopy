import { useEffect, useState } from 'react';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { stateAtom, opponentNameAtom, opponentScoreAtom, scoreAtom } from '../data/atoms';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images';
import ImageBlender from '../components/ImageBlender';

const DrawScreen = ({ socket }) => {
  const [state, setState] = useRecoilState(stateAtom);
  const opponentName = useRecoilValue(opponentNameAtom);
  const score = useRecoilValue(scoreAtom);
  const opponentScore = useRecoilValue(opponentScoreAtom);
  const [layer, setLayer] = useState(0);
  const [isComplete, setComplete] = useState(false);
  const [wait, setWait] = useState(false);
  const [isSent, setSent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWait(true), 2500);

    setComplete(state.every(layer => layer !== 0));

    return () => clearTimeout(timer);
  }, [state]);

  const selectShape = (type, id) => {
    const newState = [...state];
    newState[type] = state[type] === id ? 0 : id;
    setLayer(layer + (state[type] === 0 ? 1 : -1));
    setState(newState);
  };

  const submitState = () => {
    socket.emit('StateFromClient', { state });
    setSent(true);
  };

  const renderShapes = (colors, lightColors, type) => {
    return colors.map((color, i) => (
      <img key={`${type}-${i}`}
        className={`w-20 h-20 ${state[type] === i + 1 ? 'border-4' : 'border'} p-2`}
        src={state[type] === i + 1 || state[type] === 0 ? lightColors[i] : color}
        onClick={() => selectShape(type, i + 1)} />
    ));
  };

  if (!isSent) {
    return wait ? (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl text-center text-white">{opponentName} is waiting...</div>
          <div className="flex justify-center my-8">
            <div className="border h-38 w-38 p-2 ml-12"><ImageBlender state={state} /></div>
            <img className="h-24 w-14 mt-6" src={`/L${layer}.svg`} alt="level" />
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
          <img src="/Submit.svg" className={`mt-4 mx-10 w-16 h-16 ${isComplete ? 'visible' : 'invisible'}`} onClick={submitState} />
        </div>
      </div>
    ) : (
      <div className="text-7xl font-bold text-white text-center">Draw</div>
    );
  } else {
    return (
      <div className="flex flex-col justify-center items-center">
        <DotLottieReact className="w-48 h-48" src="/Waiting.lottie" loop autoplay />
        <div className="text-white text-4xl text-center">Wait while {opponentName} is copying...</div>
      </div>
    );
  }
};

export default DrawScreen;
