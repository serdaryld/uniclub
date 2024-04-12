import React, { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { makeRequest } from "../../axios";
import ProfilePic from "../../assets/profilePic.png"
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Link } from "react-router-dom";
import "./notifications.scss";
import { AuthContext } from "../../context/authContext";

const Notifications = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();


  const { isLoading: clubsIsLoading, error: clubsError, data: clubsData, refetch  } = useQuery(["unapprovedClubs"], () =>
    makeRequest.get(`/notifications/clubs`).then((res) => res.data)
  );

  const approveClubMutation = useMutation(
    (clubId) => makeRequest.put(`/notifications/clubs/${clubId}`, { isApproved: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["club"]);
        refetch();
      },
    }
  );

  const handleApproveClubClick = (clubId) => {
    approveClubMutation.mutate(clubId);
  };



  const { isLoading: enrollmentsIsLoading, error: enrollmentError, data: enrollmentData, refetch: refetchEnrollments } = useQuery(["unapprovedEnrollment"], () =>
    makeRequest.get(`/notifications/enrollments`).then((res) => res.data)
  );

  const approveEnrollmentMutation = useMutation(
    (enrollmentId) => makeRequest.put(`/notifications/enrollments/${enrollmentId}`, { isApproved: true }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["enrollment"]);
        refetchEnrollments();
      },
    }
  );

  const handleApproveEnrollmentClick = (enrollmentId) => {
    approveEnrollmentMutation.mutate(enrollmentId);
  };

  return (
    <div className="notifications">
      <div className="title"><NotificationsIcon/><h3>Notifications</h3></div>

      {currentUser.id === 1 &&
        clubsData &&
        <>
        <h4>Club Requests</h4>
        {clubsData.map((club) => (
          <div className="item" key={club.id}>
            <Link
              to={`/clubProfile/${club.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="club">
                <div className="club-info">
                  <img src={"/upload/" + club.profilePic} alt="" />
                  <span>{club.clubName}</span>
                </div>
              </div>
            </Link>
            {!club.isApproved && (
              <button onClick={() => handleApproveClubClick(club.id)}>Approve</button>
            )}
          </div>
        ))}</>}

        
        {enrollmentData && 
        <>    
        {enrollmentData.map((enrollment) => (
          <div className="item" key={enrollment.id}>
            <Link
              to={`/profile/${enrollment.userID}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="club">
                <div className="club-info">
                  <img src={ProfilePic} alt=""/>
                  <span>{enrollment.userName} wants to enroll {enrollment.clubName}</span>
                </div>
              </div>
            </Link>
            {!enrollment.isApproved && (
              <button onClick={() => handleApproveEnrollmentClick(enrollment.id)}>Approve</button>
            )}
          </div>
        ))}

        </>}
    </div>
  );
};

export default Notifications;
