import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Badge, Tabs, Tab, Modal, Alert } from 'react-bootstrap';
import { userApi } from '../api/userApi';
import { categoryApi } from '../api/categoryApi';
import { priorityApi } from '../api/priorityApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Shield, Users, Tag, AlertTriangle, Plus } from 'lucide-react';

export const AdminPanel = () => {
  useDocumentTitle('Admin Panel');
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Category / Priority Modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [showPrioModal, setShowPrioModal] = useState(false);
  const [prioName, setPrioName] = useState('');
  const [prioDesc, setPrioDesc] = useState('');
  const [prioColor, setPrioColor] = useState('#38bdf8');
  const [prioSla, setPrioSla] = useState(24);

  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      const [uRes, cRes, pRes] = await Promise.all([
        userApi.getAllUsers(),
        categoryApi.getAll(),
        priorityApi.getAll(),
      ]);
      if (uRes.success) setUsers(uRes.data || []);
      if (cRes.success) setCategories(cRes.data || []);
      if (pRes.success) setPriorities(pRes.data || []);
    } catch (e) {
      console.error('Failed to load admin panel data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const res = await userApi.updateUserRole(userId, role);
      if (res.success) {
        setMsg(`Role updated to ${role}`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusToggle = async (userId, currentActive) => {
    try {
      const res = await userApi.toggleUserStatus(userId, !currentActive);
      if (res.success) {
        setMsg(`User status updated successfully`);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async () => {
    if (!catName) return;
    try {
      const res = await categoryApi.create({ name: catName, description: catDesc });
      if (res.success) {
        setShowCatModal(false);
        setCatName('');
        setCatDesc('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPriority = async () => {
    if (!prioName) return;
    try {
      const res = await priorityApi.create({
        name: prioName,
        description: prioDesc,
        colorCode: prioColor,
        slaHours: Number(prioSla),
      });
      if (res.success) {
        setShowPrioModal(false);
        setPrioName('');
        setPrioDesc('');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <LoadingSpinner text="Loading Admin Control Center..." />;

  return (
    <div className="p-3 p-md-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2 fs-3">
          <Shield size={26} className="text-indigo-600" /> Admin Control Center
        </h2>
        <p className="small mb-0" style={{ color: '#64748b' }}>Manage user permissions, ticket categories, and SLA target configurations</p>
      </div>

      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}

      <Tabs defaultActiveKey="users" className="mb-4 tabs-dark">
        {/* Users Management Tab */}
        <Tab eventKey="users" title={<span className="d-flex align-items-center gap-2 fw-semibold"><Users size={16} /> User Management</span>}>
          <Card className="glass-card p-0 overflow-hidden">
            <Table responsive className="table-custom mb-0">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email Address</th>
                  <th>Assigned Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-semibold text-dark">{u.firstName} {u.lastName}</div>
                      <small className="text-muted">@{u.username}</small>
                    </td>
                    <td className="text-slate-600">{u.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="form-select-dark py-1"
                        style={{ maxWidth: '180px' }}
                      >
                        <option value="ROLE_EMPLOYEE">Employee</option>
                        <option value="ROLE_SUPPORT_ENGINEER">Support Engineer</option>
                        <option value="ROLE_ADMIN">Admin</option>
                      </Form.Select>
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`} style={{ padding: '0.3em 0.7em', borderRadius: 9999, fontSize: '0.75rem' }}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="text-end">
                      <Button
                        variant={u.active ? 'outline-danger' : 'outline-success'}
                        size="sm"
                        onClick={() => handleStatusToggle(u.id, u.active)}
                        className="py-1 px-2.5"
                      >
                        {u.active ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        {/* Categories Tab */}
        <Tab eventKey="categories" title={<span className="d-flex align-items-center gap-2 fw-semibold"><Tag size={16} /> Categories</span>}>
          <Card className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold mb-0 fs-6">Support Ticket Categories</h5>
              <Button className="btn-indigo btn-sm d-inline-flex align-items-center gap-1.5" onClick={() => setShowCatModal(true)}>
                <Plus size={16} /> Add Category
              </Button>
            </div>
            <Table responsive className="table-custom mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td className="text-muted fw-mono">{c.id}</td>
                    <td className="fw-semibold text-dark">{c.name}</td>
                    <td className="text-slate-600">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        {/* Priorities & SLA Tab */}
        <Tab eventKey="priorities" title={<span className="d-flex align-items-center gap-2 fw-semibold"><AlertTriangle size={16} /> Priorities & SLA</span>}>
          <Card className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-dark fw-bold mb-0 fs-6">Priority Levels & SLA Targets</h5>
              <Button className="btn-indigo btn-sm d-inline-flex align-items-center gap-1.5" onClick={() => setShowPrioModal(true)}>
                <Plus size={16} /> Add Priority
              </Button>
            </div>
            <Table responsive className="table-custom mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Priority Level</th>
                  <th>SLA Target</th>
                  <th>Badge Color</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {priorities.map((p) => (
                  <tr key={p.id}>
                    <td className="text-muted fw-mono">{p.id}</td>
                    <td className="fw-semibold text-dark">{p.name}</td>
                    <td>
                      <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '0.35em 0.7em', borderRadius: 6 }}>
                        {p.slaHours} Hours SLA
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: p.colorCode }} />
                        <code className="text-muted small">{p.colorCode}</code>
                      </div>
                    </td>
                    <td className="text-slate-600">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Category Modal */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered className="modal-dark">
        <Modal.Header closeButton className="bg-white border-bottom border-light px-4 py-3">
          <Modal.Title className="fw-bold fs-5 text-dark">Add New Ticket Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white p-4">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Category Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. Hardware" value={catName} onChange={(e) => setCatName(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe the scope of this category..." value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="form-control-dark" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-white border-top border-light px-4 py-3">
          <Button variant="outline-secondary" onClick={() => setShowCatModal(false)}>Cancel</Button>
          <Button className="btn-indigo" onClick={handleAddCategory}>Save Category</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Priority Modal */}
      <Modal show={showPrioModal} onHide={() => setShowPrioModal(false)} centered className="modal-dark">
        <Modal.Header closeButton className="bg-white border-bottom border-light px-4 py-3">
          <Modal.Title className="fw-bold fs-5 text-dark">Add Priority & SLA Target</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-white p-4">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Priority Level Name</Form.Label>
            <Form.Control type="text" placeholder="e.g. URGENT" value={prioName} onChange={(e) => setPrioName(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">SLA Target (Hours)</Form.Label>
            <Form.Control type="number" placeholder="24" value={prioSla} onChange={(e) => setPrioSla(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Badge Accent Color</Form.Label>
            <Form.Control type="color" value={prioColor} onChange={(e) => setPrioColor(e.target.value)} className="form-control-color w-100" />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control as="textarea" rows={2} placeholder="SLA details..." value={prioDesc} onChange={(e) => setPrioDesc(e.target.value)} className="form-control-dark" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-white border-top border-light px-4 py-3">
          <Button variant="outline-secondary" onClick={() => setShowPrioModal(false)}>Cancel</Button>
          <Button className="btn-indigo" onClick={handleAddPriority}>Save Priority</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
