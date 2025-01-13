import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Header from "./components/common/Header";

import PrivateRoutes from "./routes/PrivateRoutes";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/profile/Profile";
import Advisor from "./components/advisor/Advisor";
import Learner from "./components/learner/Learner";
import Meeting from "./components/meeting/Meeting";

// import CreateProfileForm from "./components/Forms/CreateProfileForm";
import MeetingForm from "./components/form/MeetingForm";
import AboutMeForm from "./components/form/AboutMeForm";
import ContactForm from "./components/form/ContactForm";
import AddressForm from "./components/form/AddressForm";
import LinksForm from "./components/form/LinksForm";

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
