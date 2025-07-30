import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');

    if (!loginData.username || !loginData.password) {
      alert("Login required");
      navigate('/enter/login');
      return;
    }

    fetch('https://localhost:7248/api/dashboard/leaderboard-today')
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));

    fetch('https://localhost:7248/api/dashboard/correct-graph')
      .then((res) => res.json())
      .then((data) => setGraphData(data));
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <div className="graph-box">
        <h3>📊 Top Correct Answers (All Time)</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graphData} margin={{ left: 20, right: 20 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalCorrect" barSize={graphData.length < 5 ? 60 : 30}>
                {graphData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#8884d8" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="leaderboard-box">
        <h3>🏆 Today's Leaderboard</h3>
        <div className="table-responsive">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th style={{ width: '60px' }}>Photo</th>
                <th>Name</th>
                <th>Username</th>
                <th style={{ width: '60px' }}>Correct</th>
                <th style={{ width: '60px' }}>Rank</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={entry.username || entry.Username}>
                  <td>{idx + 1}</td>
                  <td>
                    <img
                      src={
                        entry.photo
                          ? `https://localhost:7248/${entry.photo.replace(/\\/g, '/')}`
                          : '/profile-icon.svg' // Use your profile icon SVG or PNG here
                      }
                      alt="profile"
                      className="leader-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/profile-icon.svg'; // Fallback to icon if image fails
                      }}
                    />
                  </td>
                  <td>{entry.name || entry.Name}</td>
                  <td>{entry.username || entry.Username}</td>
                  <td>{entry.totalCorrect || entry.TotalCorrect}</td>
                  <td>{entry.rank || entry.Rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
