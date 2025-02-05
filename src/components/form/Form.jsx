import { useParams } from "react-router-dom";

import MeetingForm from "./MeetingForm";
import AboutMeForm from "./AboutMeForm";
import ContactForm from "./ContactForm";
import AddressForm from "./AddressForm";
import LinksForm from "./LinksForm";

function Form() {
  const { type } = useParams();

  return type === "meeting-form" ? (
    <MeetingForm />
  ) : type === "about-me" ? (
    <AboutMeForm />
  ) : type === "contact" ? (
    <ContactForm />
  ) : type === "address" ? (
    <AddressForm />
  ) : type === "links" ? (
    <LinksForm />
  ) : (
    <p>Invalid Form</p>
  );
}

export default Form;
