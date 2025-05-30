import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-gray-500">Effective Date: {currentDate}</p>
            
            <p className="mt-6">
              Welcome to FactCheck.com. By accessing or using our website, you agree to be bound by the following 
              Terms of Service ("Terms"). Please read them carefully.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By using FactCheck.com, you agree to comply with and be legally bound by these Terms. 
              If you do not agree, please do not use the site.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">2. Purpose of the Website</h2>
            <p>
              FactCheck.com is a platform created to fact-check public claims by analyzing them against 
              trustworthy sources. We assign a credibility score (0-100) and provide linked sources for transparency.
            </p>
            <p className="text-gray-600 italic mt-2">
              Disclaimer: We strive for accuracy, but we do not guarantee the completeness, reliability, 
              or timeliness of the information provided. All content is for informational purposes only, 
              and should not be construed as legal, political, or professional advice.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">3. Use of Content</h2>
            <p>You may:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>View and share links to our content for personal, non-commercial use</li>
              <li>Use the information for educational and awareness purposes</li>
            </ul>
            <p>You may not:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Copy, reproduce, or republish content without credit</li>
              <li>Misrepresent or alter our content for misleading purposes</li>
              <li>Use the site to promote false information or spam</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">4. User Submissions</h2>
            <p>If users are allowed to submit claims, comments, or feedback:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>You are responsible for the content you submit</li>
              <li>You must not post anything illegal, harmful, defamatory, or misleading</li>
              <li>We reserve the right to remove or moderate any content at our discretion</li>
            </ul>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">5. Intellectual Property</h2>
            <p>
              All content on FactCheck.com—including text, design, logo, and analysis—is the intellectual 
              property of the team unless otherwise stated. Unauthorized use is prohibited.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">6. External Links</h2>
            <p>
              We include links to third-party websites as references. We are not responsible for the 
              content or privacy practices of these external sites.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              FactCheck.com and its creators are not liable for any damages, losses, or consequences 
              resulting from the use of our content or reliance on our fact-checks.
            </p>
            <p className="mt-2">Use of the website is at your own risk.</p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we'll revise the "Effective Date" 
              above. Continued use of the site after changes means you accept the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">9. Contact Us</h2>
            <p>For questions, concerns, or feedback, feel free to contact us at:</p>
            <p className="mt-2">
              <strong>Website:</strong>{' '}
              <a href="https://factcheck.com" className="text-blue-600 hover:text-blue-800">
                factcheck.com
              </a>
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:ayushpatel11m@gmail.com" className="text-blue-600 hover:text-blue-800">
                ayushpatel11m@gmail.com
              </a>
            </p>
            <p className="mt-4">
              <strong>Developed by:</strong> Jashadeep Singh Bedi, Kanav Kumar, and Ayush Patel
            </p>
          </div>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfService;
