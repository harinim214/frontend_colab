import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import "../styles/components.css";

export default function FileCard({ file, refresh }) {
  const { user } = useContext(AuthContext);

  const deleteFile = async () => {
    try {
      await API.delete(`/files/${file._id}`);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const isLead = user?.role === "TEAM_LEAD";
  const isOwner = file.uploadedBy?._id === user?.id;

  return (
    <div className="file-card">
      <p>{file.fileName}</p>

      <a href={file.fileUrl} target="_blank" rel="noreferrer">
        View
      </a>

      <p style={{ fontSize: "12px" }}>
        Uploaded by: {file.uploadedBy?.name}
      </p>

      {(isLead || isOwner) && (
        <button onClick={deleteFile}>Delete</button>
      )}
    </div>
  );
}