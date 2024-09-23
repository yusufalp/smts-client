import { useSelector } from "react-redux";

function LearnerDashboard() {
  const userProfile = useSelector((state) => state.user.profile);

  return (
    <div>
      <p>Your mentor is {userProfile.assigned.mentor}</p>
      <p>Your career coach is {userProfile.assigned.coach}</p>
    </div>
  );
}

export default LearnerDashboard;
