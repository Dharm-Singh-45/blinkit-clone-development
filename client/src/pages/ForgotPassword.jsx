import React, { useState } from "react";

import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const vaildeValue = Object.values(data).every((el) => el); // for the register button color

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgotPassword,
        data,
      });
      if (response.data.error) {
        toast.error(response.data.message);
      }
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/otp-verification", {
          state: data,
        });

        setData({
          email: "",
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className=" w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6">
        <p className="font-semibold text-lg">Forgot Password</p>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Email */}

          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
            />
          </div>

          <button
            disabled={!vaildeValue}
            className={`${
              vaildeValue
                ? "bg-secondary-200 hover:bg-green-700"
                : "bg-gray-500"
            }  text-white py-2 rounded font-semibold my-3 tracking-wide `}
          >
            Send Otp
          </button>
        </form>
        <p>
          Alredy have account ?
          <Link
            to={"/login"}
            className="font-semibold text-secondary-200 hover:hover:text-green-700"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;