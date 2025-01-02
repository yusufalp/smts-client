import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Header from "./shared/Header";

import PrivateRoutes from "./components/routes/PrivateRoutes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import Advisor from "./components/Advisor";
import Learner from "./components/Learner";
import Meeting from "./components/Meeting";

// import CreateProfileForm from "./components/Forms/CreateProfileForm";
import MeetingForm from "./components/forms/MeetingForm";
import AboutMeForm from "./components/forms/AboutMeForm";
import ContactForm from "./components/forms/ContactForm";
import AddressForm from "./components/forms/AddressForm";
import LinksForm from "./components/forms/LinksForm";

import UpdateUser from "./components/UpdateUser";

import "./App.css";

function App() {
  return (
    <Layout>
      <Header />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/login" index element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/create-profile" element={<CreateProfileForm />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/advisor/:advisorId" element={<Advisor />} />
          <Route path="/learner/:learnerId" element={<Learner />} />
          <Route path="/meeting/:meetingId" element={<Meeting />} />
          <Route path="/meeting-form" element={<MeetingForm />} />
          <Route path="/about-me-form" element={<AboutMeForm />} />
          <Route path="/contact-form" element={<ContactForm />} />
          <Route path="/address-form" element={<AddressForm />} />
          <Route path="/links-form" element={<LinksForm />} />
          <Route
            path="/admin/update/profile/:profileId"
            element={<UpdateUser />}
          />
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Layout>
  );
}

export default App;
