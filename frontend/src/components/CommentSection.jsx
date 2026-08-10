import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Badge } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { commentApi } from '../api/commentApi';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, ShieldAlert, Clock } from 'lucide-react';

const CommentSchema = Yup.object().shape({
  content: Yup.string().required('Comment content is required'),
});

export const CommentSection = ({ ticketId }) => {
  const { hasRole } = useAuth();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await commentApi.getComments(ticketId);
      if (res.success) {
        setComments(res.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch comments', e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await commentApi.addComment(ticketId, values);
      if (res.success) {
        resetForm();
        fetchComments();
      }
    } catch (e) {
      console.error('Failed to post comment', e);
    }
  };

  return (
    <Card className="glass-card mt-4" style={{ background: '#ffffff' }}>
      <Card.Header className="bg-transparent border-bottom border-slate-200 py-3">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: '#0f172a' }}>
          <MessageSquare size={20} className="text-indigo-600" /> Activity & Comments ({comments.length})
        </h5>
      </Card.Header>
      <Card.Body>
        {/* Comment Input Form */}
        <Formik initialValues={{ content: '', internal: false }} validationSchema={CommentSchema} onSubmit={handleSubmit}>
          {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="mb-4">
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="content"
                  placeholder="Add a comment or update note..."
                  value={values.content}
                  onChange={handleChange}
                  isInvalid={touched.content && !!errors.content}
                  className="form-control-dark"
                />
                <Form.Control.Feedback type="invalid">{errors.content}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                {hasRole(['ROLE_ADMIN', 'ROLE_SUPPORT_ENGINEER']) ? (
                  <Form.Check
                    type="switch"
                    id="internal-switch"
                    name="internal"
                    label={
                      <span className="small fw-bold d-flex align-items-center gap-1" style={{ color: '#d97706' }}>
                        <ShieldAlert size={14} /> Internal Note (Support Only)
                      </span>
                    }
                    checked={values.internal}
                    onChange={handleChange}
                  />
                ) : (
                  <div />
                )}

                <Button type="submit" disabled={isSubmitting} className="btn-indigo d-flex align-items-center gap-2">
                  <Send size={16} /> Post Comment
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Comment Thread List */}
        <div className="d-flex flex-column gap-3">
          {comments.length === 0 ? (
            <div className="text-center py-4 fw-medium" style={{ color: '#475569' }}>No comments yet. Start the conversation!</div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className={`p-3 rounded-3 border ${
                  comment.internal
                    ? 'bg-warning bg-opacity-10 border-warning'
                    : 'bg-light border-slate-200'
                }`}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold small shadow-sm"
                      style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                    >
                      {comment.user?.firstName ? comment.user.firstName.charAt(0) : 'U'}
                    </div>
                    <span className="fw-bold" style={{ color: '#0f172a' }}>
                      {comment.user?.firstName} {comment.user?.lastName}
                    </span>
                    <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>
                      {comment.user?.role?.replace('ROLE_', '')}
                    </Badge>
                    {comment.internal && (
                      <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem' }}>
                        Internal Note
                      </Badge>
                    )}
                  </div>
                  <small className="d-flex align-items-center gap-1" style={{ color: '#64748b' }}>
                    <Clock size={12} /> {new Date(comment.createdAt).toLocaleString()}
                  </small>
                </div>
                <div className="small ms-4" style={{ whiteSpace: 'pre-wrap', color: '#1e293b', fontWeight: '500' }}>
                  {comment.content}
                </div>
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
