import { useSelector } from "react-redux";

import ProfileDetails from "./ProfileDetails";

function Profile() {
  const profile = useSelector((state) => state.user.profile);

  return <ProfileDetails isSelf={true} profile={profile} />;
}

export default Profile;
