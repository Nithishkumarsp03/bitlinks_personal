import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Welcome = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const dataParam = searchParams.get("data");

    if (dataParam) {
      const data = JSON.parse(decodeURIComponent(dataParam));
      const { token, NAME, ROLE, ID, EMAIL, PROFILE_PICTURE } = data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("name", NAME);
      Cookies.set("role", ROLE);
      Cookies.set("id", ID);
      Cookies.set("email", EMAIL);
      Cookies.set("picture", PROFILE_PICTURE);

      const savedData = {
        token: Cookies.get("token"),
        name: Cookies.get("NAME"),
        email: Cookies.get("EMAIL"),
        role: Cookies.get("ROLE"),
        id: Cookies.get("ID"),
        picture: Cookies.get("PROFILE_PICTURE")
      };
      console.log("Saved JSON data:", savedData);
      console.log(ROLE)
      if(ROLE === 'admin'){
      navigate("/bitcontacts/dashboard/admin");}
        else{
          navigate('/bitcontacts/dashboard')
        }
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>Welcome Page</h1>
    </div>
  );
};

export default Welcome;