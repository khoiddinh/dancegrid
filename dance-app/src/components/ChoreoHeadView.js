import React, { useState, useEffect } from 'react';
import StageGrid from './StageGrid';
import Timeline from './Timeline';
import { useFormations } from '../context/FormationContext';
import './ChoreoHeadView.css';

const ChoreoHeadView = () => {
  const { 
    dancers, 
    formations, 
    addFormation, 
    removeFormation, 
    updateFormation,
    updateDancerPosition,
    addDancer,
    removeDancer,
    updateDancer
  } = useFormations();
  
  const [currentFormationIndex, setCurrentFormationIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState({});
  const [selectedDancerId, setSelectedDancerId] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('keyframes'); // 'keyframes' or 'dancers'
  const [newDancerName, setNewDancerName] = useState('');
  const [editingInitials, setEditingInitials] = useState({});

  const sortedFormations = [...formations].sort((a, b) => a.time - b.time); // need to make sure the formations sorted chrono
  
  const getFormationsForTime = (time) => {
    if (sortedFormations.length === 0) return { current: null, next: null, currentIndex: 0 };
    
    let current = sortedFormations[0];
    let next = null;
    let currentIdx = 0;
    
    for (let i = 0; i < sortedFormations.length; i++) {
      if (time >= sortedFormations[i].time) {
        current = sortedFormations[i];
        next = sortedFormations[i + 1] || null;
        currentIdx = i;
      } else {
        break;
      }
    }
    
    return { current, next, currentIndex: currentIdx };
  };
  
  const { current: timeBasedFormation, next: timeBasedNextFormation } = getFormationsForTime(currentTime);
  
  const currentFormation = sortedFormations.length > 0 
    ? (sortedFormations[currentFormationIndex] || sortedFormations[0])
    : null;
  const nextFormation = sortedFormations.length > 0 
    ? sortedFormations[currentFormationIndex + 1]
    : null;
  
  const displayFormation = timeBasedFormation;
  const displayNextFormation = timeBasedNextFormation;
  
  const totalTime = 180;

  useEffect(() => {
    if (sortedFormations.length > 0) {
      const index = sortedFormations.findIndex((f, i) => {
        const nextFormation = sortedFormations[i + 1];
        return currentTime >= f.time && (!nextFormation || currentTime < nextFormation.time);
      });
      const targetIndex = index !== -1 ? index : sortedFormations.length - 1;
      if (targetIndex !== currentFormationIndex && targetIndex < sortedFormations.length) {
        setCurrentFormationIndex(targetIndex);
      } else if (currentFormationIndex >= sortedFormations.length) {
        setCurrentFormationIndex(Math.max(0, sortedFormations.length - 1));
      }
    } else {
      setCurrentFormationIndex(0);
    }
  }, [formations.length, currentTime]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1;
          if (newTime >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return newTime;
        });
      }, 100);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, totalTime]);

  const handlePreviousFormation = () => {
    if (currentFormationIndex > 0) {
      setCurrentFormationIndex(currentFormationIndex - 1);
    }
  };

  const handleNextFormation = () => {
    if (currentFormationIndex < sortedFormations.length - 1) {
      setCurrentFormationIndex(currentFormationIndex + 1);
    }
  };

  const handleTimeChange = (time) => {
    setCurrentTime(time);
    handleTimeToFormation(time);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNotesChange = (formationId, text) => {
    setNotes({ ...notes, [formationId]: text });
  };

  const handleAddFormation = () => {
    const newTime = currentTime;
    addFormation(newTime);
  };

  const handleRemoveFormation = () => {
    if (sortedFormations.length > 0 && currentFormation) {
      removeFormation(currentFormation.id);
      const newIndex = Math.min(currentFormationIndex, sortedFormations.length - 2);
      if (newIndex >= 0) {
        setCurrentFormationIndex(newIndex);
      } else {
        setCurrentFormationIndex(0);
      }
    }
  };

  const handleDancerMove = (formationId, dancerId, position) => {
    updateDancerPosition(formationId, dancerId, position);
  };

  const handleTimeToFormation = (time) => {
    const formationIndex = formations.findIndex((f, i) => {
      const nextFormation = formations[i + 1];
      return time >= f.time && (!nextFormation || time < nextFormation.time);
    });
    if (formationIndex !== -1) {
      setCurrentFormationIndex(formationIndex);
    }
  };

  const handleAddDancer = () => {
    if (newDancerName.trim()) {
      const result = addDancer(newDancerName.trim());
      if (result === null) {
        alert('Maximum of 20 dancers allowed.');
      } else {
        setNewDancerName('');
      }
    }
  };

  const handleInitialsChange = (dancerId, newInitials) => {
    const cleaned = newInitials.toUpperCase().substring(0, 3);
    setEditingInitials({ ...editingInitials, [dancerId]: cleaned });
  };

  const handleInitialsBlur = (dancerId) => {
    const newInitials = editingInitials[dancerId] || '';
    if (newInitials.trim().length >= 1) {
      updateDancer(dancerId, { initials: newInitials.trim().substring(0, 3) });
    }
    const newEditing = { ...editingInitials };
    delete newEditing[dancerId];
    setEditingInitials(newEditing);
  };

  const handleInitialsKeyPress = (e, dancerId) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleRemoveDancer = (dancerId) => {
    if (window.confirm('Are you sure you want to remove this dancer? This will remove them from all formations.')) {
      removeDancer(dancerId);
      if (selectedDancerId === dancerId) {
        setSelectedDancerId(null);
      }
    }
  };

  return (
    <div className="choreo-head-view">
      <div className="view-header">
        <h1 className="view-title">Stage View</h1>
      </div>

      <div className="main-content">
        <div className="keyframes-sidebar">
          <div className="sidebar-tabs">
            <button
              className={`sidebar-tab ${sidebarTab === 'keyframes' ? 'active' : ''}`}
              onClick={() => setSidebarTab('keyframes')}
            >
              Keyframes
            </button>
            <button
              className={`sidebar-tab ${sidebarTab === 'dancers' ? 'active' : ''}`}
              onClick={() => setSidebarTab('dancers')}
            >
              Dancers
            </button>
          </div>

          {sidebarTab === 'keyframes' && (
            <>
              <div className="sidebar-header">
                <h3>Keyframes</h3>
                <button className="add-formation-button" onClick={handleAddFormation}>
                  + Add
                </button>
              </div>
              <div className="keyframes-list">
                {sortedFormations.length === 0 ? (
                  <p className="no-keyframes">No keyframes yet. Click "+ Add" to create one.</p>
                ) : (
                  sortedFormations.map((formation, index) => {
                    const formatTime = (seconds) => {
                      const mins = Math.floor(seconds / 60);
                      const secs = Math.floor(seconds % 60);
                      return `${mins}:${secs.toString().padStart(2, '0')}`;
                    };
                    const isSelected = index === currentFormationIndex;
                    return (
                      <div
                        key={formation.id}
                        className={`keyframe-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setIsPlaying(false);
                          setCurrentFormationIndex(index);
                          setCurrentTime(formation.time);
                        }}
                      >
                        <div className="keyframe-header">
                          <span className="keyframe-number">F{index + 1}</span>
                          <span className="keyframe-time">{formatTime(formation.time)}</span>
                          {sortedFormations.length > 1 && (
                            <button
                              className="keyframe-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected && index > 0) {
                                  setCurrentFormationIndex(index - 1);
                                } else if (isSelected && index === 0 && sortedFormations.length > 1) {
                                  setCurrentFormationIndex(0);
                                }
                                removeFormation(formation.id);
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {isSelected && (
                          <div className="keyframe-editing-indicator">
                            <span>Editing this keyframe</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {sidebarTab === 'dancers' && (
            <>
              <div className="sidebar-header">
                <h3>Dancers</h3>
              </div>
              <div className="dancers-list">
                <div className="add-dancer-form">
                  <input
                    type="text"
                    className="dancer-name-input"
                    placeholder="Enter dancer name"
                    value={newDancerName}
                    onChange={(e) => setNewDancerName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddDancer();
                      }
                    }}
                  />
                  <button 
                    className="add-dancer-button" 
                    onClick={handleAddDancer}
                    disabled={dancers.length >= 20}
                  >
                    + Add
                  </button>
                </div>
                {dancers.length >= 20 && (
                  <p className="dancer-limit-message">Maximum of 20 dancers reached.</p>
                )}
                {dancers.length === 0 ? (
                  <p className="no-dancers">No dancers yet. Add one above.</p>
                ) : (
                  dancers.map((dancer) => (
                    <div key={dancer.id} className="dancer-item">
                      <div className="dancer-item-content">
                        <div
                          className="dancer-avatar-small"
                          style={{
                            backgroundColor: dancer.color,
                            borderColor: dancer.borderColor,
                            color: dancer.textColor,
                          }}
                        >
                          {editingInitials[dancer.id] !== undefined ? editingInitials[dancer.id] : dancer.initials}
                        </div>
                        <div className="dancer-info">
                          <div className="dancer-name">{dancer.name}</div>
                          <input
                            type="text"
                            className="dancer-initials-input"
                            value={editingInitials[dancer.id] !== undefined ? editingInitials[dancer.id] : dancer.initials}
                            onChange={(e) => handleInitialsChange(dancer.id, e.target.value)}
                            onBlur={() => handleInitialsBlur(dancer.id)}
                            onKeyPress={(e) => handleInitialsKeyPress(e, dancer.id)}
                            maxLength={3}
                            placeholder="Initials"
                          />
                        </div>
                      </div>
                      {dancers.length > 1 && (
                        <button
                          className="dancer-delete"
                          onClick={() => handleRemoveDancer(dancer.id)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="stage-area">
          <div className="stage-controls">
            <div className="dancer-selector">
              <span>Select dancer to move: </span>
              {dancers.map(dancer => (
                <button
                  key={dancer.id}
                  className={`dancer-select-button ${selectedDancerId === dancer.id ? 'active' : ''}`}
                  onClick={() => setSelectedDancerId(selectedDancerId === dancer.id ? null : dancer.id)}
                  style={{
                    backgroundColor: selectedDancerId === dancer.id ? dancer.color : 'white',
                    borderColor: dancer.borderColor,
                    color: selectedDancerId === dancer.id ? dancer.textColor : dancer.borderColor,
                  }}
                >
                  {dancer.initials}
                </button>
              ))}
            </div>
          </div>

          <StageGrid
            dancers={dancers}
            currentFormation={displayFormation}
            nextFormation={displayNextFormation}
            showNextFormation={true}
            editable={!isPlaying}
            onDancerMove={handleDancerMove}
            selectedDancerId={selectedDancerId}
            onDancerSelect={setSelectedDancerId}
            currentTime={currentTime}
            currentFormationTime={displayFormation ? displayFormation.time : 0}
            nextFormationTime={displayNextFormation ? displayNextFormation.time : null}
          />

          <Timeline
            currentTime={currentTime}
            totalTime={totalTime}
            formations={sortedFormations}
            currentFormationIndex={currentFormationIndex}
            onTimeChange={handleTimeChange}
            onPlayPause={handlePlayPause}
            isPlaying={isPlaying}
            onFormationClick={(index) => {
              setIsPlaying(false);
              setCurrentFormationIndex(index);
              if (sortedFormations[index]) {
                setCurrentTime(sortedFormations[index].time);
              }
            }}
          />
        </div>
      </div>

      <div className="formation-navigation">
        <button
          className="nav-button"
          onClick={handlePreviousFormation}
          disabled={currentFormationIndex === 0}
        >
          ← {currentFormationIndex === 0 ? 'Formation 0' : `Formation ${currentFormationIndex}`}
        </button>
        <span className="formation-counter">
          {sortedFormations.length > 0 
            ? `Formation ${currentFormationIndex + 1} of ${sortedFormations.length}`
            : 'No formations'}
        </span>
        <button
          className="nav-button"
          onClick={handleNextFormation}
          disabled={currentFormationIndex === sortedFormations.length - 1}
        >
          Formation {currentFormationIndex + 2} →
        </button>
      </div>

      <div className="notes-section">
        <h3 className="notes-title">Notes</h3>
        <textarea
          className="notes-textarea"
          placeholder="Add notes for this formation..."
          value={currentFormation ? (notes[currentFormation.id] || '') : ''}
          onChange={(e) => currentFormation && handleNotesChange(currentFormation.id, e.target.value)}
          disabled={!currentFormation}
        />
      </div>
    </div>
  );
};

export default ChoreoHeadView;

