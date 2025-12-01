import React, { useState } from 'react';
import './App.css';
import { FormationProvider, useFormations } from './context/FormationContext';
import ChoreoHeadView from './components/ChoreoHeadView';
import DancerView from './components/DancerView';

function AppContent() {
  const { dancers } = useFormations();
  const [view, setView] = useState('choreo');
  const [selectedDancer, setSelectedDancer] = useState(dancers.length > 0 ? dancers[0].id : null);

  React.useEffect(() => {
    if (selectedDancer && !dancers.find(d => d.id === selectedDancer)) {
      setSelectedDancer(dancers.length > 0 ? dancers[0].id : null);
    } else if (!selectedDancer && dancers.length > 0) {
      setSelectedDancer(dancers[0].id);
    }
  }, [dancers, selectedDancer]);

  return (
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
          {dancers.map(dancer => (
            <button
              key={dancer.id}
              className={`switch-button ${view === 'dancer' && selectedDancer === dancer.id ? 'active' : ''}`}
              onClick={() => {
                setView('dancer');
                setSelectedDancer(dancer.id);
              }}
            >
              {dancer.initials}
            </button>
          ))}
        </div>
      </div>

      {view === 'choreo' ? (
        <ChoreoHeadView />
      ) : selectedDancer ? (
        <DancerView dancerId={selectedDancer} />
      ) : (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>No dancers available. Add dancers in the Choreo Head View.</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <FormationProvider>
      <AppContent />
    </FormationProvider>
  );
}

export default App;
