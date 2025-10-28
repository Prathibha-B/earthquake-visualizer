import { useState } from 'react';
import './App.css';
import MapView from './components/MapView';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={`App ${darkMode ? 'dark' : 'light'}`}>
            <header>
                <h1>🌍 Earthquake Visualizer</h1>
                <p>Explore recent seismic activity around the world</p>
                <button onClick={() => setDarkMode(!darkMode)}>
                    Toggle {darkMode ? 'Light' : 'Dark'} Mode
                </button>
            </header>
            <MapView />
        </div>
    );
}

export default App;