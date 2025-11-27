import React, { createContext, useContext, useState } from 'react';

const FormationContext = createContext();

export const useFormations = () => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations must be used within FormationProvider');
  }
  return context;
};

export const FormationProvider = ({ children }) => {
  const [dancers] = useState([
    { id: 'KV', initials: 'KV', color: '#93C5FD', borderColor: '#3B82F6', textColor: '#1E40AF' },
    { id: 'MP', initials: 'MP', color: '#FDE047', borderColor: '#EAB308', textColor: '#713F12' },
    { id: 'AT', initials: 'AT', color: '#FCA5A5', borderColor: '#EF4444', textColor: '#991B1B' },
    { id: 'RS', initials: 'RS', color: '#FDBA74', borderColor: '#F97316', textColor: '#9A3412' },
    { id: 'NI', initials: 'NI', color: '#86EFAC', borderColor: '#22C55E', textColor: '#14532D' },
  ]);

  const [formations, setFormations] = useState([
    {
      id: 1,
      time: 0,
      positions: {
        'KV': { x: 6, y: 6 },
        'MP': { x: 6, y: 6 },
        'AT': { x: 6, y: 6 },
        'RS': { x: 6, y: 6 },
        'NI': { x: 6, y: 6 },
      }
    },
  ]);

  const addFormation = (time) => {
    const newId = Math.max(...formations.map(f => f.id), 0) + 1;
    const lastFormation = formations[formations.length - 1];
    const formationTime = time !== undefined && time !== null ? time : (formations.length * 60);
    const newFormation = {
      id: newId,
      time: formationTime,
      positions: lastFormation ? { ...lastFormation.positions } : {
        'KV': { x: 6, y: 6 },
        'MP': { x: 6, y: 6 },
        'AT': { x: 6, y: 6 },
        'RS': { x: 6, y: 6 },
        'NI': { x: 6, y: 6 },
      }
    };
    setFormations([...formations, newFormation].sort((a, b) => a.time - b.time));
    return newId;
  };

  const removeFormation = (id) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  const updateFormation = (id, updates) => {
    setFormations(formations.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const updateDancerPosition = (formationId, dancerId, position) => {
    setFormations(formations.map(f => {
      if (f.id === formationId) {
        return {
          ...f,
          positions: {
            ...f.positions,
            [dancerId]: position
          }
        };
      }
      return f;
    }));
  };

  const value = {
    dancers,
    formations,
    setFormations,
    addFormation,
    removeFormation,
    updateFormation,
    updateDancerPosition,
  };

  return (
    <FormationContext.Provider value={value}>
      {children}
    </FormationContext.Provider>
  );
};

