import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProposalTool from './components/ProposalTool';
import ProposalViewer from './components/ProposalViewer';

function App() {
  // When __PROPOSAL_ID is set (hub pretty URL serving), the ProposalViewer
  // should render regardless of the pathname — no URL change needed.
  const hasInjectedId = Boolean((window as any).__PROPOSAL_ID);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/agensea-admin" replace />} />
      <Route path="/agensea-admin" element={<Dashboard />} />
      <Route path="/agensea-admin/edit/:id" element={<ProposalTool />} />
      <Route path="/v/:id" element={<ProposalViewer />} />
      {hasInjectedId && (
        <Route path="*" element={<ProposalViewer />} />
      )}
    </Routes>
  );
}

export default App;
