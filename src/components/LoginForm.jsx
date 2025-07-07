import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/authSlice'
import { Navigate, useNavigate } from 'react-router-dom'


const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {isAuthenticated,user} = useSelector(state=>state.auth)

     if (isAuthenticated && user.role === 'admin') {
    return <Navigate to="/admin-panel" />;
  }
  if (isAuthenticated && user.role === 'user') {
    return <Navigate to="/user-panel" />;
  }


 
    const handleSubmit=(e)=>{
    e.preventDefault()
    
    const username = e.target.username.value
    const password = e.target.password.value
    // console.log(username,password,'test')

    if(username === 'admin' && password === '1234' ){
        dispatch(login({username,role:'admin'}) )
        navigate('/admin-panel')
    }
    else if(username ==="user" && password === '1234'   ) {
        dispatch(login({username,role:'user'}))
        navigate('/')
    }

    else{
        alert('Invalid Credentials')
    }

}
  return (
    <>
    <h2>Login</h2>  
    <form  onSubmit={handleSubmit}>
        <input name='username'  type='text' placeholder='username' required/>
        <input name='password' type="password" required />
        <button type="submit">Login</button>
    </form>
    </>
  )
}

export default LoginForm