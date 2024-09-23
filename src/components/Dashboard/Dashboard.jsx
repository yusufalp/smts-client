import { useSelector } from "react-redux";

import AdminDashboard from "./AdminDashboard";
import AdvisorDashboard from "./AdvisorDashboard";
import LearnerDashboard from "./LearnerDashboard";
import MeetingList from "./MeetingList";

function Dashboard() {
  const userProfile = useSelector((state) => state.user.profile);

  const { role } = userProfile;
  const { first } = userProfile.name;

  const isAdmin = role === "admin";
  const isLearner = role === "mentee" || role === "alumni";
  const isAdvisor = role === "mentor" || role === "coach";

  return (
    <main className="dashboard">
      <h1>Welcome {first}</h1>

      {isAdmin && <AdminDashboard />}
      {isAdvisor && <AdvisorDashboard />}
      {isLearner && <LearnerDashboard />}

      {(isAdvisor || isLearner) && <MeetingList />}
    </main>
  );
}

export default Dashboard;
