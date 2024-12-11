import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile] = useMobile();

  const [isSearchPage, setIsSearchPage] = useState(false);

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border p-1 overflow-hidden flex items-center text-neutral-500 bg-slate-50 focus-within:border-primary-200  ">
      <div>
        {isMobile && isSearchPage ? (
          <Link to={"/"} className="flex justify-center items-center h-full p-2 m-1 focus-within:text-color-primary-200 bg-white rounded-full shadow-md ">
            <FaArrowLeft size={20} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 focus-within:text-color-primary-200 ">
            <FaSearch size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="w-full h-full flex justify-center items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "Search 'milk'",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "Search 'sugar' ",
                1000,
                "Search 'coldDrink'",
                1000,
                "Search 'paneer' ",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              placeholder="search for aata dal and more"
              autoFocus
              className="bg-transparent w-full h-full outline-none "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
Search;
