import { Navigate } from "react-router-dom"
import { UserAuth } from "../Context/AuthContext"
const ProtectedRoutes = ({ children }) => {
    const {user} = UserAuth()
    if (!user) {
        return <Navigate to="/" />

    } else {
        return children
    }

}

export default ProtectedRoutes