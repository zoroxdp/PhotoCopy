import React from 'react'

const PlayerOne = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <img className="w-14 h-14" src="/Avatar 2.svg" alt="image" />
        <div className="text-white text-xl">Mohit is waiting, create your pattern.</div>
        <div className="flex ml-16 my-8">
          <img className="border-2 p-2 w-32 h-32" src="/Circle-Board.svg" alt="image" />
          <img className="ml-10" src="/L0.svg" alt="level" />
        </div>
        <div className="grid grid-cols-2 my-8">
          <img className="w-16 h-16 border p-2" src="/YellowLight1.svg" alt="yellow1" />
          <img className="w-16 h-16 border p-2" src="/YellowLight2.svg" alt="yellow2" />
          <img className="w-16 h-16 border p-2" src="/PinkLight1.svg" alt="pink1" />
          <img className="w-16 h-16 border p-2" src="/PinkLight2.svg" alt="pink2" />
          <img className="w-16 h-16 border p-2" src="/BlueLight1.svg" alt="blue1" />
          <img className="w-16 h-16 border p-2" src="/BlueLight2.svg" alt="blue2" />
        </div>
        <img className="w-14 h-14" src="/Avatar 1.svg" alt="image" />
      </div>
    </div>
  )
}

export default PlayerOne;
