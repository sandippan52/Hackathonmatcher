import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import CreateTeam from "./pages/CreateTeam"
import Profile from "./pages/Profile"
import Navbar from "./components/Navbar"
import Searchbar from "./components/Searchbar"

function App() {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<> <Navbar/> <Home/></>
    },
    {
      path:"/signup",
      element: <> <Navbar/> <Signup/> </>
    },
    {
      path:"/login",
      element: <> <Navbar/> <Login/> </>
    },
    {
      path:"/createteam",
      element: <> <Navbar/> <CreateTeam/> </>
    },
    {
      path:"/profile",
      element: <> <Navbar/> <Profile/> </>
    },

    {
      path:"/search",
      element:<> <Navbar/> <Searchbar/>  </>

    }

  ])

  return (
    <>
    
     <RouterProvider router={router}/>
    </>
  )
}

export default App
