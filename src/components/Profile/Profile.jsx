import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AdminProfile from "./AdminProfile";
import AdvisorProfile from "./AdvisorProfile";
import LearnerProfile from "./LearnerProfile";

function Profile() {
  const userProfile = useSelector((state) => state.user.profile);
  const { role } = userProfile;

  const navigate = useNavigate();

  const { isAdmin, isAdvisor, isLearner } = useMemo(() => {
    return {
      isAdmin: role === "admin",
      isAdvisor: role === "mentor" || role === "coach",
      isLearner: role === "mentee" || role === "alumni",
    };
  }, [role]);

  return (
    <main>
      {isAdmin && <AdminProfile name={userProfile.name} />}
      {isAdvisor && <AdvisorProfile name={userProfile.name} />}
      {isLearner && (
        <LearnerProfile
          name={userProfile.name}
          cohort={userProfile.cohort}
          graduation={userProfile.graduation}
        />
      )}

      <div>
        <p>Role: {userProfile.role}</p>
        <p>Status: {userProfile.status}</p>
      </div>
      <div>
        <h2>Email</h2>
        <p>{userProfile.email}</p>
        <button onClick={() => navigate("/email-form")}>
          {userProfile.email ? "Edit" : "Add"} Email
        </button>
      </div>
      <div>
        <h2>Address</h2>
        <p>
          {userProfile.address?.street?.line1}{" "}
          {userProfile.address?.street?.line2}
        </p>
        <p>
          <span>{userProfile.address?.city} </span>
          <span>{userProfile.address?.state} </span>
          <span>{userProfile.address?.zip}</span>
        </p>
        <button onClick={() => navigate("/address-form")}>
          {userProfile.address ? "Edit" : "Add"} Address
        </button>
      </div>
      <div>
        <h2>Links</h2>
        {userProfile.links?.portfolio && (
          <p>
            <Link to={userProfile.links?.portfolio}>Portfolio</Link>
          </p>
        )}
        {userProfile.links?.linkedin && (
          <p>
            <Link to={userProfile.links?.linkedin}>LinkedIn</Link>
          </p>
        )}
        {userProfile.links?.github && (
          <p>
            <Link to={userProfile.links?.github}>GitHub</Link>
          </p>
        )}
        <button onClick={() => navigate("/links-form")}>
          {userProfile.links ? "Edit" : "Add"} Links
        </button>
      </div>
    </main>
  );
}

export default Profile;
