import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_API_URL=import.meta.env.MODE === 'development' ? "http://localhost:3000" : "/";

export const useAuthStore =create((set,get)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    checkAuth : async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();
        }catch(error){
            console.error("Error checking auth:",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        }catch(error){
            toast.error(error.response?.data?.message || "Error signing up");
            set({isSigningUp:false});
        }finally{
            set({isSigningUp:false});
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Login successful");
            get().connectSocket();
        }catch(error){
            set({authUser:null});
            toast.error(error.response?.data?.message || "Error logging in");
        }finally{
            set({isLoggingIn:false});
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){
            toast.error("Error logging out");
            console.error("Error logging out:",error);
        }
    },
    updateProfile:async(data)=>{
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        }catch(error){
            toast.error(error.response?.data?.message || "Error updating profile");
            console.error("Error updating profile:",error);
        }
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return ;

        const socket=io(BASE_API_URL,{
            withCredentials:true, //this ensures that cookies are sent with the socket connection
        })
        socket.connect();
        set({socket});

        //listen for online users events
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});  //online users are stored as array of userIds in the state
        });
    },

    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
        set({socket:null});
    },
    
}));