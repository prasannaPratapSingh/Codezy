import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import AdminUpdate from "./components/AdminUpdate";
import UpdateProblem from "./components/UpdateProblem";
import Profile from "./components/Profile";
import ActualHome from "./pages/ActualHome";
import toast, { Toaster } from "react-hot-toast"
import socket from "./socket/socket";
import Contest from "./pages/Contest";
import ContestPage from "./pages/ContestPage";
import ReportBug from "./components/ReportBug";




function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
      console.log("Socket Connecting");

      //yeh connection event listen karega 
      socket.on('connect', () => {
        console.log("Sokcet connected", socket.id);
      })
      //user-solved-problem wale listen karega 
      socket.on('user-solved-problem', (data) => {
        toast.success(`${data.username} solved ${data.problemTitle} problem`, {
          duration: 3000
        });
      })
      return () => {
        socket.off('connect');
        socket.off('user-solved-problem');
        socket.disconnect();
      }

    }
  }, [isAuthenticated])



  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <>
      {/* <Navbar/> */}
      <Toaster />
      <ReportBug />
      <Routes>
        <Route path="/actualhome" element={<ActualHome />}></Route>
        <Route path="/" element={isAuthenticated ? <Homepage></Homepage> : <Navigate to="/actualhome" />}></Route>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}></Route>
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? <AdminUpdate /> : <Navigate to="/" />} />
        <Route path="/admin/update/final/:problemId" element={isAuthenticated && user?.role === 'admin' ? <UpdateProblem /> : <Navigate to="/" />} />
        <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/contest" element={isAuthenticated?<Contest/>:<Signup/>}></Route>
        <Route path="/contest/getContest/:id" element={<ContestPage/>} ></Route>
      </Routes>
    </>
  )
}

export default App;