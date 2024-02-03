import { Routes, Route } from "react-router-dom";
import { NavBar } from "./Components/navbar";
import { Home } from "./Pages/Home";
import { AuthContextProvider } from "./Context/AuthContext";
import Login from "./Pages/Login";
import SignUp from "./Pages/signUp";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Account from "./Pages/Account";


function App() {
  return (
    <>
      <AuthContextProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/account" element={
            <ProtectedRoutes>
              <Account />
            </ProtectedRoutes>
          }></Route>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
