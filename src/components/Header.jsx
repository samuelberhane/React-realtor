import { useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Sidemenu } from ".";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

const Header = () => {
  const [showSidemenu, setShowSidemenu] = useState(false);
  const [userLogin, setUserLogin] = useState("Login");
  const location = useLocation();

  // Current Page(Route)
  const pathRoute = (route) => {
    return route === location.pathname;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLogin("Profile");
      } else {
        setUserLogin("Login");
      }
    });
  });

  return (
    <>
      <div className="h-16 shadow-md text-black bg-white">
        <div className="px-4 md:px-8 lg:px-12 flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/">
            <h1 className="font-bold text-xl md:text-2xl lg:text-3xl text-red-500">
              Real<span className="text-black">tor.com</span>
            </h1>
          </Link>

          {/****** Links ******/}
          {/* Menu Icon */}
          <BiMenuAltRight
            className="md:hidden cursor-pointer text-2xl"
            onClick={() => setShowSidemenu(!showSidemenu)}
          />

          {/* Header Link */}
          <ul className="items-center gap-5 hidden md:flex">
            <Link
              to="/"
              className={`link ${
                pathRoute("/") ? "border-b-2 border-blue-400" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/offers"
              className={`link ${
                pathRoute("/offers") ? "border-b-2 border-blue-400" : ""
              }`}
            >
              Offers
            </Link>
            <Link
              to={`/${userLogin.toLocaleLowerCase()}`}
              className={`link ${
                pathRoute(`/${userLogin.toLocaleLowerCase()}`)
                  ? "border-b-2 border-blue-400"
                  : ""
              }`}
            >
              {userLogin}
            </Link>
          </ul>
        </div>
      </div>
      <Sidemenu showSidemenu={showSidemenu} />
    </>
  );
};

export default Header;
