import PropTypes from "prop-types";

function AdminProfile({ name }) {
  return (
    <>
      <h1>Admin Profiles</h1>
      <h2>
        {name.first} {name.last}
      </h2>
    </>
  );
}

AdminProfile.propTypes = {
  name: PropTypes.object,
};

export default AdminProfile;
