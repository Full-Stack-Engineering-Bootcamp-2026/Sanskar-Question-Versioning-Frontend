import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { PersistGate } from "redux-persist/integration/react"
import { persistor, store } from "./redux/stores/store.ts"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
