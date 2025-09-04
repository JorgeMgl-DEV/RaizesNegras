import { Routes, Route } from "react-router-dom"
import Home from "./pages/HOME/Home.jsx"
import RegionPage from "./pages/REGIAO/RegionPage.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/regiao/:slug" element={<RegionPage />} />
    </Routes>
  )
}
