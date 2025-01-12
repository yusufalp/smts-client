import PropTypes from "prop-types";

import MenteeList from "../advisor/MenteeList";
import MeetingList from "../shared/MeetingList";

function AdvisorDashboard({ name }) {
  return (
    <main>
      <h1>Welcome {name.firstName}</h1>
      <MenteeList />
      <MeetingList />
    </main>
  );
}

AdvisorDashboard.propTypes = {
  name: PropTypes.object,
};

export default AdvisorDashboard;
