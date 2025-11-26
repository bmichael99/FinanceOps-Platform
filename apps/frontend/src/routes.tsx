import App from './App'
import DashboardLayout from './layouts/DashboardLayout'
import HomeDashboardPage from './pages/dashboards/HomeDashboardPage'
import UploadInvoicePage from './pages/invoices/UploadInvoicePage'
import VerifyInvoicePage from './features/invoices/Verify/VerifyInvoicePage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import RequireAuth from './components/RequireAuth'
import Logout from './components/Logout'
import BrowseInvoicePage from './features/invoices/Browse/BrowseInvoicePage'

const routes : any[] = [
  //unprotected routes
  {
    path: "/",
    Component: App,
  },
  {
    path: "/sign-up",
    Component: SignupPage,
  },
  {
    path: "/log-in",
    Component: LoginPage,
  },
  {
    path: "/log-out",
    Component: Logout,
  },
  //protect routes
  {
    Component: RequireAuth,
    children: [
      {
        path: "/dashboard",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: HomeDashboardPage,
          },
          {
            path: "invoices",
            children: [
              {
                path:"upload",
                Component: UploadInvoicePage
              },
              {
                path:"verify",
                Component: VerifyInvoicePage
              },
              {
                path:"browse",
                Component: BrowseInvoicePage
              },
            ]
          },
        ]
      }
    ]


  }


]

export default routes