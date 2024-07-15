import { useState } from 'react';
import ImageBlender from '../components/ImageBlender';
const PlayerOne = () => {

  const [stack, setStack] = useState(['/Circle-Board.svg']);
  const [layer, setLayer] = useState(0);

  const select = (img) => {
    if (stack.includes(img)) {
      const index = stack.indexOf(img);
      stack.splice(index, 1);
      setStack([...stack]);
      setLayer(stack.length - 1);
      console.log(stack.length);
      console.log(stack);
    } else {
      setLayer(stack.length);
      setStack([...stack, img]);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <img className="w-14 h-14" src="/Avatar 2.svg" alt="image" />
        <div className="text-white text-xl">Mohit is waiting, create your pattern.</div>
        <div className="flex ml-16 my-6">
          <div className="border h-42 w-42 p-2"><ImageBlender imageSources={stack} /></div>
          <img className="ml-10" src={`/L${layer}.svg`} alt="level" />
        </div>
        <div className="grid grid-cols-2 my-6">
          <img className="w-20 h-20 border p-2" src="/PinkLight1.svg" alt="pink1" onClick={() => select('PinkLight1.svg')} />
          <img className="w-20 h-20 border p-2" src="/PinkLight2.svg" alt="pink2" onClick={() => select('PinkLight2.svg')} />
          <img className="w-20 h-20 border p-2" src="/YellowLight1.svg" alt="yellow1" onClick={() => select('YellowLight1.svg')} />
          <img className="w-20 h-20 border p-2" src="/YellowLight2.svg" alt="yellow2" onClick={() => select('YellowLight2.svg')} />
          <img className="w-20 h-20 border p-2" src="/BlueLight1.svg" alt="blue1" onClick={() => select('BlueLight1.svg')} />
          <img className="w-20 h-20 border p-2" src="/BlueLight2.svg" alt="blue2" onClick={() => select('BlueLight2.svg')} />
        </div>
        <img className="w-14 h-14" src="/Avatar 1.svg" alt="image" />
      </div>
    </div>
  )
}

export default PlayerOne;
