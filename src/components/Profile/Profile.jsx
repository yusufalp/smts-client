import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { ROLES } from "../../constants/roles";
import { STATUSES } from "../../constants/statuses";
import { useState } from "react";

function Profile() {
  const profile = useSelector((state) => state.user.profile);

  const [activeTab, setActiveTab] = useState("about");

  const navigate = useNavigate();

  const isLearner = profile.role === "mentee" || profile.role === "alumni";

  return (
    <main>
      <h1>My Profile</h1>

      <div className="user-information">
        <div className="user-summary">
          <div className="user-summary-header">
            <figure>
              <img
                src="https://randomuser.me/api/portraits/men/88.jpg"
                alt="profile image"
              />
              <figcaption>
                <p>{ROLES[profile.role].id}</p>
                <p>{STATUSES[profile.profileStatus].id}</p>
              </figcaption>
              <div className="divider"></div>
            </figure>

            {isLearner && (
              <section className="user-enrollment">
                <div>
                  <p>Cohort</p>
                  <p>{profile.cohort ?? "will be updated soon"}</p>
                </div>
                <div>
                  <p>Graduation</p>
                  <p>
                    {new Date(profile.graduationDate).toLocaleDateString() ||
                      "will be updated soon"}
                  </p>
                </div>
              </section>
            )}
          </div>

          <div className="divider"></div>

          <div className="user-links">
            <ul>
              <li>
                <p>Portfolio</p>
                <Link to={profile.links?.portfolioUrl}>Portfolio</Link>
              </li>
              <li>
                <p>LinkedIn</p>
                <Link to={profile.links?.linkedinUrl}>LinkedIn</Link>
              </li>
              <li>
                <p>GitHub</p>
                <p>
                  <Link to={profile.links?.githubUrl}>GitHub</Link>
                </p>
              </li>
            </ul>
            <button onClick={() => navigate("/links-form")}>Edit Links</button>
          </div>
        </div>

        <div className="user-details">
          <ul className="tabs">
            <li className={`tab ${activeTab === "about" ? "active" : ""}`}>
              <button onClick={() => setActiveTab("about")}>About</button>
            </li>
            <li className={`tab ${activeTab === "contact" ? "active" : ""}`}>
              <button onClick={() => setActiveTab("contact")}>Contact</button>
            </li>
            <li className={`tab ${activeTab === "address" ? "active" : ""}`}>
              <button onClick={() => setActiveTab("address")}>Address</button>
            </li>
          </ul>

          <div className="divider"></div>

          {activeTab === "about" && (
            <section className="user-about">
              <div>
                <p>First Name: {profile.name.firstName}</p>
                <p>Middle Name: {profile.name.middleName}</p>
                <p>Last Name: {profile.name.lastName}</p>
                <p>Bio: {profile.bio}</p>
              </div>
              <button onClick={() => navigate("/about-me-form")}>
                Edit About Me
              </button>
            </section>
          )}

          {activeTab === "contact" && (
            <section className="user-contact">
              <div>
                <p>Email: {profile.email}</p>
                <p>Phone: {profile.phoneNumber}</p>
              </div>
              <button onClick={() => navigate("/contact-form")}>
                Edit Contact
              </button>
            </section>
          )}

          {activeTab === "address" && (
            <section className="user-address">
              <div>
                <p>Address (line 1): {profile.address?.street?.line1}</p>
                <p>Address (line 2): {profile.address?.street?.line2}</p>
                <p>City: {profile.address?.city} </p>
                <p>State: {profile.address?.state} </p>
                <p>Postal Code: {profile.address?.postalCode}</p>
              </div>
              <button onClick={() => navigate("/address-form")}>
                Edit Address
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;
