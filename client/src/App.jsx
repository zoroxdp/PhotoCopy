import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import DrawScreen from './pages/DrawScreen';
import CopyScreen from './pages/CopyScreen';
import HomeScreen from './pages/HomeScreen';

export default function App() {

  return (
    <div className="bg-slate-950 flex flex-col justify-center items-center h-screen">
      <RecoilRoot>
        <HomeScreen />
      </RecoilRoot>
    </div>
  );
}
