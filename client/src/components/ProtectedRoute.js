import React from 'react'
import { useEffect } from 'react'
import { GetCurrentUser } from '../apicalls/users'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { HideLoader, ShowLoader } from '../redux/loaderSlice'

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader())
      const response = await GetCurrentUser();
      dispatch(HideLoader())
      if (response.success) {
        setUser(response.data);    
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
    <div> 
      <h1>{user?.name}</h1>
      <h1>{user?.email}</h1>
      {children}
    </div>
  )
}

export default ProtectedRoute