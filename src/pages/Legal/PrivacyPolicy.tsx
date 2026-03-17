import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back"><ArrowLeft size={18} /> Back</Link>
        <h1><Shield size={28} /> Privacy Policy</h1>
        <p className="legal-updated">Last updated: 01/03/2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>MinesMinis (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting the privacy of children and their parents. This Privacy Policy explains how we collect, use, and safeguard information when you use our educational platform.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We collect:</p>
          <ul>
            <li>Account information (email, display name, avatar) when you sign up</li>
            <li>Learning progress data (XP, completed activities, favorites)</li>
            <li>Technical data (device type, browser) to improve the service</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and personalize the learning experience</li>
            <li>Track progress and show achievements</li>
            <li>Improve our platform and content</li>
            <li>Communicate important updates (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2>4. Children&apos;s Privacy</h2>
          <p>MinesMinis is designed for children aged 1–10. We comply with applicable children&apos;s privacy laws (e.g. COPPA). Parental consent is required for children under 13. We do not sell personal information.</p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>We use industry-standard security measures to protect your data. Data is transmitted over HTTPS and stored securely.</p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>For privacy questions: <a href="mailto:privacy@minesminis.com">privacy@minesminis.com</a></p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
