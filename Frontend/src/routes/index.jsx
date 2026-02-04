import App from "@/App";
import NoUserPublicRoute from "@/components/NoUserPublicRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import About from "@/pages/About";
import ACitizens from "@/pages/ACitizens";
import ADashboard from "@/pages/ADashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import APolices from "@/pages/APolices";
import AReports from "@/pages/AReports";
import AVerifyPolice from "@/pages/AVerifyPolice";
import ChangePassword from "@/pages/ChangePassword";
import CitizenChat from "@/pages/CitizenChat";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MainHome from "@/pages/MainHome";
import MyReports from "@/pages/MyReports";
import NotFoundPage from "@/pages/NotFound";
import PAcceptedReports from "@/pages/PAcceptedReports";
import PAllReports from "@/pages/PAllReports";
import PChats from "@/pages/PChats";
import PDashboard from "@/pages/PDashboard";
import PoliceDashboard from "@/pages/PoliceDashboard";
import PoliceProfile from "@/pages/PoliceProfile";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import ReportCrime from "@/pages/ReportCrime";
import VerifyToken from "@/pages/VerifyToken";
import { createBrowserRouter } from "react-router";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainHome />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute isPublicRoute={true}>
                <Home />
              </ProtectedRoute>
            )
          },
          {
            path: "login",
            element: (
              <NoUserPublicRoute>
                <Login />
              </NoUserPublicRoute>
            )
          },
          {
            path: "register",
            element: (
              <NoUserPublicRoute>
                <Register />
              </NoUserPublicRoute>
            )
          },
          {
            path: "about",
            element: (
              <ProtectedRoute isPublicRoute={true}>
                <About />
              </ProtectedRoute>
            )
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute allowedRoles={["citizen"]}>
                <Profile />
              </ProtectedRoute>
            )
          },
          {
            path: "reportcrime",
            element: (
              <ProtectedRoute allowedRoles={["citizen"]}>
                <ReportCrime />
              </ProtectedRoute>
            )
          },
          {
            path: "myreport",
            element: (
              <ProtectedRoute allowedRoles={["citizen"]}>
                <MyReports />
              </ProtectedRoute>
            )
          },
          {
            path: "report-chat",
            element: (
              <ProtectedRoute allowedRoles={["citizen"]}>
                <CitizenChat />
              </ProtectedRoute>
            )
          }
        ]
      },
      {
        path: "admindashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ADashboard />
          },
          {
            path: "adminreports",
            element: <AReports />
          },
          {
            path: "admincitizens",
            element: <ACitizens />
          },
          {
            path: "adminpolice",
            element: <APolices />
          },
          {
            path: "verify-police",
            element: <AVerifyPolice />
          }
        ]
      },
      {
        path: "policedashboard",
        element: (
          <ProtectedRoute allowedRoles={["police"]}>
            <PoliceDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <PDashboard />
          },
          {
            path: "allreports",
            element: <PAllReports />
          },
          {
            path: "acceptedreports",
            element: <PAcceptedReports />
          },
          {
            path: "chats",
            element: <PChats />
          },
          {
            path: "profile-setting",
            element: <PoliceProfile />
          }
        ]
      },
      {
        path: "verifytoken",
        element: (
          <NoUserPublicRoute>
            <VerifyToken />
          </NoUserPublicRoute>
        )
      },
      {
        path: "changepassword/:id",
        element: (
          <NoUserPublicRoute>
            <ChangePassword />
          </NoUserPublicRoute>
        )
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);

export default router;