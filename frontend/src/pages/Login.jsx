import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { Ticket, LogIn } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .min(3, 'Username or email must be at least 3 characters')
    .required('Username or email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const Login = () => {
  useDocumentTitle('Sign In');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage('');
    try {
      const res = await login(values);
      if (res && res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res?.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Card className="glass-card p-4 p-md-5" style={{ maxWidth: '460px', width: '100%', background: '#ffffff' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            <Ticket size={40} className="text-white" />
          </div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.5px' }}>Welcome Back</h2>
          <p className="fs-6 mb-0" style={{ color: '#475569' }}>Sign in to your TicketDesk portal account</p>
        </div>

        {errorMessage && <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>}

        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Username or Email</Form.Label>
                <Form.Control
                  type="text"
                  name="usernameOrEmail"
                  placeholder="e.g. admin or admin@ticketdesk.com"
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

        <div className="text-center mt-3 pt-3 border-top border-light fs-6" style={{ color: '#334155' }}>
          Don't have an account?{' '}
          <Link to="/register" className="fw-bold text-decoration-none" style={{ color: '#4f46e5' }}>
            Register here
          </Link>
        </div>
      </Card>
    </Container>
  );
};
