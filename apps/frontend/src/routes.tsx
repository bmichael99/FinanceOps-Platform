import App from './App'
import DashboardLayout from './layouts/DashboardLayout'
import UploadInvoicePage from './pages/invoices/UploadInvoicePage'
import VerifyInvoicePage from './features/invoices/Verify/VerifyInvoicePage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import RequireAuth from './components/RequireAuth'
import Logout from './components/Logout'
import BrowseInvoicePage from './features/invoices/Browse/BrowseInvoicePage'
import ViewInvoicePage from './features/invoices/Browse/ViewInvoicePage'
import HomePage from './features/application/Home/HomePage'
import CreateInvoicePage from './features/invoices/Create/CreateInvoicePage'

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
            Component: HomePage,
          },
          {
            path: "invoices",
            children: [
              {
                path:"upload",
                Component: UploadInvoicePage,
              },
              {
                path:"verify",
                Component: VerifyInvoicePage,
              },
              {
                path:"browse",
                Component: BrowseInvoicePage,
              },
              {
                path:"browse/:invoiceId", //since we don't use an outlet for this but we want the url to be under browse, we do not make this a child of browse.
                Component: ViewInvoicePage,
              },
              {
                path:"create",
                Component: CreateInvoicePage,
              },
            ]
          },
        ]
      }
    ]


  }


]

export default routes