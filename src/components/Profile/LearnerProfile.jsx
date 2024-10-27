import PropTypes from "prop-types";

function LearnerProfile({ name, cohort, graduation }) {
  return (
    <>
      <h1>Learner Profile</h1>
      <h2>
        {name.first} {name.last}
      </h2>
      <div>
        <p>Cohort {cohort || "will be updated soon"}</p>
        <p>Graduation date {graduation || "will be updated soon"}</p>
      </div>
    </>
  );
}

LearnerProfile.propTypes = {
  name: PropTypes.object,
  cohort: PropTypes.number,
  graduation: PropTypes.instanceOf(Date),
};

export default LearnerProfile;
