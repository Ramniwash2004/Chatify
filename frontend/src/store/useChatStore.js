import toast from 'react-hot-toast';
import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore=create((set,get)=>({
    allContacts:[],
    chats:[],
    messages:[],
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
    },

    getMessagesByUserId:async(userId)=>{
        set({isMessageLoading:true});
        try{
            const res =await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        }catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        }finally{
            set({isMessageLoading:false});
        }
    },
    
    sendMessage:async(messageData)=>{
        const {selectedUser,messages} = get();
        const {authUser}=useAuthStore.getState();

        const tempId=`temp-${Date.now()}`;//temporary id for optimistic UI update
        const optimisticMessage={
            _id:tempId,
            sender:authUser._id,
            receiverId:selectedUser._id,
            text:messageData.text,
            image:messageData.image,
            createdAt:new Date().toISOString(),
        };
        //imimediately add the message to the UI before getting response from server (optimistic update)
        set({messages:[...messages,optimisticMessage]});

        try{
            const res =await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
            // or set({messages:messages.concat(res.data)});
        }catch(error){
           // remove optimistic message on failure
            set({ messages: messages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
    
}))