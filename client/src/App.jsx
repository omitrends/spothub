import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import the AuthProvider
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './../pages/Login';
import SignUp from '../pages/SignUp';
import Home from './../pages/Home';
import LostItem from './../pages/LostItem';
import FoundItem from './../pages/FoundItem';
import AboutUs from './../pages/AboutUs';
import ReportLost from './../pages/ReportLost';
import ReportFound from './../pages/ReportFound';
import Admin from './../pages/Admin';
import ForgotPassword from '../pages/ForgotPassword';
import User from './../pages/User';
import EditItem from './../pages/EditItem';
import VerifyEmail from '../pages/VerifyEmail';

// Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthSuccess from '../pages/AuthSuccess';

function Layout({ children }) {
  const location = useLocation();

  // Hide footer on these routes
  const hideFooterRoutes = ['/login', '/signup', '/forgot-password'];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">{children}</div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <ToastContainer position="top-right" autoClose={3000} theme="light" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/found-item" element={<FoundItem />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/lost-item" element={<LostItem />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/edit-item/:id" element={<EditItem />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
