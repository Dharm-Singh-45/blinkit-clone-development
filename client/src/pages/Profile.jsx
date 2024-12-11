import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarEdit from "../components/UserProfileAvatarEdit";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import fetchUserDetails from "../utils/fetchUSerDetails";
import { setUserDetails } from "../store/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileEditAvatar, setOpenProfileEditAvatar] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const [loading,setLoading] = useState(false)

  const dispatch = useDispatch()
  useEffect(()=>{
setUserData({
  name: user.name,
  email: user.email,
  mobile: user.mobile,
})
  },[user])

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmitForm =async (e) =>{
    e.preventDefault()
    try {
      setLoading(true)

      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data : userData

      })
      const {data: responseData} = response
      if(responseData.success){
        toast.success(responseData.message)
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))
      }
      
    } catch (error) {
      AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }

  }

  return (
    <div>
      {/* Profile upload and display  */}

      <div className="w-20 h-20  flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full" />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => setOpenProfileEditAvatar(true)}
        className="text-sm min-w-20 border bg-primary-100  hover:bg-primary-200 px-3 py-1 rounded-full mt-3"
      >
        Edit
      </button>

      {openProfileEditAvatar && (
        <UserProfileAvatarEdit close={() => setOpenProfileEditAvatar(false)} />
      )}

      {/* Name ,mobile, email ,change password  */}

      <form action="" className="my-4 grid gap-4" onSubmit={handleSubmitForm}>
        <div className="grid">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            className="p-2 bg-blue-50 outline-primary-200 border focus-within:border-primary-200"
            value={userData.name}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            className="p-2 bg-blue-50 outline-primary-200 border focus-within:border-primary-200"
            value={userData.email}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className="grid">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="number"
            name="mobile"
            placeholder="Enter Your Mobile"
            className="p-2 bg-blue-50 outline-primary-200 border focus-within:border-primary-200"
            value={userData.mobile}
            onChange={handleOnChange}
            required
          />
        </div>
        <button className="border px-4 py-2 font-semibold
         hover:bg-primary-100 border-primary-100 text-primary-100
          hover:text-neutral-800 rounded">

           
            {
              loading ? "Loading..." : "Submit"
            }
            </button>
      </form>
    </div>
  );
};

export default Profile;
