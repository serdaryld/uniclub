import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { useQuery, useMutation,
  useQueryClient } from 'react-query'
import { makeRequest } from "../../axios";
import { Link } from "react-router-dom";

const RightBar = () => {

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["enrolledClubs", currentUser.id], ()=>
  makeRequest.get(`/clubs/user/${currentUser.id}`).then((res) => res.data)
 )

  const { isLoading: allIsLoading, error: allError, data: allData } = useQuery(["allClubs"], ()=>
  makeRequest.get(`/clubs`).then((res) => res.data)
 )


  return (
    <div className="right-bar">
      <div className="container">
        {data?.length>0 && 
        <div className="item">
          <span>Enrolled Clubs</span>
          {data && data.map((club) => (
            <Link
            to={`/clubProfile/${club.id}`}
            style={{ textDecoration: "none", color: "inherit" }} key={club.id}>
              <div className="club">
                <div className="club-info">
                  <img src={"/upload/"+club.profilePic} alt="" />
                 <span>{club.clubName}</span>
               </div>
              </div>
            </Link>
          ))}
        </div>}
        <div className="item">
          <span>All Clubs</span>
          {allData && allData.map((club) => (
            <Link
            to={`/clubProfile/${club.id}`}
            style={{ textDecoration: "none", color: "inherit" }} key={club.id}>
              <div className="club"> 
                <div className="club-info">
                  <img src={"/upload/"+club.profilePic} alt="" />
                  <span>{club.clubName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default RightBar;
