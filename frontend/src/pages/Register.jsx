import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Ticket } from 'lucide-react';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Minimum 3 characters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
});

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      <Card className="glass-card p-4 p-md-5" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle bg-indigo-600 mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Ticket size={36} className="text-white" />
          </div>
          <h2 className="fw-bold text-light mb-1">Create an Account</h2>
          <p className="text-muted small">Join TicketDesk IT Support Portal</p>
        </div>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Formik
          initialValues={{ username: '', email: '', password: '', firstName: '', lastName: '', role: 'ROLE_EMPLOYEE' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted small fw-semibold">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={touched.firstName && !!errors.firstName}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-muted small fw-semibold">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={touched.lastName && !!errors.lastName}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={touched.username && !!errors.username}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={touched.email && !!errors.email}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn-indigo w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3">
                <UserPlus size={18} /> {isSubmitting ? 'Creating Account...' : 'Register'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-2 pt-3 border-top border-secondary border-opacity-25 small text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 fw-semibold text-decoration-none">
            Sign In
          </Link>
        </div>
      </Card>
    </Container>
  );
};
