import React, { children } from 'react'
import AdminPanel from '../components/AdminPanel'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const AdminRoutes = ({children}) => {

    const {isAuthenticated,user} = useSelector(state=>state.auth)

    if(!isAuthenticated){
        return <Navigate to = '/login'/>
    }
    if(user.role !=='admin'){
        return <Navigate to = '/'/>
    }
  return children
}

export default AdminRoutes