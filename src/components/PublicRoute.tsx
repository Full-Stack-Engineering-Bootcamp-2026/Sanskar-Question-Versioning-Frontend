import type { RootState } from "@/redux/stores/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PublicRoute = () => {
    const token = useSelector((state: RootState) => state.auth.token)
    if (token)
        <Navigate to="/" replace />
    return <Outlet />
}

export default PublicRoute