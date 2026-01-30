import { Navigate, Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import CreatePost from './pages/CreatePost.jsx';
import ViewPost from './pages/ViewPost.jsx';
import EditPost from './pages/EditPost.jsx';
import { useAuth } from './auth/AuthContext.jsx';

function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/posts/new"
            element={
              <RequireAuth>
                <CreatePost />
              </RequireAuth>
            }
          />
          <Route path="/posts/:id" element={<ViewPost />} />
          <Route
            path="/posts/:id/edit"
            element={
              <RequireAuth>
                <EditPost />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
