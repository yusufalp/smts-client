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
        <h2>About Me</h2>
        <p>
          Name: {name.firstName} {name.lastName}
        </p>
        <p>Bio: {profile.bio}</p>
        <button onClick={() => navigate("/about-me-form")}>
          Edit About Me
        </button>
      </section>

      <section>
        <h2>Contact</h2>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phoneNumber}</p>
        <button onClick={() => navigate("/contact-form")}>Edit Contact</button>
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
        <button onClick={() => navigate("/address-form")}>Edit Address</button>
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
        <button onClick={() => navigate("/links-form")}>Edit Links</button>
      </section>
    </main>
  );
}

export default Profile;
