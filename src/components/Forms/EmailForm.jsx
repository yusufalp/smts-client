import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProfile } from "../../store/features/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EmailForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userProfile = useSelector((state) => state.user.profile);

  const [email, setEmail] = useState(userProfile.email || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();

    const body = { email };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profiles/update-email`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const profile = result.data.profile;

      dispatch(addProfile({ profile }));
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleEmailFormSubmit}>
      <h2>Please enter your email</h2>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Enter a valid email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Update</button>
    </form>
  );
}

export default EmailForm;
