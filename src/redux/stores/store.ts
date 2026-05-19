import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authReducer from '../slices/authSlice'
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore, type PersistConfig } from "redux-persist"

const rootReducer = combineReducers({
    auth: authReducer,
})

type RootReducerType = ReturnType<typeof rootReducer>

const persistConfig: PersistConfig<RootReducerType> = {
    key: "root",
    storage,
    whitelist: ["auth"],
}

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
)

export const store = configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<
    typeof store.getState
>

export type AppDispatch = typeof store.dispatch