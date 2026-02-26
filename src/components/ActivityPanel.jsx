import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/components.css";

export default function ActivityPanel({ teamId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, [teamId]);

  const fetchLogs = async () => {
    try {
      const res = await API.get(`/activity/${teamId}`);
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="activity-panel">
      <h3>Activity Timeline</h3>

      {logs.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className="activity-item">
            <strong>{log.user?.name}</strong> {log.action}
          </div>
        ))
      )}
    </div>
  );
}