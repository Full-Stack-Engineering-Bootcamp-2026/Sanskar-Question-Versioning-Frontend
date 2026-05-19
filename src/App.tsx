import {
  Route,
  Routes,
} from "react-router-dom"

import Login from "./pages/Login"

import NotFound from "./pages/NotFound"

import ProtectedRoute from "./components/ProtectedRoute"

import PublicRoute from "./components/PublicRoute"


import QuizList from "./pages/admin/QuizList"

import CreateQuiz from "./pages/admin/CreateQuiz"

import EditQuiz from "./pages/admin/EditQuiz"
import QuizCatalog from "./pages/user/QuizCatalog"

import AttemptQuiz from "./pages/user/AttemptQuiz"

import MyAttempts from "./pages/user/MyAttempts"

import AttemptDetails from "./pages/user/AttemptDetails"
import Questions from "./pages/admin/Questions"
import QuestionVersions from "./pages/admin/QuestionVersions"
import Layout from "./layouts/Layout"
import Register from "./pages/Register"
import { ToastContainer } from "react-toastify"
import CreateQuestion from "./pages/admin/CreateQuestion"
import EditQuestion from "./pages/admin/EditQuestion"


export function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

        <Route element={<ProtectedRoute />}>

          <Route element={<Layout />}>
            <Route
              path="/admin/dashboard"
              element={<QuizCatalog />}
            />

            <Route
              path="/admin/questions"
              element={<Questions />}
            />

            <Route
              path="/admin/questions/create"
              element={<CreateQuestion />}
            />
            <Route
              path="/admin/questions/:publicId/versions"
              element={<QuestionVersions />}
            />


            <Route
              path="/admin/quizzes"
              element={<QuizList />}
            />
            <Route
              path="/admin/questions/:publicId/edit"
              element={<EditQuestion />}
            />

            <Route
              path="/admin/quizzes/create"
              element={<CreateQuiz />}
            />

            <Route
              path="/admin/quizzes/:publicId/edit"
              element={<EditQuiz />}
            />
            <Route
              path="/quizzes"
              element={<QuizCatalog />}
            />

            <Route
              path="/quizzes/:publicId/attempt"
              element={<AttemptQuiz />}
            />

            <Route
              path="/attempts"
              element={<MyAttempts />}
            />

            <Route
              path="/attempts/:publicId"
              element={<AttemptDetails />}
            />
          </Route>

        </Route>

        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  )
}

export default App