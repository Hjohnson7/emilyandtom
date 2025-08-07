import MessageBoard from "../../components/messages/messageForm";
import React, {useEffect} from 'react'
import { useAuth } from "../../contexts/authContext"
import { useNavigate } from "react-router-dom"

const MessageScreen = () => {

    const {user} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
    }, [user])
    
    return <MessageBoard />
}

export default MessageScreen