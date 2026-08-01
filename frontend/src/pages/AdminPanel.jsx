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
        setMsg(`User status changed`);
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

  if (loading) return <LoadingSpinner text="Loading Admin Management Panel..." />;

  return (
    <div className="p-3 p-md-4">
      <div className="mb-4">
        <h2 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
          <Shield size={30} style={{ color: '#c084fc' }} /> Admin Control Center
        </h2>
        <p className="text-slate-300 small mb-0" style={{ color: '#cbd5e1' }}>System configurations, user role management, and SLA target definitions</p>
      </div>

      {msg && <Alert variant="success" dismissible onClose={() => setMsg('')}>{msg}</Alert>}

      <Tabs defaultActiveKey="users" className="mb-4 tabs-dark">
        {/* Users Management Tab */}
        <Tab eventKey="users" title={<span className="d-flex align-items-center gap-2 fw-bold"><Users size={18} /> User Management</span>}>
          <Card className="glass-card p-4">
            <Table responsive className="table-custom mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="fw-bold text-white">{u.firstName} {u.lastName}</div>
                      <small className="text-muted">@{u.username}</small>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="form-select-dark py-1"
                        style={{ width: '190px' }}
                      >
                        <option value="ROLE_EMPLOYEE">Employee</option>
                        <option value="ROLE_SUPPORT_ENGINEER">Support Engineer</option>
                        <option value="ROLE_ADMIN">Admin</option>
                      </Form.Select>
                    </td>
                    <td>
                      <Badge bg={u.active ? 'success' : 'danger'}>
                        {u.active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant={u.active ? 'outline-danger' : 'outline-success'}
                        size="sm"
                        onClick={() => handleStatusToggle(u.id, u.active)}
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
        <Tab eventKey="categories" title={<span className="d-flex align-items-center gap-2 fw-bold"><Tag size={18} /> Categories</span>}>
          <Card className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Ticket Categories</h5>
              <Button className="btn-indigo btn-sm d-flex align-items-center gap-1" onClick={() => setShowCatModal(true)}>
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
                    <td>{c.id}</td>
                    <td className="fw-bold text-white">{c.name}</td>
                    <td className="text-slate-300" style={{ color: '#cbd5e1' }}>{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        {/* Priorities & SLA Tab */}
        <Tab eventKey="priorities" title={<span className="d-flex align-items-center gap-2 fw-bold"><AlertTriangle size={18} /> Priorities & SLA</span>}>
          <Card className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">Priority Levels & SLA Target Hours</h5>
              <Button className="btn-indigo btn-sm d-flex align-items-center gap-1" onClick={() => setShowPrioModal(true)}>
                <Plus size={16} /> Add Priority
              </Button>
            </div>
            <Table responsive className="table-custom mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Priority Name</th>
                  <th>SLA Target</th>
                  <th>Badge Color</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {priorities.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td className="fw-bold text-white">{p.name}</td>
                    <td><Badge bg="info" className="px-2 py-1">{p.slaHours} Hours</Badge></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: p.colorCode }} />
                        <code className="text-slate-300" style={{ color: '#cbd5e1' }}>{p.colorCode}</code>
                      </div>
                    </td>
                    <td className="text-slate-300" style={{ color: '#cbd5e1' }}>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Category Modal */}
      <Modal show={showCatModal} onHide={() => setShowCatModal(false)} centered className="modal-dark">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Category Name</Form.Label>
            <Form.Control type="text" value={catName} onChange={(e) => setCatName(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={catDesc} onChange={(e) => setCatDesc(e.target.value)} className="form-control-dark" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-secondary" onClick={() => setShowCatModal(false)}>Cancel</Button>
          <Button className="btn-indigo" onClick={handleAddCategory}>Save Category</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Priority Modal */}
      <Modal show={showPrioModal} onHide={() => setShowPrioModal(false)} centered className="modal-dark">
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>Add Priority & SLA</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Priority Name</Form.Label>
            <Form.Control type="text" value={prioName} onChange={(e) => setPrioName(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">SLA Target Hours</Form.Label>
            <Form.Control type="number" value={prioSla} onChange={(e) => setPrioSla(e.target.value)} className="form-control-dark" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label">Badge Color</Form.Label>
            <Form.Control type="color" value={prioColor} onChange={(e) => setPrioColor(e.target.value)} className="form-control-color w-100" />
          </Form.Group>
          <Form.Group>
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control as="textarea" rows={2} value={prioDesc} onChange={(e) => setPrioDesc(e.target.value)} className="form-control-dark" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-secondary" onClick={() => setShowPrioModal(false)}>Cancel</Button>
          <Button className="btn-indigo" onClick={handleAddPriority}>Save Priority</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
