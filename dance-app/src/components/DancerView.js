import React, { useState, useMemo, useEffect } from 'react';
import StageGrid from './StageGrid';
import Timeline from './Timeline';
import { useFormations } from '../context/FormationContext';
import './DancerView.css';

const DancerView = ({ dancerId = 'KV' }) => {
  const { dancers, formations, addMessage } = useFormations();
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastEdited] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  }));

  const totalTime = 180;

  const { currentFormation, nextFormation, currentFormationIndex } = useMemo(() => {
    const sortedFormations = [...formations].sort((a, b) => a.time - b.time);
    let formationIndex = sortedFormations.findIndex((f, i) => {
      const nextFormation = sortedFormations[i + 1];
      return currentTime >= f.time && (!nextFormation || currentTime < nextFormation.time);
    });
    
    if (formationIndex === -1) {
      formationIndex = sortedFormations.length - 1;
    }
    
    const current = sortedFormations[formationIndex] || sortedFormations[0];
    const next = sortedFormations[formationIndex + 1];
    
    return {
      currentFormation: current,
      nextFormation: next,
      currentFormationIndex: formationIndex,
    };
  }, [formations, currentTime]);

  const currentDancer = dancers.find(d => d.id === dancerId);

  const handleTimeChange = (time) => {
    setCurrentTime(time);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

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

  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage(dancerId, message);
      setMessage('');
    }
  };

  return (
    <div className="dancer-view">
      <div className="warning-banner">
        <div className="warning-icon">⚠</div>
        <div className="warning-content">
          <strong>Walk Formation</strong>
          <p>Follow the dotted line to your next position. Watch for other dancers to avoid collisions.</p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="card-title">Your Movement</h3>
        <div className="dancer-info">
          <div 
            className="dancer-avatar"
            style={{
              backgroundColor: currentDancer?.color,
              borderColor: currentDancer?.borderColor,
              color: currentDancer?.textColor,
            }}
          >
            {currentDancer?.initials}
          </div>
          <span className="dancer-label">You</span>
        </div>
        <p className="movement-instruction">
          Follow the dotted path line from your current position to your next position. 
          The path is calculated to minimize collisions with other dancers.
        </p>
      </div>

      <Timeline
        currentTime={currentTime}
        totalTime={totalTime}
        formations={formations}
        currentFormationIndex={currentFormationIndex}
        onTimeChange={handleTimeChange}
        onPlayPause={handlePlayPause}
        isPlaying={isPlaying}
      />

      <div className="stage-preview">
        <StageGrid
          dancers={dancers}
          currentFormation={currentFormation}
          nextFormation={nextFormation}
          showNextFormation={true}
          currentDancerId={dancerId}
          currentTime={currentTime}
          currentFormationTime={currentFormation ? currentFormation.time : 0}
          nextFormationTime={nextFormation ? nextFormation.time : null}
        />
      </div>

      <div className="content-card">
        <h3 className="card-title">Message to Choreo Head</h3>
        <input
          type="text"
          className="message-input"
          placeholder="Have questions or concerns about this formation?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button 
          className="send-button"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>

      <div className="last-edited">
        Last edited {lastEdited}
      </div>
    </div>
  );
};

export default DancerView;

