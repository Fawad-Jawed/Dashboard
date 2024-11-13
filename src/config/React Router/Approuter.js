import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "../../Pages/Home"
import LogIn from '../../Pages/LogIn'
import SignUp from '../../Pages/SignUp'
import Users from '../../Dashboard Screen/Users'
import Dashboard from '../../Dashboard Screen/Dashboard'
import Posts from '../../Dashboard Screen/Posts'
import Photos from '../../Dashboard Screen/Photos'
import Albums from '../../Dashboard Screen/Albums'
import Todos from '../../Dashboard Screen/Todos'
import Comments from '../../Dashboard Screen/Comments'
import Logout from '../../Dashboard Screen/LogOut'
import PostForm from '../../Dashboard Screen/Form Screen/PostForm'
import CommentsForm from '../../Dashboard Screen/Form Screen/CommentsForm'
import PhotosForm from '../../Dashboard Screen/Form Screen/PhotosForm'
import AlbumFormScreen from '../../Dashboard Screen/Form Screen/AlbumsForm'

export const Approuter = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/signup' element={<SignUp/>}/>
                <Route path='/login' element={<LogIn/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/users' element={<Users/>}/>
                <Route path='/posts' element={<Posts/>}/>
                <Route path='/photos' element={<Photos/>}/>
                <Route path='/photosform' element={<PhotosForm/>}/>
                <Route path='/albums' element={<Albums/>}/>
                <Route path='/albumsform' element={<AlbumFormScreen/>}/>
                <Route path='/Todos' element={<Todos/>}/>
                <Route path='/comments' element={<Comments/>}/>
                <Route path='/commentsform' element={<CommentsForm/>}/>
                <Route path='/logout' element={<Logout/>}/>
                <Route path='postform' element={<PostForm/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}
