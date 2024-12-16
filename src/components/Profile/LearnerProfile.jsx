import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function LearnerProfile({ name, cohort, graduation }) {
  const navigate = useNavigate();

  return (
    <>
      <h1>Learner Profile</h1>
      <section>
        <h2>
          {name.first} {name.last}
        </h2>
        <button onClick={() => navigate("/name-form")}>Edit Name</button>
      </section>
      <section>
        <p>Cohort {cohort || "will be updated soon"}</p>
        <p>Graduation date {graduation || "will be updated soon"}</p>
      </section>
    </>
  );
}

LearnerProfile.propTypes = {
  name: PropTypes.object,
  cohort: PropTypes.number,
  graduation: PropTypes.instanceOf(Date),
};

export default LearnerProfile;
