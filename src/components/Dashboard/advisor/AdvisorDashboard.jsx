import PropTypes from "prop-types";

import MeetingList from "../shared/MeetingList";
import MenteeList from "./MenteeList";

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
