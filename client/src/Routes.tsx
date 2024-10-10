import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserContext } from './contexts/userContext'
import MainDashBoardPage from './dashboards/MainDashBoardPage.tsx'
import LoginPage from './pages/users/LoginPage.tsx'
import UsersPage from './pages/users/UsersPage.tsx'
import MyVisitPage from './pages/visit/MyVisitPage.tsx'
import VisitAttendencePage from './pages/visit/VisitAttendencePage.tsx'
import VisitAdminPage from './pages/visit/VisitAdminPage.tsx'
import ResetPasswordDialog from './components/dialogs/users/ResetPasswordDialog.tsx'
import VisitDashboard from './dashboards/VisitDashboard.tsx'
import EmailVerifyPage from './pages/users/EmailVerifyPage.tsx'
import CompanyPage from './pages/companies/CompanyPage.tsx'



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
          {user?.assigned_permissions.includes('company_menu') &&
            < Route path="Company" >
              <Route index
                element={
                  <CompanyPage />
                }
              />

              <Route
                path="CompanyPage" element={
                  <CompanyPage />
                }
              />
            </Route>}
                

          {user?.assigned_permissions.includes('visits_menu') &&
            < Route path="Visit" >
              <Route index
                element={
                  <VisitDashboard />
                }
              />

              <Route
                path="MyVisitPage" element={
                  <MyVisitPage />
                }
              />
              <Route
                path="VisitAttendencePage" element={
                  <VisitAttendencePage />
                }
              />
              <Route
                path="VisitAdminPage" element={
                  <VisitAdminPage />
                }
              />

            </Route>}
        </Route>
      }

      <Route path="/ResetPassword/:token" element={<ResetPasswordDialog />} />
      <Route path="/VerifyEmail/:token" element={<EmailVerifyPage />} />
      {user && <Route path="*" element={<Navigate to="/" />} />}
      <Route path="*" element={<Navigate to="/Login" />} />

    </Routes >

  )
}

export default AppRoutes




