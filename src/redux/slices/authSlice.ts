import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
    id: string
    name: string
    email: string
    role: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
}

interface LoginPayload {
    user: User
    token: string
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (
            state,
            action: PayloadAction<LoginPayload>
        ) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },

        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
})

export const { loginSuccess, logout } =
    authSlice.actions

export default authSlice.reducer