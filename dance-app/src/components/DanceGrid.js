import React from 'react';
import { useState } from 'react';

const DanceGrid = () => {
    const gridSize = 15; // 15x15 grid
    const [playerPosition, setPlayerPosition] = useState({ x: 7, y: 7 });

    const colors = {
        primary: '#ffffff',
        secondary: '#cbced4',
        accent: '#93C5FD',
        accent2: '#FDE047',
        accent3: '#A7F3D0'
    }

    const handleClick = (x, y) => {
        setPlayerPosition({ x, y });
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 50px)`,
            gridTemplateRows: `repeat(${gridSize}, 50px)`,
            gap: '2px',
            backgroundColor: colors.primary,
            padding: '10px',
            borderRadius: '5px'
        }}>
            {/* basically creates the individual cells within the grid incl. styling*/}
            {Array.from({ length: gridSize * gridSize }, (_, index) => {
                const x = index % gridSize;
                const y = Math.floor(index / gridSize); // integer division
        
                // check if player is on this cell
                const isPlayerHere = (playerPosition.x === x && playerPosition.y === y);
                return (
                    <div
                        key={index}
                        onClick={() => handleClick(x, y)}  
                        style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: isPlayerHere ? colors.accent : colors.primary,  
                        border: `3px solid ${colors.secondary}`,
                        display: 'flex',    // center the circle
                        alignItems: 'center',
                        justifyContent: 'center'
                        }}
                    >
                        {isPlayerHere && (
                        <div style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: colors.accent2,  
                            borderRadius: '50%', // makes circle
                            border: `2px solid ${colors.primary}`  
                        }} />
                        )}
                    </div>
                );
            
            })}
            
        </div>
    );
};


export default DanceGrid;