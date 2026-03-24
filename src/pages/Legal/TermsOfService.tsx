import React from 'react';
import { FileText } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import './LegalPages.css';

const TermsOfService: React.FC = () => {
  return (
    <PublicLayout>
      <div className="legal-page">
        <div className="legal-container">
          <h1><FileText size={28} /> Terms of Service</h1>
          <p className="legal-updated">Last updated: 01/03/2025</p>

          <section>
            <h2>1. Acceptance</h2>
            <p>By using MinesMinis, you agree to these Terms of Service. If you are under 18, a parent or guardian must agree on your behalf.</p>
          </section>

          <section>
            <h2>2. Use of Service</h2>
            <p>MinesMinis is an educational platform for learning English. You agree to:</p>
            <ul>
              <li>Use the service only for lawful, educational purposes</li>
              <li>Not share your account or credentials</li>
              <li>Supervise children while they use the platform</li>
            </ul>
          </section>

          <section>
            <h2>3. Intellectual Property</h2>
            <p>All content (games, stories, words, worksheets) is owned by MinesMinis or licensed to us. You may not copy, distribute, or create derivative works without permission.</p>
          </section>

          <section>
            <h2>4. Premium Subscription</h2>
            <p>Premium features may require a paid subscription. Fees, cancellation, and refunds are governed by our payment provider (Lemon Squeezy). Subscriptions auto-renew unless cancelled.</p>
          </section>

          <section>
            <h2>5. Limitation of Liability</h2>
            <p>MinesMinis is provided &quot;as is&quot;. We are not liable for any indirect, incidental, or consequential damages arising from use of the service.</p>
          </section>

          <section>
            <h2>6. Changes</h2>
            <p>We may update these Terms. Continued use after changes constitutes acceptance. We will notify users of material changes.</p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>For questions: <a href="mailto:legal@minesminis.com">legal@minesminis.com</a></p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
