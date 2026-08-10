import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { Lock, CheckCircle } from 'lucide-react';

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(6, 'Minimum 6 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export const Profile = () => {
  useDocumentTitle('My Profile');
  const { user } = useAuth();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (values, { resetForm, setSubmitting }) => {
    setSuccess('');
    setError('');
    try {
      const res = await authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (res.success) {
        setSuccess('Password updated successfully!');
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-3 p-md-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">User Profile</h2>
        <p className="small mb-0" style={{ color: '#475569' }}>Manage your account information and security credentials</p>
      </div>

      <Row className="g-4">
        <Col md={5}>
          <Card className="glass-card p-4 text-center">
            <div
              className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold mx-auto mb-3 shadow-lg"
              style={{ width: 84, height: 84, fontSize: '2.2rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <h4 className="fw-bold text-dark mb-1">{user?.firstName} {user?.lastName}</h4>
            <p className="small mb-3" style={{ color: '#475569' }}>@{user?.username}</p>
            <Badge bg="indigo" className="px-3 py-2 fs-6 mb-3" style={{ background: '#4f46e5' }}>
              {user?.role?.replace('ROLE_', '')}
            </Badge>

            <div className="text-start border-top border-slate-200 pt-3 mt-2 small" style={{ color: '#334155' }}>
              <div className="mb-2"><strong style={{ color: '#0f172a' }}>Email:</strong> {user?.email}</div>
              <div className="mb-2"><strong style={{ color: '#0f172a' }}>Account Status:</strong> <span className="text-success fw-bold">Active</span></div>
            </div>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="glass-card p-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Lock size={20} style={{ color: '#4f46e5' }} /> Change Security Password
            </h5>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Formik
              initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
              validationSchema={PasswordSchema}
              onSubmit={handlePasswordChange}
            >
              {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={values.currentPassword}
                      onChange={handleChange}
                      isInvalid={touched.currentPassword && !!errors.currentPassword}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid">{errors.currentPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      isInvalid={touched.newPassword && !!errors.newPassword}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                      className="form-control-dark"
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" disabled={isSubmitting} className="btn-indigo d-flex align-items-center gap-2">
                    <CheckCircle size={18} /> {isSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
