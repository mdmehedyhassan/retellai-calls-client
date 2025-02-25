
import { Route, Routes } from "react-router";
import Home from "./page/home/Home/Home";
import './App.css';
function App() {
  return (
    <div style={{fontFamily: '"Rubik", serif'}}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
