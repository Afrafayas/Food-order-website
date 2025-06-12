
import './App.css'
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import RootLayout from './Layout/RootLayout';



function App() {
 

  return (
    <>
    <BrowserRouter>
   
    <Routes> 
       <Route element={<RootLayout />}>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/menu' element={<Menu/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route path='/contact' element={<ContactUs/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<ErrorPage/>}/>
      </Route> 
    </Routes>
    </BrowserRouter>  
    </>
  )
}

export default App
