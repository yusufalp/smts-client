import { useState } from "react";

import AllMeetings from "./AllMeetings";
import AllProfiles from "./AllProfiles";

function AdminDashboard() {
  const [currentComponent, setCurrentComponent] = useState("users");

  return (
    <>
      <div>
        <button onClick={() => setCurrentComponent("users")}>Users</button>
        <button onClick={() => setCurrentComponent("meetings")}>
          Meetings
        </button>
      </div>

      {currentComponent === "users" && <AllProfiles />}
      {currentComponent === "meetings" && <AllMeetings />}
    </>
  );
}

export default AdminDashboard;
