import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import UploadModal from "../components/UploadModal";
import FileCard from "../components/FileCard";
import ActivityPanel from "../components/ActivityPanel";
import "../styles/team.css";

export default function TeamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [myRole, setMyRole] = useState("");
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(null); 

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      await Promise.all([
        fetchTeam(),
        fetchFiles(),
        fetchAnalytics()
      ]);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    const res = await API.get(`/teams/${id}`);
    setTeam(res.data.team);
    setMyRole(res.data.myRole);
  };

  const fetchFiles = async () => {
    const res = await API.get(`/files/team/${id}`);
    setFiles(res.data.files || []);   // ✅ FIXED
  };

  const fetchAnalytics = async () => {
    const res = await API.get(`/teams/${id}/analytics`);
    setAnalytics(res.data.analytics);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return alert("Email required");

    await API.post(`/teams/${id}/invite`, { email: inviteEmail });
    setInviteEmail("");
    fetchTeam();
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm("Delete this team?")) return;
    await API.delete(`/teams/${id}`);
    navigate("/dashboard");
  };

  if (loading) return <p>Loading...</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div className="team-page">

      {/* ===== HEADER ===== */}
      <div className="team-header">
        <div>
          <h2>{team.name}</h2>
          <p className="role-badge">{myRole}</p>
        </div>

        {myRole === "TEAM_LEAD" && (
          <button className="delete-btn" onClick={handleDeleteTeam}>
            Delete Team
          </button>
        )}
      </div>

      {/* ===== ANALYTICS ===== */}
      {analytics && (
        <div className="analytics-grid">

          <div
            className="analytics-card clickable"
            onClick={() => setViewMode("members")}
          >
            <h4>Total Members</h4>
            <p>{analytics.totalMembers}</p>
          </div>

          <div
            className="analytics-card clickable"
            onClick={() => setViewMode("files")}
          >
            <h4>Total Files</h4>
            <p>{analytics.totalFiles}</p>
          </div>

          <div className="analytics-card">
            <h4>Files Today</h4>
            <p>{analytics.filesToday}</p>
          </div>

          <div className="analytics-card">
            <h4>Activities</h4>
            <p>{analytics.totalActivities}</p>
          </div>

        </div>
      )}

      {/* ===== DETAIL SECTION ===== */}
      {viewMode && (
        <div className="detail-section">

          <div className="detail-header">
            <h3>
              {viewMode === "members"
                ? "Team Members"
                : "Shared Files"}
            </h3>

            <button
              className="close-detail"
              onClick={() => setViewMode(null)}
            >
              ✕
            </button>
          </div>

          {/* MEMBERS VIEW */}
          {viewMode === "members" &&
            team.members.map((member) => (
              <div key={member._id} className="detail-item">
                <div>
                  <strong>{member.user.name}</strong>
                  <p>{member.user.email}</p>
                </div>
                <span>{member.role}</span>
              </div>
            ))}

          {/* FILES VIEW */}
          {viewMode === "files" &&
            (files.length === 0 ? (
              <p>No files uploaded</p>
            ) : (
              files.map((file) => (
                <div key={file._id} className="detail-item">
                  <div>
                    <strong>{file.fileName}</strong>
                    <p>
                      Uploaded by:{" "}
                      {file.uploadedBy?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              ))
            ))}
        </div>
      )}

      {/* ===== INVITE ===== */}
      {myRole === "TEAM_LEAD" && (
        <div className="invite-section">
          <input
            type="email"
            placeholder="Invite member by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <button onClick={handleInvite}>Invite</button>
        </div>
      )}

      {/* ===== UPLOAD ===== */}
      <div className="upload-section">
        <UploadModal teamId={id} refresh={fetchFiles} />
      </div>

      {/* ===== FILE GRID ===== */}
      <div className="files-section">
        <h3>Files</h3>

        {files.length === 0 ? (
          <p>No files uploaded</p>
        ) : (
          <div className="file-grid">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                refresh={fetchFiles}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== ACTIVITY ===== */}
      <div className="activity-section">
        <ActivityPanel teamId={id} />
      </div>

    </div>
  );
}