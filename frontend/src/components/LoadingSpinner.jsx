import React from 'react';
import { Spinner } from 'react-bootstrap';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="indigo" style={{ width: '3rem', height: '3rem', color: '#818cf8' }} />
      <span className="mt-3 text-muted fw-medium">{text}</span>
    </div>
  );
};
