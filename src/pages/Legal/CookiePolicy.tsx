import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back"><ArrowLeft size={18} /> Back</Link>
        <h1><Cookie size={28} /> Cookie Policy</h1>
        <p className="legal-updated">Last updated: {new Date().toLocaleDateString('en-GB')}</p>

        <section>
          <h2>1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.</p>
        </section>

        <section>
          <h2>2. Cookies We Use</h2>
          <ul>
            <li><strong>Essential:</strong> Required for login, session, and core functionality</li>
            <li><strong>Preferences:</strong> Store theme (light/dark), language settings</li>
            <li><strong>Analytics:</strong> Help us understand how the platform is used (aggregate data only)</li>
          </ul>
        </section>

        <section>
          <h2>3. Third-Party Cookies</h2>
          <p>We may use services (e.g. Firebase, Stripe, analytics) that set their own cookies. These are subject to their respective privacy policies.</p>
        </section>

        <section>
          <h2>4. Managing Cookies</h2>
          <p>You can control cookies via your browser settings. Disabling essential cookies may limit the functionality of MinesMinis.</p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p>Questions: <a href="mailto:privacy@minesminis.com">privacy@minesminis.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
