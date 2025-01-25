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
            </figure>

            {isLearner && (
              <section className="user-enrollment">
                <div className="divider"></div>
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
            <li className={`tab ${activeTab === "account" ? "active" : ""}`}>
              <button onClick={() => setActiveTab("account")}>Account</button>
            </li>
          </ul>

          {activeTab === "about" && (
            <section className="user-about">
              <div>
                <p>
                  <span className="user-details-info-title">First Name: </span>
                  <span>{profile.name.firstName}</span>
                </p>
                <p>
                  <span className="user-details-info-title">Middle Name: </span>
                  <span>{profile.name.middleName}</span>
                </p>
                <p>
                  <span className="user-details-info-title">Last Name: </span>
                  <span>{profile.name.lastName}</span>
                </p>
                <p>
                  <span className="user-details-info-title">Bio: </span>
                  <span>{profile.bio}</span>
                </p>
              </div>
              <button onClick={() => navigate("/about-me-form")}>
                Edit About
              </button>
            </section>
          )}

          {activeTab === "contact" && (
            <section className="user-contact">
              <div>
                <p>
                  <span className="user-details-info-title">Email: </span>
                  <span>{profile.email}</span>
                </p>
                <p>
                  <span className="user-details-info-title">Phone: </span>
                  <span>{profile.phoneNumber}</span>
                </p>
              </div>
              <button onClick={() => navigate("/contact-form")}>
                Edit Contact
              </button>
            </section>
          )}

          {activeTab === "address" && (
            <section className="user-address">
              <div>
                <p>
                  <span className="user-details-info-title">
                    Address (line 1):{" "}
                  </span>
                  <span>{profile.address?.street?.line1}</span>
                </p>
                <p>
                  <span className="user-details-info-title">
                    Address (line 2):{" "}
                  </span>
                  <span>{profile.address?.street?.line2}</span>
                </p>
                <p>
                  <span className="user-details-info-title">City: </span>
                  <span>{profile.address?.city}</span>
                </p>
                <p>
                  <span className="user-details-info-title">State: </span>
                  <span>{profile.address?.state}</span>
                </p>
                <p>
                  <span className="user-details-info-title">Postal Code: </span>
                  <span>{profile.address?.postalCode}</span>
                </p>
              </div>
              <button onClick={() => navigate("/address-form")}>
                Edit Address
              </button>
            </section>
          )}

          {activeTab === "account" && (
            <section className="user-account">
              <div>
                <p>
                  <span className="user-details-info-title">Username: </span>
                </p>
                <p>
                  <span className="user-details-info-title">Password: </span>
                </p>
              </div>
              <button onClick={() => navigate("/address-form")}>
                Change Password
              </button>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;
