import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setProfile } from "../../store/features/userSlice";
import { validateEmail, validatePhoneNumber } from "../../utils/validate";

const PROFILE_SERVICE_URL = import.meta.env.VITE_PROFILE_SERVICE_URL;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleContactFormInputChange = (e) => {
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

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setIsSubmitting(true);

    const body = { field: "contact", value: contactFormData };

    try {
      const response = await fetch(
        `${PROFILE_SERVICE_URL}/api/profiles/profile`,
        {
          method: "PATCH",
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

      dispatch(setProfile({ profile }));
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("error :>> ", contactFormErrors);

  return (
    <>
      <form onSubmit={handleContactFormSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter a valid email"
          value={contactFormData.email}
          onChange={handleContactFormInputChange}
          onBlur={checkContactInfo}
        />
        {contactFormErrors.email && (
          <p className="error">{contactFormErrors.email}</p>
        )}

        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          id="phone"
          placeholder="Enter a valid phone number"
          pattern="[0-9]{10}"
          value={contactFormData.phoneNumber}
          onChange={handleContactFormInputChange}
          onBlur={checkContactInfo}
        />
        {contactFormErrors.phoneNumber && (
          <p className="error">{contactFormErrors.phoneNumber}</p>
        )}

        <button type="submit" disabled={isSubmitting || !isFormValid()}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>
        <Link to="/profile">Cancel</Link>
      </form>

      {error && <p className="error">{error}</p>}
    </>
  );
}

export default ContactForm;
