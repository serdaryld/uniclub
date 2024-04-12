import React, { useEffect } from "react";
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []); 
  
  return (
    <div className="home">
      <Posts/>
    </div>
  )
}

export default Home