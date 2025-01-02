import PropTypes from "prop-types";

function LearnerProfile({ cohort, graduationDate }) {
  return (
    <>
      <p>Cohort {cohort || "will be updated soon"}</p>
      <p>Graduation date {graduationDate || "will be updated soon"}</p>
    </>
  );
}

LearnerProfile.propTypes = {
  cohort: PropTypes.number,
  graduationDate: PropTypes.instanceOf(Date),
};

export default LearnerProfile;
