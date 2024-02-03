import { Link, useNavigate } from "react-router-dom"
import { UserAuth } from "../Context/AuthContext"
export const NavBar = () => {
  const { user, logOut } = UserAuth()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logOut()
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex items-center justify-between p-4 z-[400] absolute w-full">
      <Link to="/">
        <h1 className="text-red-600 text-4xl font-bold cursor-pointer" >NETFLIX</h1>
      </Link>
      {
        user?.email ? (
          <div>
            <Link to="/account">
              <button className="text-white pr-4 text-l border-slate-100">Account</button>
            </Link>

            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded cursor-pointer text-white text-l">Log Out</button>

          </div>
        ) : (
          <div>
            <Link to="/login">
              <button className="text-white pr-4 text-l border-slate-100">Sign in</button>
            </Link>
            <Link to="/signup">
              <button className="bg-red-600 px-4 py-2 rounded cursor-pointer text-white text-l">Sign Up</button>
            </Link>
          </div>
        )
      }
    </div>
  )
}