import { useState } from "react";

import AllMeetings from "./AllMeetings";
import AllProfiles from "./AllProfiles";

function AdminDashboard() {
  const [currentComponent, setCurrentComponent] = useState("profiles");

  return (
    <>
      <div>
        <button onClick={() => setCurrentComponent("profiles")}>
          Profiles
        </button>
        <button onClick={() => setCurrentComponent("meetings")}>
          Meetings
        </button>
      </div>

      {currentComponent === "profiles" && <AllProfiles />}
      {currentComponent === "meetings" && <AllMeetings />}
    </>
  );
}

export default AdminDashboard;
