
import { Route, Routes } from "react-router";
import Home from "./page/home/Home/Home";
import './App.css';
function App() {
  return (
    <div className="font-[Inter]">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
