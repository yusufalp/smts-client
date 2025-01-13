import PropTypes from "prop-types";

import LearnerList from "../learner/LearnerList";
import MeetingList from "../meeting/MeetingList";

function AdvisorDashboard({ name }) {
  return (
    <main>
      <h1>Welcome {name.firstName}</h1>
      <LearnerList />
      <MeetingList />
    </main>
  );
}

AdvisorDashboard.propTypes = {
  name: PropTypes.object,
};

export default AdvisorDashboard;
