import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, Star, TrendingUp } from 'lucide-react';
import { fetchScore } from '../services/api';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState({
    value: 0,
    completedCount: 0,
    totalCount: 0,
    importantCompleted: 0,
    importantCount: 0,
  });

  useEffect(() => {
    let active = true;
    const getScore = async () => {
      try {
        const data = await fetchScore();
        if (active) setScore(data);
      } catch (err) {
        console.error('Error fetching score:', err);
      }
    };
    getScore();
    return () => {
      active = false;
    };
  }, [tasks]);

  const status = score.totalCount === 0
    ? 'Add your first task'
    : score.value >= 80
      ? 'Strong consistency'
      : score.value >= 50
        ? 'Building momentum'
        : 'Start with one task';

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score.value}
          <span>/ 100</span>
        </div>
        <p style={{ marginTop: '1rem', opacity: 0.7 }}>
          Weighted completion score: important tasks count twice.
        </p>
        <div className="score-breakdown">
          <span><CheckCircle2 size={16} /> {score.completedCount}/{score.totalCount} tasks complete</span>
          <span><Star size={16} /> {score.importantCompleted}/{score.importantCount} important complete</span>
        </div>
      </div>
      <div className="score-hero-right">
        <div className="status-badge" style={{ background: '#4ade80', color: '#064e3b', marginBottom: '1rem' }}>
          <TrendingUp size={16} />
          {status}
        </div>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Award size={48} />
        </div>
      </div>
    </div>
  );
};

export default ScoreWidget;
