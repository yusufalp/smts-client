import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { ROLES } from "../../constants/roles";
import { STATUSES } from "../../constants/statuses";
import { useState } from "react";
import { retrievePathname, formatLinkWithoutProtocol } from "../../utils/url";

function Profile() {
  const profile = useSelector((state) => state.user.profile);

  const [activeTab, setActiveTab] = useState("about");

  const navigate = useNavigate();

  const isLearner = profile.role === "mentee" || profile.role === "alumni";

  const hasLinks =
    profile.links && Object.values(profile.links).some((link) => link !== "");

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
                <p>{profile.name.firstName}</p>
                <p>
                  <span>{ROLES[profile.role].id}</span>
                  <span> | </span>
                  <span>{STATUSES[profile.profileStatus].id}</span>
                </p>
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
                <p><i className="fa-solid fa-envelope"></i></p>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              {profile.links?.portfolioUrl && (
                <li>
                  <p><i className="fa-solid fa-folder-open"></i></p>
                  <Link to={profile.links?.portfolioUrl}>
                    {formatLinkWithoutProtocol(profile.links.portfolioUrl)}
                  </Link>
                </li>
              )}
              {profile.links?.linkedinUrl && (
                <li>
                  <p><i className="fa-brands fa-linkedin"></i></p>
                  <Link to={profile.links?.linkedinUrl}>
                    {retrievePathname(profile.links.linkedinUrl)}
                  </Link>
                </li>
              )}
              {profile.links?.githubUrl && (
                <li>
                  <p><i className="fa-brands fa-square-github"></i></p>
                  <Link to={profile.links?.githubUrl}>
                    {retrievePathname(profile.links.githubUrl)}
                  </Link>
                </li>
              )}
            </ul>
            <button onClick={() => navigate("/form/links")}>
              {hasLinks ? "Edit" : "Add"} Links
            </button>
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
              <button onClick={() => navigate("/form/about-me")}>
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
              <button onClick={() => navigate("/form/contact")}>
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
              <button onClick={() => navigate("/form/address")}>
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
              <button onClick={() => navigate("/form/account")}>
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
