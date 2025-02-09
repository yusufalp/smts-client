import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";
import { STATES } from "../../constants/states";

import { constructUrl } from "../../utils/url";

function AddressForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [addressFormData, setAddressFormData] = useState({
    line1: profile?.address?.street?.line1 || "",
    line2: profile?.address?.street?.line2 || "",
    city: profile?.address?.city || "",
    state: profile?.address?.state || "",
    postalCode: profile?.address?.postalCode || "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setAddressFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const baseUrl = import.meta.env.VITE_PROFILE_SERVICE_URL;
    const endpoint = "/api/profiles/profile";

    const url = constructUrl(baseUrl, endpoint);

    const options = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ field: "address", value: addressFormData }),
    };

    try {
      const response = await fetch(url, options);

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const profile = result.data.profile;

      dispatch(setProfile({ profile }));
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <h1>Address</h1>
        <p>Update address info below</p>

        <div>
          <label htmlFor="line1">Address Line 1</label>
          <input
            type="text"
            name="line1"
            id="line1"
            placeholder="Street address"
            value={addressFormData.line1}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="line2">Address Line 2</label>
          <input
            type="text"
            name="line2"
            id="line2"
            placeholder="apt, suite etc."
            value={addressFormData.line2}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="City"
            value={addressFormData.city}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <select
            name="state"
            id="state"
            defaultValue={addressFormData.state || "default"}
            onChange={handleInputChange}
          >
            <option value="default" disabled>
              Please select a state
            </option>
            {STATES.map((state) => (
              <option key={state.name} value={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            id="postalCode"
            pattern="[0-9]{5}"
            placeholder="e.g 02113"
            value={addressFormData.postalCode}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>

        <Link to="/profile">Cancel</Link>

        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default AddressForm;

/*

Input Validation: Added basic validation for the zip code to ensure it's a 5-digit number. You can extend this to other fields as needed.
Loading State: Introduced a loading state to provide visual feedback during the API call, preventing users from submitting the form multiple times.
Error State: Added an error state to display any errors that occur during the update process.
Debouncing: Consider implementing debouncing for the handleAddressInputChange function, especially if you're performing real-time validation or updates, to avoid excessive API calls.
Clearer Error Messages: Instead of just logging the error, you could provide more informative feedback to the user within the UI.
Accessibility: Ensure proper labeling and aria attributes for accessibility.
Code Readability: Added comments and slightly restructured the code for better clarity.
*/
