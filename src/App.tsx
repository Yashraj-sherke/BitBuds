import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import CodeLab from './pages/CodeLab';
import Avatar from './pages/Avatar';
import Badges from './pages/Badges';
import Settings from './pages/Settings';
import ParentDashboard from './pages/ParentDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/missions" element={
              <ProtectedRoute>
                <Missions />
              </ProtectedRoute>
            } />
            <Route path="/codelab" element={
              <ProtectedRoute>
                <CodeLab />
              </ProtectedRoute>
            } />
            <Route path="/avatar" element={
              <ProtectedRoute>
                <Avatar />
              </ProtectedRoute>
            } />
            <Route path="/badges" element={
              <ProtectedRoute>
                <Badges />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/parent-dashboard" element={
              <ProtectedRoute requireParent>
                <ParentDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;