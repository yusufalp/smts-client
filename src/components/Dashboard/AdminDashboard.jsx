import { useState } from "react";

import AllMeetings from "../admin/AllMeetings";
import AllProfiles from "../admin/AllProfiles";
import AllApplications from "../admin/AllApplications";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profiles");

  const componentToRender =
    activeTab === "applications" ? (
      <AllApplications />
    ) : activeTab === "meetings" ? (
      <AllMeetings />
    ) : (
      <AllProfiles />
    );

  return (
    <>
      <div className="admin-dashboard">
        <ul className="tabs">
          <li className={`tab ${activeTab === "profiles" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("profiles")}>Profiles</button>
          </li>
          <li className={`tab ${activeTab === "meetings" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("meetings")}>Meetings</button>
          </li>
          <li className={`tab ${activeTab === "applications" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("applications")}>
              Applications
            </button>
          </li>
        </ul>

        {componentToRender}
      </div>
    </>
  );
}

export default AdminDashboard;
