import { useState } from "react";

import AllMeetings from "../admin/AllMeetings";
import AllProfiles from "../admin/AllProfiles";
import AllApplications from "../admin/AllApplications";

function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState("profiles");

  const componentToRender =
    currentSection === "applications" ? (
      <AllApplications />
    ) : currentSection === "meetings" ? (
      <AllMeetings />
    ) : (
      <AllProfiles />
    );

  return (
    <>
      <label htmlFor="selection">Display </label>
      <select
        name="selection"
        id="selection"
        value={currentSection}
        onChange={(e) => setCurrentSection(e.target.value)}
      >
        <option value="default" disabled>
          Select a section
        </option>
        <option value="profiles">Profiles</option>
        <option value="meetings">Meetings</option>
        <option value="applications">Applications</option>
      </select>

      {componentToRender}
    </>
  );
}

export default AdminDashboard;
