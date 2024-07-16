import DrawScreen from './pages/DrawScreen';
import GuessScreen from './pages/GuessScreen';

const App = () => {
  return (
    <div className="flex justify-center bg-slate-950 h-screen">
      <div className="m-20"><DrawScreen /></div>
      <div className="m-20"><GuessScreen /></div>
    </div>
  )
}

export default App;
