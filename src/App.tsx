import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProposalTool from './components/ProposalTool';
import ProposalViewer from './components/ProposalViewer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/agensea-admin" replace />} />
      <Route path="/agensea-admin" element={<Dashboard />} />
      <Route path="/agensea-admin/edit/:id" element={<ProposalTool />} />
      <Route path="/v/:id" element={<ProposalViewer />} />
    </Routes>
  );
}

export default App;
