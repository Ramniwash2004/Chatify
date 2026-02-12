import toast from 'react-hot-toast';
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useChatStore=create((set,get)=>({
    allContacts:[],
    chats:[],
    message:[],
    activeTab:"chats",
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    //set the sound preference based on localStorage value, default to true if not set
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    //set sound preference and save to localStorage
    toggleSound:()=>{
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);//get().isSoundEnabled → current state
        set({isSoundEnabled:!get().isSoundEnabled});
    },

    setActiveTab:(tab)=>set({activeTab:tab}),

    setSelectedUser:(user)=>set({selectedUser:user}),

    getAllContacts:async()=>{
        set({isUserLoading:true});
        try{
            const res =await axiosInstance.get("/messages/contacts");
            set({allContacts:res.data});
        }catch(error){
            console.error("Error fetching contacts:",error);
            toast.error(error.response?.data?.message || "Failed to fetch contacts");
        }finally{
            set({isUserLoading:false});
        }
    },

    getMyChatPartners:async()=>{
        set({isUserLoading:true});
        try{
            const res=await axiosInstance.get("/messages/chats");
            set({chats:res.data});
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch chat partners");
        }finally{
            set({isUserLoading:false});
        }
    }
}))