import React, { useState } from 'react';
import './App.css';
import { FormationProvider } from './context/FormationContext';
import ChoreoHeadView from './components/ChoreoHeadView';
import DancerView from './components/DancerView';

function App() {
  const [view, setView] = useState('choreo');
  const [selectedDancer, setSelectedDancer] = useState('KV');

  return (
    <FormationProvider>
      <div className="App">
        <div className="view-switcher">
          <button
            className={`switch-button ${view === 'choreo' ? 'active' : ''}`}
            onClick={() => setView('choreo')}
          >
            Choreo Head View
          </button>
          <div className="dancer-buttons">
            <span>Dancer Views: </span>
            {['KV', 'MP', 'AT', 'RS', 'NI'].map(dancerId => (
              <button
                key={dancerId}
                className={`switch-button ${view === 'dancer' && selectedDancer === dancerId ? 'active' : ''}`}
                onClick={() => {
                  setView('dancer');
                  setSelectedDancer(dancerId);
                }}
              >
                {dancerId}
              </button>
            ))}
          </div>
        </div>

        {view === 'choreo' ? (
          <ChoreoHeadView />
        ) : (
          <DancerView dancerId={selectedDancer} />
        )}
      </div>
    </FormationProvider>
  );
}

export default App;
