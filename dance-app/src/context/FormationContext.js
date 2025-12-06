import React, { createContext, useContext, useState } from 'react';

const FormationContext = createContext();

export const useFormations = () => {
  const context = useContext(FormationContext);
  if (!context) {
    throw new Error('useFormations must be used within FormationProvider');
  }
  return context;
};

const DANCER_COLORS = [
  { color: '#93C5FD', borderColor: '#3B82F6', textColor: '#1E40AF' },
  { color: '#FDE047', borderColor: '#EAB308', textColor: '#713F12' },
  { color: '#FCA5A5', borderColor: '#EF4444', textColor: '#991B1B' },
  { color: '#FDBA74', borderColor: '#F97316', textColor: '#9A3412' },
  { color: '#86EFAC', borderColor: '#22C55E', textColor: '#14532D' },
  { color: '#C4B5FD', borderColor: '#8B5CF6', textColor: '#5B21B6' },
  { color: '#F9A8D4', borderColor: '#EC4899', textColor: '#9F1239' },
  { color: '#7DD3FC', borderColor: '#0EA5E9', textColor: '#0C4A6E' },
  { color: '#FCD34D', borderColor: '#F59E0B', textColor: '#78350F' },
  { color: '#A7F3D0', borderColor: '#10B981', textColor: '#064E3B' },
];

const generateInitials = (name) => {
  if (!name || name.trim().length === 0) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const generateId = (name, existingIds = []) => {
  if (!name || name.trim().length === 0) {
    let id = `D${Date.now()}`;
    while (existingIds.includes(id)) {
      id = `D${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    return id;
  }
  const parts = name.trim().split(/\s+/);
  let baseId;
  if (parts.length >= 2) {
    baseId = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else {
    baseId = name.substring(0, 2).toUpperCase();
  }
  
  let id = baseId;
  let counter = 1;
  while (existingIds.includes(id)) {
    id = `${baseId}${counter}`;
    counter++;
  }
  return id;
};

export const FormationProvider = ({ children }) => {
  const initialDancers = [
    { id: 'KV', name: 'Kevin', initials: 'KV', color: '#93C5FD', borderColor: '#3B82F6', textColor: '#1E40AF' },
    { id: 'MP', name: 'Mary', initials: 'MP', color: '#FDE047', borderColor: '#EAB308', textColor: '#713F12' },
    { id: 'AT', name: 'Alex', initials: 'AT', color: '#FCA5A5', borderColor: '#EF4444', textColor: '#991B1B' },
    { id: 'RS', name: 'Ryan', initials: 'RS', color: '#FDBA74', borderColor: '#F97316', textColor: '#9A3412' },
    { id: 'NI', name: 'Nina', initials: 'NI', color: '#86EFAC', borderColor: '#22C55E', textColor: '#14532D' },
  ];

  const initialPositions = {};
  initialDancers.forEach(dancer => {
    initialPositions[dancer.id] = { x: 6, y: 6 };
  });

  const [dancers, setDancers] = useState(initialDancers);

  const [formations, setFormations] = useState([
    {
      id: 1,
      time: 0,
      positions: initialPositions,
    },
  ]);

  const [messages, setMessages] = useState([]);

  const addFormation = (time) => {
    const newId = Math.max(...formations.map(f => f.id), 0) + 1;
    const lastFormation = formations[formations.length - 1];
    const formationTime = time !== undefined && time !== null ? time : (formations.length * 60);
    const formationSecond = Math.floor(formationTime);
    
    const hasConflict = formations.some(f => Math.floor(f.time) === formationSecond);
    if (hasConflict) {
      return null;
    }
    
    const defaultPositions = {};
    dancers.forEach(dancer => {
      if (lastFormation && lastFormation.positions[dancer.id]) {
        defaultPositions[dancer.id] = lastFormation.positions[dancer.id];
      } else {
        defaultPositions[dancer.id] = { x: 6, y: 6 };
      }
    });
    
    const newFormation = {
      id: newId,
      time: formationTime,
      positions: lastFormation ? { ...lastFormation.positions } : defaultPositions
    };
    setFormations([...formations, newFormation].sort((a, b) => a.time - b.time));
    return newId;
  };

  const removeFormation = (id) => {
    setFormations(formations.filter(f => f.id !== id));
  };

  const updateFormation = (id, updates) => {
    if (updates.time !== undefined) {
      const newTimeSecond = Math.floor(updates.time);
      const hasConflict = formations.some(f => f.id !== id && Math.floor(f.time) === newTimeSecond);
      if (hasConflict) {
        return false;
      }
    }
    setFormations(formations.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
    return true;
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

  const addDancer = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    
    if (dancers.length >= 20) {
      return null;
    }
    
    const existingIds = dancers.map(d => d.id);
    const newId = generateId(trimmedName, existingIds);
    const initials = generateInitials(trimmedName);
    const colorIndex = dancers.length % DANCER_COLORS.length;
    const colors = DANCER_COLORS[colorIndex];
    
    const newDancer = {
      id: newId,
      name: trimmedName,
      initials: initials,
      ...colors
    };
    
    setDancers([...dancers, newDancer]);
    
    setFormations(formations.map(f => ({
      ...f,
      positions: {
        ...f.positions,
        [newId]: { x: 6, y: 6 }
      }
    })));
    
    return newDancer;
  };

  const updateDancer = (dancerId, updates) => {
    setDancers(dancers.map(d => 
      d.id === dancerId ? { ...d, ...updates } : d
    ));
  };

  const removeDancer = (dancerId) => {
    setDancers(dancers.filter(d => d.id !== dancerId));
    
    setFormations(formations.map(f => {
      const newPositions = { ...f.positions };
      delete newPositions[dancerId];
      return {
        ...f,
        positions: newPositions
      };
    }));
  };

  const addMessage = (dancerId, messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage) return null;
    
    const newMessage = {
      id: Date.now(),
      dancerId: dancerId,
      message: trimmedMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    return newMessage;
  };

  const markMessageAsRead = (messageId) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
  };

  const deleteMessage = (messageId) => {
    setMessages(messages.filter(m => m.id !== messageId));
  };

  const value = {
    dancers,
    formations,
    setFormations,
    addFormation,
    removeFormation,
    updateFormation,
    updateDancerPosition,
    addDancer,
    removeDancer,
    updateDancer,
    messages,
    addMessage,
    markMessageAsRead,
    deleteMessage,
  };

  return (
    <FormationContext.Provider value={value}>
      {children}
    </FormationContext.Provider>
  );
};

