import { useState } from 'react';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images'
import ImageBlender from '../components/ImageBlender';
const DrawScreen = () => {

  const [selected, setSelected] = useState([0, 0, 0]);
  const [layer, setLayer] = useState(0);

  const select = (type, id) => {
    if (selected[type] === id) {
      selected[type] = 0;
      setLayer(layer - 1);
      setSelected([...selected]);
    } else if (selected[type] === 0) {
      setLayer(layer + 1);
      selected[type] = id;
      setSelected([...selected]);
    } else {
      selected[type] = id;
      setSelected([...selected]);
    }
  };

  const renderShapes = () => {
    const shapesList = [];
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[0] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[0] === i + 1 || selected[0] === 0 ? YellowLight[i] : Yellow[i]}
          onClick={() => select(0, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[1] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[1] === i + 1 || selected[1] === 0 ? PinkLight[i] : Pink[i]}
          onClick={() => select(1, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[2] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[2] === i + 1 || selected[2] === 0 ? BlueLight[i] : Blue[i]}
          onClick={() => select(2, i + 1)}
        />
      )
    }
    return shapesList;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <img className="w-14 h-14" src="/Avatar 2.svg" alt="image" />
        <div className="text-lg text-center text-white">Player 2 is waiting</div>
        <div className="flex justify-center my-8">
          <div className="border h-38 w-38 p-2 ml-14 mr-2"><ImageBlender selected={selected} /></div>
          <img className="h-24 w-14 mt-6" src={`/L${layer}.svg`} alt="level" />
        </div>
        <div className="grid grid-cols-4 my-2">
          {renderShapes()}
        </div>
        <img className="w-14 h-14" src="/Avatar 1.svg" alt="image" />
      </div>
    </div
    >
  )
}

export default DrawScreen;
