import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import LevelSelection from "./pages/LevelSelection.tsx";
import PuzzleUI from "./pages/PuzzleUI.tsx";
import About from './pages/About';
import LanguageExplanation from './pages/LanguageExplanation.tsx';
import StoryBeatUI from './pages/StoryBeatUI.tsx';

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/game' element={<Game />} />
                <Route path='/level-select' element={<LevelSelection />} />
                <Route path='/puzzle/:puzzleId' element={<PuzzleUI />} />
                <Route path='/puzzle/' element={<Navigate to="/level-select" replace />} />
                <Route path='/story/:storyId' element={<StoryBeatUI />} />
                <Route path='/story/' element={<Navigate to="/level-select" replace />} />
                <Route path="/about" element={<About />} />
                <Route path="/about/language" element={<LanguageExplanation />} />
            </Routes>
        </Router>
    );
}

export default App;
