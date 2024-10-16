import { useMemo } from "react";
import { useSelector } from "react-redux";

import AdminProfile from "./AdminProfile";
import AdvisorProfile from "./AdvisorProfile";
import LearnerProfile from "./LearnerProfile";

function Profile() {
  const userProfile = useSelector((state) => state.user.profile);
  const { role } = userProfile;

  const { isAdmin, isAdvisor, isLearner } = useMemo(() => {
    return {
      isAdmin: role === "admin",
      isAdvisor: role === "mentor" || role === "coach",
      isLearner: role === "mentee" || role === "alumni",
    };
  }, [role]);

  return (
    <>
      {isAdmin && <AdminProfile />}
      {isAdvisor && <AdvisorProfile />}
      {isLearner && <LearnerProfile />}
    </>
  );
}

export default Profile;
