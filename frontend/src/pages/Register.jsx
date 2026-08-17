import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { UserPlus, Ticket, Eye, EyeOff } from 'lucide-react';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Minimum 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
});

export const Register = () => {
  useDocumentTitle('Register Account');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await register(values);
      if (res && res.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Card className="glass-card p-4 p-md-5" style={{ maxWidth: '540px', width: '100%', background: '#ffffff' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-3 shadow-md" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <Ticket size={40} className="text-white" />
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Create an Account</h2>
          <p className="fs-6 mb-0" style={{ color: '#475569' }}>Join TicketDesk IT Support Portal</p>
        </div>

        {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Formik
          initialValues={{ username: '', email: '', password: '', firstName: '', lastName: '', role: 'ROLE_EMPLOYEE' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      placeholder="e.g. John"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.firstName && !!errors.firstName}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid" className="fw-semibold">{errors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      placeholder="e.g. Doe"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.lastName && !!errors.lastName}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid" className="fw-semibold">{errors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="e.g. john.doe"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.username && !!errors.username}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid" className="fw-semibold">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="e.g. john@ticketdesk.com"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.email && !!errors.email}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid" className="fw-semibold">{errors.email}</Form.Control.Feedback>
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
                <Form.Control.Feedback type="invalid" className="fw-semibold d-block">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn-indigo w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3 fs-6">
                <UserPlus size={20} /> {isSubmitting ? 'Creating Account...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-2 pt-3 border-top border-light fs-6" style={{ color: '#334155' }}>
          Already have an account?{' '}
          <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#4f46e5' }}>
            Sign In
          </Link>
        </div>
      </Card>
    </Container>
  );
};
