import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import "../styles/profile.css";

export default function Profile() {

  const { user, setUser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null);

  if (!user) return <p>Loading...</p>;

  const handleImageUpload = async () => {
    try {
      if (!image) return alert("Select image");

      const formData = new FormData();
      formData.append("avatar", image);

      const res = await API.post("/auth/upload-avatar", formData);

      setUser(res.data.user);  

      alert("Profile picture updated");

    } catch (error) {
      alert("Upload failed");
    }
  };

  return (
    <div className="profile-page">

      <div className="profile-header">
        <h2>Profile</h2>
        <button onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-card">

        {user.profileImage ? (
          <img
            src={`${user.profileImage}?t=${Date.now()}`}   // 🔥 cache fix
            alt="avatar"
            className="profile-avatar-img"
          />
        ) : (
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h3>{user.name}</h3>
        <p>{user.email}</p>

        {editMode && (
          <>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button onClick={handleImageUpload}>
              Upload Picture
            </button>
          </>
        )}

      </div>
    </div>
  );
}