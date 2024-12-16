import PropTypes from "prop-types";

function LearnerProfile({ cohort, graduation }) {
  return (
    <>
      <p>Cohort {cohort || "will be updated soon"}</p>
      <p>Graduation date {graduation || "will be updated soon"}</p>
    </>
  );
}

LearnerProfile.propTypes = {
  cohort: PropTypes.number,
  graduation: PropTypes.instanceOf(Date),
};

export default LearnerProfile;
