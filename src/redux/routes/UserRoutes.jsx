import React, { children } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const UserRoutes = ({children}) => {

    const {isAuthenticated,user} = useSelector(state=>state.auth)
     if(!isAuthenticated){
            return <Navigate to = '/'/>
        }
    if(user.role !=='user'){
        return <Navigate to = '/admin-panel'/>
    }
  return children
}

export default UserRoutes