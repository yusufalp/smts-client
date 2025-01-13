import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { ROLES } from "../../constants/roles";
import { STATUSES } from "../../constants/statuses";

function Profile() {
  const profile = useSelector((state) => state.user.profile);

  const navigate = useNavigate();

  const isLearner = profile.role === "mentee" || profile.role === "alumni";

  return (
    <main>
      <h1>My Profile</h1>

      {isLearner && (
        <>
          <p>Cohort: {profile.cohort ?? "will be updated soon"}</p>
          <p>
            Graduation date:{" "}
            {new Date(profile.graduationDate).toLocaleDateString() ||
              "will be updated soon"}
          </p>
        </>
      )}

      <section>
        <p>Role: {ROLES[profile.role].id}</p>
        <p>Status: {STATUSES[profile.profileStatus].id}</p>
      </section>

      <section>
        <h2>About Me</h2>
        <p>
          Name: {profile.name.firstName} {profile.name.middleName}{" "}
          {profile.name.lastName}
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
