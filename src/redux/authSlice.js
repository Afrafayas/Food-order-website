import { createSlice } from "@reduxjs/toolkit";


const initial = JSON.parse(localStorage.getItem('auth') ) ||{
    isAuthenticated : false,
    user:null,//{username:'admin',role:'admin'}
}

const authSlice = createSlice({
    name :'auth',
    initialState :initial,
    reducers:{
        login:(state,action)=>{
            const {username,role} = action.payload
            state.isAuthenticated = true
            state.user = {username,role}
            localStorage.setItem('auth',JSON.stringify(state))
        },

        
        logout: (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('auth');
        }
    }
            
})

export const {login,logout}=authSlice.actions
export default authSlice.reducer