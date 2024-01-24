import './App.css';
import Homepage from './components/Homepage';
import RegisterStudent from "./components/RegisterStudent"
import LoginStudent from './components/LoginStudent';
import {Routes,Route} from "react-router-dom"
import Navbar from './components/Navbar';
import EmailVerificationPage from "./components/EmailVerificationPage"
import SuccessPage from './components/SuccessPage'
import UserDashboard from './components/UserDashboard';
import NotFoundPage from './components/NotFoundPage';

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element ={<Homepage/>} />
        <Route path='/registerStudent' element = {<RegisterStudent/>} />
        <Route path='/loginStudent' element = {<LoginStudent/>} />
        <Route path='/verify/:id/:token' element = {<EmailVerificationPage/>}/>
        <Route path='/successPage' element={<SuccessPage />} />
        <Route path='/student/:userId' element = {<UserDashboard/>}/>
        <Route path='*' element = {<NotFoundPage requestedUrl = {window.location.href}/>} />

      </Routes>
    </div>
  );
}

export default App;
