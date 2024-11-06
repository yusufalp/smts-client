import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Header from "./shared/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";

import PrivateRoutes from "./components/PrivateRoutes";

import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Advisor from "./components/Advisor";
import Learner from "./components/Learner";
import Meeting from "./components/Meeting";

import MeetingForm from "./components/Forms/MeetingForm";
import EmailForm from "./components/Forms/EmailForm";
import AddressForm from "./components/Forms/AddressForm";
import LinksForm from "./components/Forms/LinksForm";
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/advisor/:advisorId" element={<Advisor />} />
          <Route path="/mentee/:menteeId" element={<Learner />} />
          <Route path="/meeting/:meetingId" element={<Meeting />} />
          <Route path="/meeting-form" element={<MeetingForm />} />
          <Route path="/email-form" element={<EmailForm />} />
          <Route path="/address-form" element={<AddressForm />} />
          <Route path="/links-form" element={<LinksForm />} />
          <Route
            path="/admin/update/profile/:userId"
            element={<UpdateUser />}
          />
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </Layout>
  );
}

export default App;
