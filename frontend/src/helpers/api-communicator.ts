import { axiosInstance } from "../lib/axios";
export const loginUser=async(email:string,password:string)=>{
    const res=await axiosInstance.post("/user/login",{email,password});
    if(res.status!=200){
        throw new Error("Failed to login");
    } 
    return res.data;
}
export const signupUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await axiosInstance.post("/user/signup", { username, email, password });
  if (res.status !== 200) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axiosInstance.get("/user/check-auth");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};
export const logoutUser = async () => {
  const res = await axiosInstance.post("/user/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};
export const getAllTheUsers=async()=>{
  const res=await axiosInstance.get("/chat")
  if(res.status!=200){
    throw new Error("Unable to fetch users")
  }
  const data=await res.data
  return data
}
export const sendMessage=async(chatId:string,content:string)=>{
  const res=await axiosInstance.post(`/chat/${chatId}`,{content})
  if(res.status!=200){
    throw new Error("Unable to send message")
  }
  const data=await res.data
  return data
}
export const getConversations=async(chatId:string)=>{
  const res=await axiosInstance.get(`/chat/${chatId}`)
  if(res.status!=200){
    throw new Error("Unable to fetch conversations")
  }
  const data=await res.data
  return data
}