import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

//pages and components
import Registration from './pages/registration'
import Login from "./pages/login"
import Navbar from "./components/navBar"

function App() {

  return (
    <div className="App">
      <Router>
        <div className="pages">
          <Routes>
            <Route
              path="/register"
              element={<Registration />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
