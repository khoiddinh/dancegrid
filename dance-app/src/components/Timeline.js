import React from 'react';
import { Play, Pause } from 'lucide-react';
import './Timeline.css';

const Timeline = ({ 
  currentTime, 
  totalTime, 
  formations, 
  currentFormationIndex,
  onTimeChange,
  onPlayPause,
  isPlaying,
  onFormationClick
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h3 className="timeline-title">Timeline</h3>
        <div className="timeline-controls">
          <button 
            className="play-button"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <span className="time-display">{formatTime(currentTime)}</span>
        </div>
      </div>
      
      <div className="timeline-slider-container">
        <div className="timeline-slider-wrapper">
          <input
            type="range"
            min="0"
            max={totalTime}
            value={currentTime}
            onChange={(e) => onTimeChange(parseFloat(e.target.value))}
            className="timeline-slider"
          />
        </div>
        
        <div className="timeline-markers">
          {formations && formations.map((formation, index) => {
            const time = formation.time || 0;
            const position = (time / totalTime) * 100;
            const isSelected = index === currentFormationIndex;
            const markerOffset = 7; // for some reason the black dot wasn't aligning so I just offset it LOL 
            return (
              <div
                key={formation.id || index}
                className={`timeline-marker ${isSelected ? 'selected' : ''}`}
                style={{ 
                  left: `calc(${position}% + ${markerOffset}px)`,
                  transform: 'translateX(-50%)'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onFormationClick && onFormationClick(index);
                }}
              >
                <div className={`marker-dot ${isSelected ? 'selected' : ''}`} />
                <span className="marker-label">F{index + 1}</span> 
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="timeline-labels">
        <span>0:00</span>
        <span>{formatTime(totalTime)}</span>
      </div>
    </div>
  );
};

export default Timeline;

