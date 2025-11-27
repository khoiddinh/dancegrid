import React from 'react';
import './StageGrid.css';

const StageGrid = ({ 
  dancers, 
  currentFormation, 
  nextFormation, 
  showNextFormation,
  currentDancerId = null,
  gridSize = 12,
  editable = false,
  onDancerMove = null,
  selectedDancerId = null,
  onDancerSelect = null,
  currentTime = 0,
  currentFormationTime = 0,
  nextFormationTime = null,
}) => {
  const cellSize = 50;
  const gridWidth = gridSize * cellSize;

  const getPosition = (x, y) => ({
    left: `${(x / gridSize) * 100}%`,
    top: `${(y / gridSize) * 100}%`,
  });

  const interpolatePosition = (startPos, endPos, startTime, endTime, currentTime) => {
    if (!startPos || !endPos || !endTime) return startPos;
    if (currentTime <= startTime) return startPos;
    if (currentTime >= endTime) return endPos;
    
    const progress = (currentTime - startTime) / (endTime - startTime);
    return {
      x: startPos.x + (endPos.x - startPos.x) * progress,
      y: startPos.y + (endPos.y - startPos.y) * progress,
    };
  };

  const getInterpolatedPosition = (dancerId) => {
    if (!currentFormation || !currentFormation.positions || !currentFormation.positions[dancerId]) {
      return null;
    }

    if (nextFormation && nextFormation.positions && nextFormation.positions[dancerId] && nextFormationTime && currentFormationTime !== null) {
      const interpolated = interpolatePosition(
        currentFormation.positions[dancerId],
        nextFormation.positions[dancerId],
        currentFormationTime,
        nextFormationTime,
        currentTime
      );
      return interpolated;
    }

    return currentFormation.positions[dancerId];
  };

  const handleCellClick = (x, y) => {
    if (editable && selectedDancerId && onDancerMove && currentFormation) {
      onDancerMove(currentFormation.id, selectedDancerId, { x, y });
    }
  };

  const handleDancerClick = (e, dancerId) => {
    e.stopPropagation();
    if (editable && onDancerSelect) {
      onDancerSelect(dancerId);
    }
  };

  const handleDancerDoubleClick = (e, dancerId) => {
    e.stopPropagation();
    if (editable && onDancerSelect) {
      onDancerSelect(dancerId);
    }
  };

  const renderDancer = (dancer, isNext = false) => {
    const pos = isNext 
      ? (nextFormation && nextFormation.positions && nextFormation.positions[dancer.id] 
          ? nextFormation.positions[dancer.id] 
          : null)
      : getInterpolatedPosition(dancer.id);
    
    if (!pos) return null;
    
    const position = getPosition(pos.x, pos.y);
    const baseOpacity = currentDancerId && dancer.id !== currentDancerId ? 0.3 : 1;
    const isSelected = editable && selectedDancerId === dancer.id;
    
    return (
      <div
        key={`${dancer.id}-${isNext ? 'next' : 'current'}`}
        className={`dancer-circle ${editable ? 'editable' : ''} ${isSelected ? 'selected' : ''}`}
        style={{
          ...position,
          backgroundColor: dancer.color,
          borderColor: isSelected ? '#000' : dancer.borderColor,
          color: dancer.textColor,
          opacity: isNext ? 0.3 : baseOpacity,
          zIndex: isNext ? 1 : 2,
          cursor: editable ? 'move' : 'default',
        }}
        onClick={(e) => handleDancerClick(e, dancer.id)}
        onDoubleClick={(e) => handleDancerDoubleClick(e, dancer.id)}
        draggable={editable && !isNext}
        onDragStart={(e) => {
          if (editable) {
            e.dataTransfer.effectAllowed = 'move';
            onDancerSelect && onDancerSelect(dancer.id);
          }
        }}
      >
        {dancer.initials}
      </div>
    );
  };

  const renderPath = (dancer) => {
    if (!showNextFormation || !nextFormation || !nextFormation.positions) return null;
    
    const currentPos = getInterpolatedPosition(dancer.id);
    const nextPos = nextFormation.positions[dancer.id];
    
    if (!currentPos || !nextPos) return null;
    
    const opacity = currentDancerId && dancer.id !== currentDancerId ? 0.2 : 0.6;
    
    const startX = (currentPos.x / gridSize) * gridWidth;
    const startY = (currentPos.y / gridSize) * gridWidth;
    const endX = (nextPos.x / gridSize) * gridWidth;
    const endY = (nextPos.y / gridSize) * gridWidth;
    
    return (
      <line
        key={`path-${dancer.id}`}
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={dancer.color}
        strokeWidth="3"
        strokeDasharray="8,4"
        opacity={opacity}
        fill="none"
      />
    );
  };

  return (
    <div className="stage-container">
      <div className="stage-labels-top">
        <span className="stage-label-left">← Left</span>
        <span className="stage-label-center">Stage Back</span>
        <span className="stage-label-right">Right →</span>
      </div>
      
      <div className="stage-grid-wrapper">
        <div 
          className="stage-grid"
          style={{
            width: `${gridWidth}px`,
            height: `${gridWidth}px`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }, (_, index) => {
            const x = index % gridSize;
            const y = Math.floor(index / gridSize);
            return (
              <div
                key={index}
                className={`grid-cell ${editable ? 'editable' : ''}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                onClick={() => handleCellClick(x, y)}
                onDragOver={(e) => {
                  if (editable) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }
                }}
                onDrop={(e) => {
                  if (editable && selectedDancerId && onDancerMove && currentFormation) {
                    e.preventDefault();
                    onDancerMove(currentFormation.id, selectedDancerId, { x, y });
                  }
                }}
              />
            );
          })}
          
          {nextFormation && showNextFormation && (
            <svg
              className="path-svg"
              width={gridWidth}
              height={gridWidth}
            >
              {dancers.map(dancer => renderPath(dancer))}
            </svg>
          )}
          
          {currentFormation && dancers.map(dancer => 
            renderDancer(dancer, false)
          )}
          
          {nextFormation && showNextFormation && dancers.map(dancer => 
            renderDancer(dancer, true)
          )}
        </div>
      </div>
      
      <div className="stage-labels-bottom">
        <span className="stage-exit-left">C (Exit)</span>
        <span className="stage-label-center">Stage Front</span>
        <span className="stage-exit-right">D (Exit)</span>
      </div>
    </div>
  );
};

export default StageGrid;

