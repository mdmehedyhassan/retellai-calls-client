
import { Route, Routes } from "react-router";
import Home from "./page/home/Home/Home";
import './App.css';
import AddData from "./page/data/AddData/AddData";
function App() {
  return (
    <div style={{fontFamily: '"Rubik", serif'}}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-data" element={<AddData />} />
      </Routes>
    </div>
  )
}

export default App
