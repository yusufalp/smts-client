import { useState } from "react";

import LearnerList from "../learner/LearnerList";
import MeetingList from "../meeting/MeetingList";

function AdvisorDashboard() {
  const [activeTab, setActiveTab] = useState("learners");

  return (
    <>
      <div className="advisor-dashboard">
        <ul className="tabs">
          <li className={`tab ${activeTab === "learners" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("learners")}>Learners</button>
          </li>
          <li className={`tab ${activeTab === "meetings" ? "active" : ""}`}>
            <button onClick={() => setActiveTab("meetings")}>Meetings</button>
          </li>
        </ul>

        {activeTab === "learners" && <LearnerList />}
        {activeTab === "meetings" && <MeetingList />}
      </div>
    </>
  );
}

export default AdvisorDashboard;
