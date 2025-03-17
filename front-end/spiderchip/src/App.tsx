import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import LevelSelection from "./pages/LevelSelection.tsx";
import PuzzleUI from "./pages/PuzzleUI.tsx";
import {LevelItem} from "./types.ts";

const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

const ProtectedRoute = ({children}: { children: JSX.Element }) => {
    return isAuthenticated() ? children : <Navigate to="/" replace/>;
};

// Public Route: Blocks access if the user IS authenticated
const PublicRoute = ({children}: { children: JSX.Element }) => {
    return isAuthenticated() ? <Navigate to="/" replace/> : children;
};

const tempLevel : LevelItem = {
    id: 1,
    title: "Level Title",
    category: "Category 1",
    description: "Level 1 Description",
    status: "available"
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/game' element={<ProtectedRoute><Game/></ProtectedRoute>}/>
                <Route path='/level-select' element={<LevelSelection/>}/>
                <Route path='/puzzle-ui' element={<PuzzleUI level={tempLevel}/>} />
            </Routes>
        </Router>
    );
}

export default App;
