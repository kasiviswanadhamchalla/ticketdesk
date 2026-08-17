import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { Lock, CheckCircle, Eye, EyeOff, User } from 'lucide-react';

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

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="p-3 p-md-4 max-w-7xl mx-auto">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1 fs-3">User Profile</h2>
        <p className="small mb-0" style={{ color: '#64748b' }}>Manage your personal credentials and security settings</p>
      </div>

      <Row className="g-4">
        <Col md={5}>
          <Card className="glass-card p-4 text-center">
            <div
              className="rounded-circle text-white d-inline-flex align-items-center justify-content-center fw-bold mx-auto mb-3 shadow-md"
              style={{ width: 80, height: 80, fontSize: '2rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <h4 className="fw-bold text-dark mb-1 fs-5">{user?.firstName} {user?.lastName}</h4>
            <p className="small mb-3" style={{ color: '#64748b' }}>@{user?.username}</p>
            <div>
              <span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200" style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', padding: '0.4em 0.85em', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600 }}>
                {user?.role?.replace('ROLE_', '')}
              </span>
            </div>

            <div className="text-start border-top border-light pt-3 mt-3 small" style={{ color: '#475569' }}>
              <div className="mb-2"><strong className="text-dark">Email:</strong> {user?.email}</div>
              <div className="mb-0"><strong className="text-dark">Account Status:</strong> <span className="text-emerald-600 fw-bold" style={{ color: '#047857' }}>Active</span></div>
            </div>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="glass-card p-4">
            <h5 className="fw-bold text-dark mb-3 fs-6 d-flex align-items-center gap-2">
              <Lock size={18} className="text-indigo-600" /> Change Security Password
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
                    <div className="position-relative">
                      <Form.Control
                        type={showCurrent ? 'text' : 'password'}
                        name="currentPassword"
                        value={values.currentPassword}
                        onChange={handleChange}
                        isInvalid={touched.currentPassword && !!errors.currentPassword}
                        className="form-control-dark pe-5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none border-0"
                        style={{ color: '#64748b' }}
                      >
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Form.Control.Feedback type="invalid" className="d-block">{errors.currentPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showNew ? 'text' : 'password'}
                        name="newPassword"
                        value={values.newPassword}
                        onChange={handleChange}
                        isInvalid={touched.newPassword && !!errors.newPassword}
                        className="form-control-dark pe-5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none border-0"
                        style={{ color: '#64748b' }}
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Form.Control.Feedback type="invalid" className="d-block">{errors.newPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label">Confirm New Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        className="form-control-dark pe-5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none border-0"
                        style={{ color: '#64748b' }}
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Form.Control.Feedback type="invalid" className="d-block">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>

                  <Button type="submit" disabled={isSubmitting} className="btn-indigo d-inline-flex align-items-center gap-2">
                    <CheckCircle size={16} /> {isSubmitting ? 'Updating...' : 'Update Password'}
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

export default Profile;
