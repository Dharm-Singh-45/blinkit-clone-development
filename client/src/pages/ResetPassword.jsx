import React, { useEffect, useState } from 'react'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data,setData] = useState({
        email:"",
        newPassword:"",
        confirmPassword:""
    })

    const [showPassword,setShowPassword] = useState(false)

    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    useEffect(()=>{
            if(!(location?.state?.data?.success)){
                navigate('/')
            }
            if(location?.state?.email){
                setData((prev)=>{
                    return{
                        ...prev,
                        email:location?.state?.email
                    }
                })
            }
    },[])

    const vaildeValue = Object.values(data).every((el) => el);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(data.newPassword !== data.confirmPassword){
            toast.error("new password and confirm password must be same")
        }
    
        try {
          const response = await Axios({
            ...SummaryApi.resetPassword,
            data,
          });
          if (response.data.error) {
            AxiosToastError.error(response.data.message);
          }
          if (response.data.success) {
            toast.success(response.data.message);
            navigate("/login")
            setData({
                email:"",
                newPassword:"",
                confirmPassword:""
            })

          }
        } catch (error) {
          AxiosToastError(error);
        }
      };

    
    
  return (
    <section className=" w-full container mx-auto px-2">
    <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6">
      <p className="font-semibold text-lg">Enter Your Password</p>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
       

        <div className="grid gap-1">
          <label htmlFor="newPassword">New Password :</label>
          <div className="grid gap-1">
     
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="newPassword"
                value={data.newPassword}
                onChange={handleChange}
                placeholder="Enter Your New Password"
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaEyeSlash />}
              </div>
            </div>
            
          </div>
        </div>
        <div className="grid gap-1">
          <label htmlFor="confirmPassword">Confirm Password :</label>
          <div className="grid gap-1">
     
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Your Confirm Password"
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaEyeSlash />}
              </div>
            </div>
            
          </div>
        </div>

        <button
          disabled={!vaildeValue}
          className={`${
            vaildeValue
              ? "bg-secondary-200 hover:bg-green-700"
              : "bg-gray-500"
          }  text-white py-2 rounded font-semibold my-3 tracking-wide `}
        >
         Change Password
        </button>
      </form>
      <p>
        Remeber Password ?
        <Link
          to={"/login"}
          className="font-semibold text-secondary-200 hover:hover:text-green-700"
        >
          Login
        </Link>
      </p>
    </div>
  </section>
  )
}

export default ResetPassword
