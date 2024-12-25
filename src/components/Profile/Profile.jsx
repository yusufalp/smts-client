import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import AdminProfile from "./AdminProfile";
import AdvisorProfile from "./AdvisorProfile";
import LearnerProfile from "./LearnerProfile";

function Profile() {
  const profile = useSelector((state) => state.user.profile);
  const { role, name } = profile;

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
      <h1>My Profile</h1>
      <section>
        <h2>
          {name.firstName} {name.lastName}
        </h2>
        <button onClick={() => navigate("/name-form")}>Edit Name</button>
      </section>

      {isAdmin && <AdminProfile />}
      {isAdvisor && <AdvisorProfile />}
      {isLearner && (
        <LearnerProfile
          cohort={profile.cohort}
          graduation={profile.graduationDate}
        />
      )}

      <section>
        <p>Role: {profile.role}</p>
        <p>Status: {profile.status}</p>
      </section>
      <section>
        <h2>Email</h2>
        <p>{profile.email}</p>
        <button onClick={() => navigate("/email-form")}>
          {profile.email ? "Edit" : "Add"} Email
        </button>
      </section>
      <section>
        <h2>Address</h2>
        <p>
          {profile.address?.street?.line1} {profile.address?.street?.line2}
        </p>
        <p>
          <span>{profile.address?.city} </span>
          <span>{profile.address?.state} </span>
          <span>{profile.address?.postalCode}</span>
        </p>
        <button onClick={() => navigate("/address-form")}>
          {profile.address ? "Edit" : "Add"} Address
        </button>
      </section>
      <section>
        <h2>Links</h2>
        {profile.links?.portfolioUrl && (
          <p>
            <Link to={profile.links?.portfolioUrl}>Portfolio</Link>
          </p>
        )}
        {profile.links?.linkedinUrl && (
          <p>
            <Link to={profile.links?.linkedinUrl}>LinkedIn</Link>
          </p>
        )}
        {profile.links?.githubUrl && (
          <p>
            <Link to={profile.links?.githubUrl}>GitHub</Link>
          </p>
        )}
        <button onClick={() => navigate("/links-form")}>
          {profile.links ? "Edit" : "Add"} Links
        </button>
      </section>
    </main>
  );
}

export default Profile;
