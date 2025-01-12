import PropTypes from "prop-types";

function LearnerProfile({ cohort, graduationDate }) {
  const formattedGraduationDate = graduationDate
    ? new Date(graduationDate).toLocaleDateString()
    : "will be updated soon";

  return (
    <>
      <p>Cohort: {cohort ?? "will be updated soon"}</p>
      <p>Graduation date: {formattedGraduationDate}</p>
    </>
  );
}

LearnerProfile.propTypes = {
  cohort: PropTypes.number,
  graduationDate: PropTypes.instanceOf(Date),
};

export default LearnerProfile;
