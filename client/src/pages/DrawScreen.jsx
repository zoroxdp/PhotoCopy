import { useState } from 'react';
import { Yellow, YellowLight, Blue, BlueLight, Pink, PinkLight } from '../data/images'
import ImageBlender from '../components/ImageBlender';
const DrawScreen = () => {

  const [stack, setStack] = useState([]);
  const [selected, setSelected] = useState([0, 0, 0, 0]);

  const select = (img, type, id) => {
    if (stack.includes(img)) {
      const index = stack.indexOf(img);
      stack.splice(index, 1);
      setSelected(() => {
        const newSelected = [...selected];
        newSelected[type] = 0;
        return newSelected;
      });
      setStack([...stack]);
    } else {
      setSelected(() => {
        const newSelected = [...selected];
        newSelected[type] = id;
        return newSelected;
      });
      setStack([...stack, img]);
    }
  }

  const renderShapes = () => {
    const shapesList = [];
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[1] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[1] === i + 1 || selected[1] === 0 ? YellowLight[i] : Yellow[i]}
          onClick={() => select(YellowLight[i], 1, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[2] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[2] === i + 1 || selected[2] === 0 ? PinkLight[i] : Pink[i]}
          onClick={() => select(PinkLight[i], 2, i + 1)}
        />
      )
    }
    for (let i = 0; i <= 3; i++) {
      shapesList.push(
        <img className={`w-20 h-20 ${selected[3] === i + 1 ? 'border-4' : 'border'} p-2`}
          src={selected[3] === i + 1 || selected[3] === 0 ? BlueLight[i] : Blue[i]}
          onClick={() => select(BlueLight[i], 3, i + 1)}
        />
      )
    }
    return shapesList;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <img className="w-14 h-14" src="/Avatar 2.svg" alt="image" />
        <div className="flex my-8">
          <div className="border h-40 w-40 p-2"><ImageBlender imageSources={stack} /></div>
          <img className="mx-2" src={`/L${stack.length}.svg`} alt="level" />
        </div>
        <div className="grid grid-cols-4 my-4">
          {renderShapes()}
        </div>
        <img className="w-14 h-14" src="/Avatar 1.svg" alt="image" />
      </div>
    </div
    >
  )
}

export default DrawScreen;
