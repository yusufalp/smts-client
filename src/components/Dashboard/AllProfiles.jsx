import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AllProfiles() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [profiles, setProfiles] = useState([]);

  const [profileStatus, setProfileStatus] = useState("active");

  useEffect(() => {
    const getAllProfiles = async () => {
      try {
        console.log('profileStatus API:>> ', profileStatus);
        const response = await fetch(
          `${API_BASE_URL}/api/admin/profiles?status=${profileStatus}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }
        console.log('data. :>> ', result.data.profiles);

        setProfiles(result.data.profiles);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProfiles();
  }, [accessToken, profileStatus]);

  console.log('profileStatus :>> ', profileStatus);

  return (
    <>
      <h1>All Profiles</h1>
      <div>
        <label htmlFor="status">Status: </label>
        <select
          name="status"
          id="status"
          defaultValue="active"
          onChange={(e) => setProfileStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="graduated">Graduated</option>
          <option value="all">All</option>
        </select>
      </div>
      <ul>
        {profiles &&
          profiles.map((profile) => <li key={profile._id}>{profile._id}</li>)}
      </ul>
    </>
  );
}

export default AllProfiles;
