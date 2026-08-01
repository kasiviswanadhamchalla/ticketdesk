import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { categoryApi } from '../api/categoryApi';
import { priorityApi } from '../api/priorityApi';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const TicketSchema = Yup.object().shape({
  title: Yup.string().min(5, 'Minimum 5 characters').max(200, 'Maximum 200 characters').required('Title is required'),
  description: Yup.string().min(10, 'Minimum 10 characters').required('Detailed description is required'),
  categoryId: Yup.string().required('Please select a category'),
  priorityId: Yup.string().required('Please select a priority'),
});

export const CreateTicket = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prioRes] = await Promise.all([categoryApi.getAll(), priorityApi.getAll()]);
        if (catRes.success) setCategories(catRes.data || []);
        if (prioRes.success) setPriorities(prioRes.data || []);
      } catch (e) {
        console.error('Failed to load categories/priorities', e);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('');
    try {
      const res = await ticketApi.createTicket({
        ...values,
        categoryId: Number(values.categoryId),
        priorityId: Number(values.priorityId),
      });

      if (res.success && res.data) {
        navigate(`/tickets/${res.data.id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 p-md-4 max-w-4xl mx-auto">
      <Button variant="link" onClick={() => navigate(-1)} className="text-muted text-decoration-none p-0 mb-3 d-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back
      </Button>

      <Card className="glass-card p-4 p-md-5">
        <div className="mb-4">
          <h3 className="fw-bold text-light mb-1">Create Support Ticket</h3>
          <p className="text-muted small">Submit an issue or request to the IT engineering team</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Formik
          initialValues={{ title: '', description: '', categoryId: '', priorityId: '' }}
          validationSchema={TicketSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Ticket Subject / Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g., VPN Authentication Failure on Corporate Laptop"
                  value={values.title}
                  onChange={handleChange}
                  isInvalid={touched.title && !!errors.title}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>

              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small fw-semibold">Category</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={values.categoryId}
                      onChange={handleChange}
                      isInvalid={touched.categoryId && !!errors.categoryId}
                      className="form-select-dark"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.categoryId}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="text-muted small fw-semibold">Priority Level</Form.Label>
                    <Form.Select
                      name="priorityId"
                      value={values.priorityId}
                      onChange={handleChange}
                      isInvalid={touched.priorityId && !!errors.priorityId}
                      className="form-select-dark"
                    >
                      <option value="">Select Priority</option>
                      {priorities.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.slaHours}h SLA)</option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.priorityId}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-semibold">Detailed Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="description"
                  placeholder="Provide step-by-step details, error messages, and system specifications..."
                  value={values.description}
                  onChange={handleChange}
                  isInvalid={touched.description && !!errors.description}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-end gap-3">
                <Button variant="outline-secondary" onClick={() => navigate('/tickets')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="btn-indigo d-flex align-items-center gap-2">
                  <PlusCircle size={18} /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};
