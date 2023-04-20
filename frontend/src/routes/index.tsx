import {BrowserRouter, Route, Routes} from "react-router-dom";
import Game from "../pages/game/game";
import Home from "../pages/home/home";


const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={":roomID"} element={<Game/>} />
      </Routes>
    </BrowserRouter>
  )
}
export default RoutesApp