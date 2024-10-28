import { useMemo } from "react";
import { useSelector } from "react-redux";

import AdminDashboard from "./AdminDashboard";
import AdvisorDashboard from "./AdvisorDashboard";
import LearnerDashboard from "./LearnerDashboard";
import MeetingList from "./MeetingList";

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
