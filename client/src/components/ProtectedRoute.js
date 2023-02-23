import React from 'react'
import { useEffect } from 'react'
import { GetCurrentUser } from '../apicalls/users'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { HideLoader, ShowLoader } from '../redux/loaderSlice'
import { SetUser } from '../redux/userSlice'

const ProtectedRoute = ({ children }) => {
  const {user} = useSelector(state => state.userReducer)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader())
      const response = await GetCurrentUser();
      dispatch(HideLoader())
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        dispatch(HideLoader())
        toast.error(response.message);
        navigate('/login')       
      }
    } catch (error) {
      toast.error(error.message);
      navigate('/login')
    }
  }       

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    }
  }, [])

  return (
    <div className='h-screen w-screen bg-gray-100 p-2'> 
      
      <div className='flex justify-between p-5'>
        <div className='flex items=center gap-1'>
            <i className="ri-message-3-line text-2xl"></i>
            <h1 className="text primary text-2xl uppercase font-bold">Chat</h1>
        </div>
        <div className='flex gap-1 text-ml'>
            <i class="ri-shield-user-line"></i>
            <h1 className='underline'>{user?.name}</h1>
        </div>
      </div>

      <div className='p-5'>{children}</div>
    </div>
  )
}

export default ProtectedRoute