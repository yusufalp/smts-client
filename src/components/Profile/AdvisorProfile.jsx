import PropTypes from "prop-types";
function AdvisorProfile({ name }) {
  return (
    <>
      <h1>Advisor Profile</h1>
      <h2>
        {name.first} {name.last}
      </h2>
    </>
  );
}

AdvisorProfile.propTypes = {
  name: PropTypes.object,
};

export default AdvisorProfile;
