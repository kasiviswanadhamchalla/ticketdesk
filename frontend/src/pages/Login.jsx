import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, User, LogIn } from 'lucide-react';

const LoginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or email is required'),
  password: Yup.string().required('Password is required'),
});

export const Login = () => {
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
      <Card className="glass-card p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle bg-indigo-600 mb-3" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
            <Ticket size={36} className="text-white" />
          </div>
          <h2 className="fw-bold text-light mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to your TicketDesk portal account</p>
        </div>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Formik
          initialValues={{ usernameOrEmail: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted small fw-semibold">Username or Email</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    name="usernameOrEmail"
                    placeholder="e.g. john.doe or john@ticketdesk.com"
                    value={values.usernameOrEmail}
                    onChange={handleChange}
                    isInvalid={touched.usernameOrEmail && !!errors.usernameOrEmail}
                    className="form-control-dark"
                  />
                  <Form.Control.Feedback type="invalid">{errors.usernameOrEmail}</Form.Control.Feedback>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-muted small fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" disabled={isSubmitting} className="btn-indigo w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3">
                <LogIn size={18} /> {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3 pt-3 border-top border-secondary border-opacity-25 small text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 fw-semibold text-decoration-none">
            Register here
          </Link>
        </div>
      </Card>
    </Container>
  );
};
