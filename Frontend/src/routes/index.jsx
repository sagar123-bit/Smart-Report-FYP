import App from "@/App";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import MainHome from "@/pages/MainHome";
import PoliceDashboard from "@/pages/PoliceDashboard";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router";
import About from "@/pages/About";
import ReportCrime from "@/pages/ReportCrime";
import MyReports from "@/pages/MyReports";
import PDashboard from "@/pages/PDashboard";
import PAllReports from "@/pages/PAllReports";
import PAcceptedReports from "@/pages/PAcceptedReports";
import PChats from "@/pages/PChats";
import ADashboard from "@/pages/ADashboard";
import AReports from "@/pages/AReports";
import ACitizens from "@/pages/ACitizens";
import APolices from "@/pages/APolices";
import VerifyToken from "@/pages/VerifyToken";
import ChangePassword from "@/pages/ChangePassword";
import NotFoundPage from "@/pages/NotFound";


const router = createBrowserRouter([{
    path:'/',
    element:<App/>,
    children:[{
        path:"/",
        element:<MainHome/>,
        children:[{
            index:true,
            element:<Home/>
        },
        {
            path:"login",
            element:<Login/>
        },
        {
            path:"register",
            element:<Register/>
        },
        {
            path:"profile",
            element:<Profile/>
        },
        {
            path:"about",
            element:<About/>
        },
        {
            path:'reportcrime',
            element:<ReportCrime/>
        },
        {
            path:"myreport",
            element:<MyReports/>
        },
    ]
    },
    {
        path:"admindashboard",
        element:<AdminDashboard/>,
        children:[
            {
                index:true,
                element:<ADashboard/>
            },
            {
                path:"adminreports",
                element:<AReports/>
            },
            {
                path:"admincitizens",
                element:<ACitizens/>
            },
            {
                path:"adminpolice",
                element:<APolices/>
            },
            {
                path:"chats",
                element:<PChats/>
            }
        ]
    },
    {
        path:"policedashboard",
        element:<PoliceDashboard/>,
        children:[
            {
                index:true,
                element:<PDashboard/>
            },
            {
                path:"allreports",
                element:<PAllReports/>
            },
            {
                path:"acceptedreports",
                element:<PAcceptedReports/>
            },
            {
                path:"allreports",
                element:<PAllReports/>
            },
            {
                path:"chats",
                element:<PChats/>
            }
        ]
    },
    {
            path:"verifytoken",
            element:<VerifyToken/>
    },
    {
        path:"changepassword/:id",
        element:<ChangePassword/>
    },
    {
        path:"*",
        element:<NotFoundPage/>
    }
]
}]);
export default router;