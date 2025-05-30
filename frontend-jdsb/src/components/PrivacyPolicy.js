import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Add padding top to account for fixed header */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          {/* Back to Home Button */}
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-900 hover:text-blue-700 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">Privacy Policy</h1>
            <p className="text-gray-600 mb-8 text-center">Effective Date: {currentDate}</p>

            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-8">
                Welcome to FactCheck.com. We are committed to safeguarding your privacy and ensuring that your 
                personal data is protected. This Privacy Policy outlines how we collect, use, disclose, and 
                safeguard your information when you visit our website.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">1. Information We Collect</h2>
                <p className="mb-4">We may collect and process the following data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Identification Information:</strong> Such as your name, email address, 
                    and any other information you voluntarily provide when contacting us or submitting claims.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Including your IP address, browser type, operating system, 
                    referral URLs, and pages visited on our site.
                  </li>
                  <li>
                    <strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance user experience, 
                    analyze site traffic, and for security purposes. For more details, please refer to our Cookie Policy.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">2. How We Use Your Information</h2>
                <p className="mb-4">Your information is used for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our services.</li>
                  <li>To communicate with you, including responding to inquiries and providing updates.</li>
                  <li>To analyze usage patterns and improve our website's functionality.</li>
                  <li>To ensure the security and integrity of our website.</li>
                  <li>To comply with legal obligations and enforce our terms and policies.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">3. Sharing Your Information</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal identification information to others. 
                  However, we may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Trusted third parties who assist us in operating our 
                    website and conducting our business, provided they agree to keep this information confidential.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> If required by law or in response to valid requests 
                    by public authorities.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal data 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">5. Your Data Protection Rights</h2>
                <p className="mb-4">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> You have the right to request copies of your personal data.</li>
                  <li><strong>Rectification:</strong> You can request correction of any inaccurate or incomplete data.</li>
                  <li><strong>Erasure:</strong> You can request the deletion of your personal data under certain conditions.</li>
                  <li><strong>Restriction:</strong> You can request that we restrict the processing of your personal data.</li>
                  <li><strong>Objection:</strong> You can object to our processing of your personal data.</li>
                  <li>
                    <strong>Data Portability:</strong> You can request that we transfer the data we have 
                    collected to another organization or directly to you.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">6. Third-Party Links</h2>
                <p>
                  Our website may contain links to external sites. We are not responsible for the privacy 
                  practices or content of these third-party websites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">7. Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 13. We do not knowingly 
                  collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">8. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new Privacy Policy on this page with an updated effective date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">9. Contact Us</h2>
                <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                <p>
                  <strong>Email: </strong>
                  <a 
                    href="mailto:ayushpatel11m@gmail.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    ayushpatel11m@gmail.com
                  </a>
                </p>
                <p className="mt-4">
                  <strong>Website: </strong>
                  <a 
                    href="https://factcheck.com" 
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    factcheck.com
                  </a>
                </p>
                <p className="mt-4">
                  <strong>Developed by:</strong> Jashadeep Singh Bedi, Kanav Kumar, and Ayush Patel
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
