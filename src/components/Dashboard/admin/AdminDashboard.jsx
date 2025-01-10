import { useState } from "react";
import PropTypes from "prop-types";

import AllMeetings from "./AllMeetings";
import AllProfiles from "./AllProfiles";
import AllApplications from "./AllApplications";

function AdminDashboard({ name }) {
  const [currentSection, setCurrentSection] = useState("profiles");

  let componentToRender;

  if (currentSection === "applications") {
    componentToRender = <AllApplications />;
  } else if (currentSection === "meetings") {
    componentToRender = <AllMeetings />;
  } else if (currentSection === "profiles") {
    componentToRender = <AllProfiles />;
  }

  return (
    <main>
      <h1>Welcome {name.firstName}</h1>

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
    </main>
  );
}

AdminDashboard.propTypes = {
  name: PropTypes.object,
};

export default AdminDashboard;
