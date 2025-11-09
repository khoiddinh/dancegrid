import logo from './logo.svg';
import './App.css';
import HelloStyles from './HelloStyles';
import DanceGrid from './components/DanceGrid';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#ffffff' }}>
        <HelloStyles />
        <DanceGrid />
      </header>
    </div>
  );
}

export default App;
