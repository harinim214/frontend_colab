import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";
export default function Dashboard() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data.teams);
    } catch (err) {
      console.log(err);
    }
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      alert("Team name cannot be empty");
      return;
    }

    try {
      await API.post("/teams", { name: teamName });
      setTeamName("");
      fetchTeams();
    } catch (err) {
      alert("Failed to create team");
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Teams</h2>

      {teams.length === 0 ? (
        <p>No teams yet</p>
      ) : (
        teams.map((team) => (
          <div key={team._id} className="team-card">
            <Link to={`/team/${team._id}`}>
              <h3>{team.name}</h3>
            </Link>
          </div>
        ))
      )}

      {user?.role === "TEAM_LEAD" && (
        <>
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <button onClick={createTeam}>Create Team</button>
        </>
      )}
    </div>
  );
}