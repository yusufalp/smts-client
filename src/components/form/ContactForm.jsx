import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";
import { validateEmail, validatePhoneNumber } from "../../utils/validate";

import { constructUrl } from "../../utils/url";

function ContactForm() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const profile = useSelector((state) => state.user.profile);

  const [contactFormData, setContactFormData] = useState({
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
  });
  const [contactFormErrors, setContactFormErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setContactFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkContactInfo = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setContactFormErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value),
      }));
    }

    if (name === "phoneNumber") {
      setContactFormErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: validatePhoneNumber(value),
      }));
    }
  };

  const isFormValid = () => {
    return !Object.values(contactFormErrors).some((error) => error !== "");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

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
      body: JSON.stringify({ field: "contact", value: contactFormData }),
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
        <h1>Contact</h1>
        <p>Update contact info below</p>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter a valid email"
            value={contactFormData.email}
            onChange={handleInputChange}
            onBlur={checkContactInfo}
          />
          {contactFormErrors.email && (
            <p className="error">{contactFormErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phone"
            placeholder="Enter a valid phone number"
            pattern="[0-9]{10}"
            value={contactFormData.phoneNumber}
            onChange={handleInputChange}
            onBlur={checkContactInfo}
          />
          {contactFormErrors.phoneNumber && (
            <p className="error">{contactFormErrors.phoneNumber}</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>

        <Link to="/profile">Cancel</Link>

        {error && <p className="error">{error}</p>}
      </form>
    </>
  );
}

export default ContactForm;
