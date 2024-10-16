import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function LearnerProfile() {
  const userProfile = useSelector((state) => state.user.profile);

  const navigate = useNavigate();

  return (
    <main>
      <h1>Profile</h1>
      <div>
        <h2>
          {userProfile.name?.first} {userProfile.name?.last}
        </h2>
        <div>
          <p>Cohort {userProfile.cohort || "will be updated soon"}</p>
          <p>
            Graduation date {userProfile.graduation || "will be updated soon"}{" "}
          </p>
        </div>
      </div>
      <div>
        <h2>Email</h2>
        <div>
          <p>{userProfile.email}</p>
        </div>
        <button onClick={() => navigate("/email-form")}>
          {userProfile.email ? "Edit" : "Add"} Email
        </button>
      </div>
      <div>
        <h2>Address</h2>
        <div>
          <p>
            {userProfile.address?.street?.line1}{" "}
            {userProfile.address?.street?.line2}
          </p>
          <p>
            <span>{userProfile.address?.city} </span>
            <span>{userProfile.address?.state} </span>
            <span>{userProfile.address?.zip}</span>
          </p>
        </div>
        <button onClick={() => navigate("/address-form")}>
          {userProfile.address ? "Edit" : "Add"} Address
        </button>
      </div>
      <div>
        <h2>Links</h2>
        <div>
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
        </div>
        <button onClick={() => navigate("/links-form")}>
          {userProfile.links ? "Edit" : "Add"} Links
        </button>
      </div>
    </main>
  );
}

export default LearnerProfile;
