import { useMemo } from "react";
import { useSelector } from "react-redux";

import AdminDashboard from "./AdminDashboard";
import AdvisorDashboard from "./AdvisorDashboard";
import LearnerDashboard from "./LearnerDashboard";
import MeetingList from "./MeetingList";

function Dashboard() {
  const profile = useSelector((state) => state.user.profile);

  const { role, name } = profile;

  const { isAdmin, isLearner, isAdvisor } = useMemo(() => {
    return {
      isAdmin: role === "admin",
      isLearner: role === "mentee" || role === "alumni",
      isAdvisor: role === "mentor" || role === "coach",
    };
  }, [role]);

  return (
    <main className="dashboard">
      <section>
        <h1>Welcome {name.first}</h1>
      </section>

      <section>
        {isAdmin && <AdminDashboard />}
        {isAdvisor && <AdvisorDashboard />}
        {isLearner && <LearnerDashboard />}
      </section>

      <section>{(isAdvisor || isLearner) && <MeetingList />}</section>
    </main>
  );
}

export default Dashboard;
