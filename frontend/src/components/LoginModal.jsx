import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogIn, Eye, EyeOff } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .min(3, 'Username or email must be at least 3 characters')
    .required('Username or email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const LoginModal = ({ show, onHide, onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage('');
    try {
      const res = await login(values);
      if (res && res.success) {
        onHide();
        navigate('/dashboard');
      } else {
        setErrorMessage(res?.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="modal-dark">
      <Modal.Header closeButton className="bg-white border-bottom border-light px-4 pt-4 pb-2">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-circle" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <Ticket size={24} className="text-white" />
          </div>
          <div>
            <Modal.Title className="fw-bold fs-4" style={{ color: '#0f172a' }}>Sign In to TicketDesk</Modal.Title>
            <small className="d-block fw-semibold" style={{ color: '#475569' }}>Enterprise IT Support Portal</small>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-white p-4">
        {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}

        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Username or Email Address</Form.Label>
                <Form.Control
                  type="text"
                  name="usernameOrEmail"
                  placeholder="Enter username (e.g. admin) or email"
                  value={values.usernameOrEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.usernameOrEmail && !!errors.usernameOrEmail}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid" className="fw-semibold">
                  {errors.usernameOrEmail}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                    className="form-control-dark pe-5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none shadow-none border-0"
                    style={{ color: '#64748b' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Form.Control.Feedback type="invalid" className="fw-semibold d-block">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn-indigo w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3 fs-6">
                <LogIn size={20} /> {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3 pt-3 border-top border-light fs-6" style={{ color: '#334155' }}>
          Don't have an account?{' '}
          <button
            onClick={() => { onHide(); if (onSwitchToRegister) onSwitchToRegister(); }}
            className="btn btn-link p-0 fw-bold text-decoration-none"
            style={{ color: '#4f46e5' }}
          >
            Register here
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
