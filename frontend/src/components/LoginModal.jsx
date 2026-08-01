import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, LogIn, Lock, Mail } from 'lucide-react';

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
      <Modal.Header closeButton className="bg-dark text-white border-secondary border-opacity-25 px-4 pt-4 pb-2">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-circle" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            <Ticket size={24} className="text-white" />
          </div>
          <div>
            <Modal.Title className="fw-bold fs-4 text-white">Sign In to TicketDesk</Modal.Title>
            <small className="text-slate-300 d-block" style={{ color: '#cbd5e1' }}>Enterprise IT Support Portal</small>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="bg-dark text-white p-4">
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
                <div className="position-relative">
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
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.password && !!errors.password}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid" className="fw-semibold">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn-indigo w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3 fs-6">
                <LogIn size={20} /> {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3 pt-3 border-top border-secondary border-opacity-25 fs-6" style={{ color: '#cbd5e1' }}>
          Don't have an account?{' '}
          <button
            onClick={() => { onHide(); if (onSwitchToRegister) onSwitchToRegister(); }}
            className="btn btn-link p-0 fw-bold text-decoration-none"
            style={{ color: '#c084fc' }}
          >
            Register here
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
