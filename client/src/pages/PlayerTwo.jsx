const PlayerTwo = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center">
        <img className="w-14 h-14" src="/Avatar 1.svg" alt="image" />
        <div className="flex my-8">
          <img className="border-2 p-2 w-36 h-36" src="/Circle-Board.svg" alt="image" />
          <img className="mx-2" src="/L0.svg" alt="level" />
          <img className="border-2 p-2 w-36 h-36" src="/Circle-Board.svg" alt="image" />
        </div>
        <div className="grid grid-cols-4 my-4">
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/PinkLight1.svg" alt="pink1" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/PinkLight2.svg" alt="pink2" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/PinkLight3.svg" alt="pink3" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/PinkLight4.svg" alt="pink4" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/YellowLight1.svg" alt="yellow1" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/YellowLight2.svg" alt="yellow2" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/YellowLight3.svg" alt="yellow3" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/YellowLight4.svg" alt="yellow4" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/BlueLight1.svg" alt="blue1" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/BlueLight2.svg" alt="blue2" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/BlueLight3.svg" alt="blue3" /></button>
          <button onClick={() => { alert('clicked') }}><img className="w-20 h-20 border p-2" src="/BlueLight4.svg" alt="blue4" /></button>
        </div>
        <img className="w-14 h-14" src="/Avatar 2.svg" alt="image" />
      </div>
    </div>
  )
}

export default PlayerTwo;
