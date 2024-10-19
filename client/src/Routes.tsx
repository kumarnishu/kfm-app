import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import LoginPage from './pages/users/LoginPage.tsx'
import UsersPage from './pages/users/UsersPage.tsx'
import ResetPasswordDialog from './components/dialogs/users/ResetPasswordDialog.tsx'
import EmailVerifyPage from './pages/users/EmailVerifyPage.tsx'



function AppRoutes() {
  const { user } = useContext(UserContext)

  return (
    <Routes >
      {
        !user && <Route path="/Login" element={<LoginPage />} />}
      {
        user && <Route path="/"
          element={
            <MainDashBoardPage />
          }>

          {user?.is_admin &&
            < Route path="Users">
              <Route index
                element={
                  <UsersPage />
                }
              />
            </Route>}

        </Route>
      }

      <Route path="/password/reset/:token" element={<ResetPasswordDialog />} />
      <Route path="/email/verify/:token" element={<EmailVerifyPage />} />
      {user && <Route path="*" element={<Navigate to="/" />} />}
      <Route path="*" element={<Navigate to="/Login" />} />

    </Routes >

  )
}

export default AppRoutes




