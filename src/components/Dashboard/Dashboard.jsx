import { useSelector } from "react-redux";

import AdminDashboard from "./AdminDashboard";
import AdvisorDashboard from "./AdvisorDashboard";
import LearnerDashboard from "./LearnerDashboard";
import MeetingList from "./MeetingList";
import { useMemo } from "react";

function Dashboard() {
  const userProfile = useSelector((state) => state.user.profile);

  const { role, name } = userProfile;

  const { isAdmin, isLearner, isAdvisor } = useMemo(() => {
    return {
      isAdmin: role === "admin",
      isLearner: role === "mentee" || role === "alumni",
      isAdvisor: role === "mentor" || role === "coach",
    };
  }, [role]);

  return (
    <main className="dashboard">
      <h1>Welcome {name.first}</h1>

      {isAdmin && <AdminDashboard />}
      {isAdvisor && <AdvisorDashboard />}
      {isLearner && <LearnerDashboard />}

      {(isAdvisor || isLearner) && <MeetingList />}
    </main>
  );
}

export default Dashboard;

/*

TODO: What are the things to add to admin dashboard
List of all users with filters
  - Default is the active users
List of all meetings with filters
  - Default is the meetings in the last 6 months

*/
