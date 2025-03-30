import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/legal.css';

const Terms = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Shield AI's services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service ("Terms").
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Description of Services</h2>
          <p>
            Shield AI provides AI-powered security and monitoring solutions. Our services
            include but are not limited to security analysis, threat detection, and
            monitoring capabilities.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. User Accounts</h2>
          <p>
            You must maintain the confidentiality of your account credentials and are fully
            responsible for all activities under your account. Notify us immediately of any
            unauthorized use.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Data Usage and Privacy</h2>
          <p>
            Your use of our services is also governed by our Privacy Policy. By using our
            services, you consent to the collection and use of information as detailed in
            our Privacy Policy.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Service Modifications</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of our services
            at any time. We will provide notice of significant changes when possible.
          </p>
        </section>

        <div className="legal-footer">
          <p>
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@shieldai.com">legal@shieldai.com</a>
          </p>
          <Link to="/login" className="back-link">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;