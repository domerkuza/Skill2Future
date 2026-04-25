import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Learning.css';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';

const Apprentissage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would pass the auth token. 
    // Assuming backend is running on standard port or relative path
    axios.get('/api/progression')
      .then(response => {
        setModules(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des modules:', error);
        setLoading(false);
      });
  }, []);

  const getIconClass = (titre) => {
    const title = titre.toLowerCase();
    if (title.includes('html')) return 'icon-html';
    if (title.includes('css')) return 'icon-css';
    if (title.includes('js') || title.includes('javascript')) return 'icon-js';
    if (title.includes('php')) return 'icon-php';
    if (title.includes('python')) return 'icon-python';
    if (title.includes('sql')) return 'icon-sql';
    return 'icon-html'; // default
  };

  const getIconContent = (titre) => {
    const title = titre.toLowerCase();
    if (title.includes('html')) return '5';
    if (title.includes('css')) return '3';
    if (title.includes('js') || title.includes('javascript')) return 'JS';
    if (title.includes('php')) return 'php';
    if (title.includes('python')) return 'py';
    if (title.includes('sql')) return 'db';
    return title.substring(0, 2).toUpperCase();
  };

  const handleModuleClick = (module) => {
    if (module.statut !== 'Verrouillé') {
      navigate(`/apprentissage/module/${module.id}`);
    }
  };

  if (loading) return <div className="learning-container">Chargement...</div>;

  return (
    <div className="learning-container">
      <div className="learning-header">
        <h1>Apprentissage</h1>
      </div>

      <div className="modules-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className="module-card"
            onClick={() => handleModuleClick(module)}
            style={{ opacity: module.statut === 'Verrouillé' ? 0.7 : 1, cursor: module.statut === 'Verrouillé' ? 'not-allowed' : 'pointer' }}
          >
            <div className="module-card-header">
              <div className={`module-icon ${getIconClass(module.titre)}`}>
                {getIconContent(module.titre)}
              </div>
              <div className="module-info">
                <h3>{module.titre}</h3>
                <p>{module.lecons_count} leçons</p>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>Progression</span>
                <span>{module.progression}%</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${module.progression}%` }}
                ></div>
              </div>

              <div className={`status-badge ${module.statut === 'Complété' ? 'status-completed' :
                  module.statut === 'En cours' ? 'status-inprogress' : 'status-locked'
                }`}>
                {module.statut === 'Complété' && <CheckCircle size={14} />}
                {module.statut === 'En cours' && <PlayCircle size={14} />}
                {module.statut === 'Verrouillé' && <Lock size={14} />}
                {module.statut}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Apprentissage;
