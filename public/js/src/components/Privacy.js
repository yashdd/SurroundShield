import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/legal.css';

const Privacy = () => {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Usage data and analytics</li>
            <li>Security monitoring data</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the collected information to:
          </p>
          <ul>
            <li>Provide and maintain our services</li>
            <li>Improve and personalize user experience</li>
            <li>Analyze service usage and optimize performance</li>
            <li>Communicate with you about our services</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal
            information. However, no method of transmission over the Internet is 100%
            secure.
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with:
          </p>
          <ul>
            <li>Service providers and partners</li>
            <li>Legal authorities when required by law</li>
            <li>Third parties with your explicit consent</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request data deletion</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <div className="legal-footer">
          <p>
            For privacy-related inquiries, contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@shieldai.com">privacy@shieldai.com</a>
          </p>
          <Link to="/login" className="back-link">Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;