import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import UsersPage from './pages/UsersPage.tsx'
import ResetPasswordDialog from './components/dialogs/users/ResetPasswordDialog.tsx'
import LoginPage from './pages/LoginPage.tsx'
import EmailVerifyPage from './pages/EmailVerifyPage.tsx'
import CustomersPage from './pages/CustomersPage.tsx'



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
          {user?.is_admin &&
            < Route path="Customer">
              <Route index
                element={
                  <CustomersPage />
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




