import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { PersistGate } from "redux-persist/integration/react"
import { persistor, store } from "./redux/stores/store.ts"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
createRoot(document.getElementById("root")!).render(

  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider attribute="class"
        defaultTheme="dark"
        enableSystem>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
)
