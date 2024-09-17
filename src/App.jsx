import { Routes, Route } from "react-router-dom";

import Header from "./shared/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoutes from "./components/PrivateRoutes";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/MenteeProfile";
import MeetingForm from "./components/Forms/MeetingForm";
import EmailForm from "./components/Forms/EmailForm";
import AddressForm from "./components/Forms/AddressForm";
import LinksForm from "./components/Forms/LinksForm";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" index element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/meeting-form" element={<MeetingForm />} />
          <Route path="/email-form" element={<EmailForm />} />
          <Route path="/address-form" element={<AddressForm />} />
          <Route path="/links-form" element={<LinksForm />} />
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </>
  );
}

export default App;
