import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addProfile } from "../../store/features/userSlice";

import { STATES } from "../../data/states";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AddressForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userProfile = useSelector((state) => state.user.profile);

  const [addressFormData, setAddressFormData] = useState({
    line1: userProfile.address?.street?.line1 || "",
    line2: userProfile.address?.street?.line2 || "",
    city: userProfile.address?.city || "",
    state: userProfile.address?.state || "",
    zip: userProfile.address?.zip || "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;

    setAddressFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/profiles/update-address`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(addressFormData),
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
    <form onSubmit={handleAddressFormSubmit}>
      <h2>Please enter your address</h2>
      <label htmlFor="line1">Address Line 1</label>
      <input
        type="text"
        name="line1"
        id="line1"
        placeholder="Street address"
        value={addressFormData.line1}
        onChange={handleAddressInputChange}
      />
      <label htmlFor="line2">Address Line 2</label>
      <input
        type="text"
        name="line2"
        id="line2"
        placeholder="apt, suite etc."
        value={addressFormData.line2}
        onChange={handleAddressInputChange}
      />
      <label htmlFor="city">City</label>
      <input
        type="text"
        name="city"
        id="city"
        placeholder="City"
        value={addressFormData.city}
        onChange={handleAddressInputChange}
      />
      <label htmlFor="state">State</label>
      <select
        name="state"
        id="state"
        defaultValue={addressFormData.state || "default"}
        onChange={handleAddressInputChange}
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
      <label htmlFor="zip">Zip Code</label>
      <input
        type="text"
        name="zip"
        id="zip"
        pattern="[0-9]{5}"
        placeholder="e.g 02113"
        value={addressFormData.zip}
        onChange={handleAddressInputChange}
      />
      <button type="submit">Update</button>
      <Link to="/profile">Cancel</Link>
    </form>
  );
}

export default AddressForm;
