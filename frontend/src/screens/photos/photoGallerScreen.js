import MultiPhotoUploader from "../../components/photoGallery/photoUploads"
import Gallery from "../../components/photoGallery/photoGallery"
import React, {useEffect} from 'react'
import { useAuth } from "../../contexts/authContext"
import { useNavigate } from "react-router-dom"

const PhotoGalleryScreen = () =>{

    const {user} = useAuth()
    const navigate = useNavigate()

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
    }, [user])

    return (
        <>
        <MultiPhotoUploader />
        <Gallery />
        </>
    )
}

export default PhotoGalleryScreen