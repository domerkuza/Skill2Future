import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Learning.css';
import { PlayCircle, CheckCircle, Code, ArrowLeft } from 'lucide-react';

const DetailsModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/module/${id}`)
      .then(response => {
        setModule(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails du module:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="learning-container">Chargement...</div>;
  if (!module) return <div className="learning-container">Module introuvable.</div>;

  return (
    <div className="learning-container">
      <div className="learning-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/apprentissage')} style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>{module.titre}</h1>
          <p style={{ color: '#64748b', margin: 0 }}>{module.description}</p>
        </div>
      </div>

      <div className="module-details">
        <h3>Leçons ({module.lecons?.length || 0})</h3>
        <div className="lessons-list">
          {module.lecons && module.lecons.map((lecon, index) => (
            <div key={lecon.id} className={`lesson-item ${index === 0 ? 'completed' : ''}`}>
              <div className="lesson-icon">
                {index === 0 ? <CheckCircle size={24} /> : <PlayCircle size={24} />}
              </div>
              <div className="lesson-content">
                <h4>{lecon.titre}</h4>
                <p>Leçon {lecon.ordre}</p>
              </div>
              <button className="btn-secondary" style={{ marginLeft: 'auto' }}>
                {index === 0 ? 'Revoir' : 'Commencer'}
              </button>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '2rem' }}>Exercices ({module.exercices?.length || 0})</h3>
        <div className="lessons-list">
          {module.exercices && module.exercices.map(exo => (
            <div key={exo.id} className="lesson-item">
              <div className="lesson-icon">
                <Code size={24} />
              </div>
              <div className="lesson-content">
                <h4>{exo.titre}</h4>
                <p>Difficulté: {exo.difficulte}</p>
              </div>
              <button className="btn-secondary" style={{ marginLeft: 'auto' }}>
                Pratiquer
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate(`/apprentissage/quiz/${module.id}`)}>
            Passer le Quiz de Validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModule;
