import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import './Learning.css';
import { BookMarked, Code } from 'lucide-react';

const Resultats = () => {
  const { idTentative } = useParams();
  const navigate = useNavigate();
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si pas d'ID (accès depuis la sidebar), on pourrait charger le dernier résultat ou un dashboard global.
    // Ici on suppose qu'on a toujours un idTentative pour le ticket 4.
    const url = idTentative
      ? `/api/resultat/${idTentative}`
      : `/api/resultat/1`; // mock fallback

    axios.get(url)
      .then(response => {
        setResultat(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des résultats:', error);
        setLoading(false);
      });
  }, [idTentative]);

  if (loading) return <div className="learning-container">Chargement des résultats...</div>;
  if (!resultat) return <div className="learning-container">Résultats indisponibles.</div>;

  // Format data for Radar Chart
  const radarData = Object.keys(resultat.analyse).map(key => ({
    subject: key,
    A: resultat.analyse[key],
    fullMark: 100,
  }));

  // Mock progression data for bar chart
  const barData = [
    { name: 'Quiz 1', score: 75 },
    { name: 'Quiz 2', score: 82 },
    { name: 'Quiz 3', score: 68 },
    { name: 'Quiz 4', score: 90 },
    { name: 'Quiz 5', score: resultat.score_total },
  ];

  const getLevelInfo = (score) => {
    if (score >= 80) return { label: 'Expert', colorClass: 'expert' };
    if (score >= 50) return { label: 'Intermédiaire', colorClass: 'intermediate' };
    return { label: 'Débutant', colorClass: 'beginner' };
  };

  return (
    <div className="learning-container">
      <div className="learning-header">
        <h1>Résultats</h1>
      </div>

      <div className="results-dashboard">
        <div className="score-banner">
          <div className="score-circle">
            <h2>{Math.round(resultat.score_total)}%</h2>
            <span>Score total</span>
          </div>
          <h3>Félicitations !</h3>
          <p>Voici l'analyse complète de vos compétences</p>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h4>Compétences</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Compétences" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h4>Progression</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                  <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={
                        index === barData.length - 1 ? '#eab308' :
                          index % 2 === 0 ? '#3b82f6' : '#60a5fa'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Analyse détaillée</h3>
          <div className="charts-grid">
            {Object.entries(resultat.analyse).map(([skill, score]) => {
              const level = getLevelInfo(score);
              return (
                <div key={skill} className="detailed-analysis">
                  <div className="skill-row">
                    <div className="skill-header">
                      <span>{skill}</span>
                      <span className={`level-${level.colorClass}`}>{level.label}</span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className={`skill-bar-fill fill-${level.colorClass}`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {resultat.recommandations && resultat.recommandations.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Recommandations</h3>
            <div className="recommendations-grid">
              {resultat.recommandations.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="icon">
                    {rec.type === 'module' ? <BookMarked size={20} /> : <Code size={20} />}
                  </div>
                  <h4>Continuer avec ce module</h4>
                  <p>{rec.raison}</p>
                  <button className="btn-primary" onClick={() => navigate(`/apprentissage`)}>
                    Commencer
                  </button>
                </div>
              ))}

              {/* Hardcoded fallback recommendations to match UI if API doesn't return enough */}
              <div className="recommendation-card">
                <div className="icon"><BookMarked size={20} /></div>
                <h4>Continuons avec CSS Grid</h4>
                <p>Maîtrisez les layouts avancés avec CSS Grid pour créer des designs responsive.</p>
                <button className="btn-primary" onClick={() => navigate('/apprentissage')}>Commencer</button>
              </div>
              <div className="recommendation-card" style={{ borderColor: '#3b82f6', borderLeftWidth: '4px' }}>
                <div className="icon"><Code size={20} /></div>
                <h4>Pratiquez JavaScript</h4>
                <p>Faites des exercices pour améliorer vos compétences en JavaScript.</p>
                <button className="btn-primary" onClick={() => navigate('/apprentissage')}>Faire des exercices</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resultats;
