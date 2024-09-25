import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MenteeList() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [mentees, setMentees] = useState([]);

  useEffect(() => {
    const getAssignedMentees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/profiles/mentees`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.message);
        }

        setMentees(result.data.mentees);
      } catch (error) {
        console.log(error);
      }
    };

    getAssignedMentees();
  }, [accessToken]);

  return (
    <>
      <h2>Mentees</h2>
      {mentees.length !== 0 && (
        <ul>
          <li>First Name</li>
          <li>Last Name</li>
          <li>Graduation</li>
        </ul>
      )}
      {mentees.length !== 0 ? (
        mentees.map((mentee) => (
          <ul key={mentee._id}>
            <li>
              <Link to={`/mentees/${mentee._id}}`}>{mentee.name.first}</Link>
            </li>
            <li>{mentee.name.last}</li>
            <li>{mentee.graduation}</li>
          </ul>
        ))
      ) : (
        <p>There are no mentees assigned yet</p>
      )}
    </>
  );
}

export default MenteeList;
