import { useMemo } from "react";
import { useSelector } from "react-redux";

import AdminDashboard from "./AdminDashboard";
import AdvisorDashboard from "./AdvisorDashboard";
import LearnerDashboard from "./LearnerDashboard";

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
        {isAdmin && <AdminDashboard name={name} />}
        {isAdvisor && <AdvisorDashboard name={name} />}
        {isLearner && <LearnerDashboard name={name} />}
      </section>
    </main>
  );
}

export default Dashboard;
