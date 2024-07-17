import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { stateAtom, opponentNameAtom } from '../data/atoms';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images'
import ImageBlender from '../components/ImageBlender';

const DrawScreen = () => {

  const [state, setState] = useRecoilState(stateAtom);
  const opponentName = useRecoilValue(opponentNameAtom);
  const [layer, setLayer] = useState(0);
  const [isComplete, setComplete] = useState(false);
  const [wait3, setWait3] = useState(false);

  useEffect(() => {
    console.log(state);
    setTimeout(() => {
      setWait3(true);
    }, 3000);
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
    console.log("Hello");
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

  if (wait3) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center">
          <div className="text-4xl text-center text-white">{opponentName} is waiting...</div>
          <div className="flex justify-center my-8">
            <div className="border h-38 w-38 p-2 ml-12"><ImageBlender state={state} /></div>
            <img className="h-24 w-14 mt-6" src={`/L${layer}.svg`} alt="level" />
          </div>
          <div className="grid grid-cols-4 my-2">
            {renderShapes()}
          </div>
          <img src="/Submit.svg" className={`mt-4 w-16 h-16 ${isComplete ? 'visible' : 'invisible'}`} onClick={submit} />
        </div>
      </div
      >
    )
  } else {
    return <div className="text-7xl font-bond text-white text-center">Draw Now</div>;
  }
}

export default DrawScreen;
