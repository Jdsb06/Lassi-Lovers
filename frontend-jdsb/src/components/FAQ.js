import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AuthButton from './AuthButton';
import Header from './Header';
import Footer from './Footer';

const FAQ = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqData = [
    {
      question: "How does FactCheck verify a claim?",
      answer: "FactCheck uses advanced AI algorithms to cross-reference submitted claims against multiple trusted sources including academic databases, government publications, reputable news organizations, and fact-checking websites. Our system analyzes the credibility of sources, checks for consensus among reliable outlets, and identifies potential bias or misinformation patterns. The verification process typically takes 2-5 minutes and includes source citations for transparency."
    },
    {
      question: "What data sources do you use?",
      answer: "We utilize a comprehensive database of trusted sources including: peer-reviewed academic journals, government databases (CDC, WHO, FDA, etc.), established news organizations with strong editorial standards, verified fact-checking organizations (Snopes, PolitiFact, FactCheck.org), and official statements from recognized institutions. Our AI is trained to weight sources based on their reliability, expertise in specific domains, and track record for accuracy."
    },
    {
      question: "How accurate are the trust scores?",
      answer: "Our trust scores have an accuracy rate of approximately 85-92% based on independent validation studies. The scores range from 0-100, where 0-30 indicates likely false information, 31-60 suggests mixed or uncertain reliability, and 61-100 represents highly credible content. We continuously improve our algorithms by incorporating user feedback, expert reviews, and updates to our source databases. Remember that trust scores are tools to aid your judgment, not replace critical thinking."
    },
    {
      question: "Can I submit a claim anonymously?",
      answer: "Yes, you can submit claims without creating an account or providing personal information. Anonymous submissions are processed with the same rigor as registered user submissions. However, creating a free account offers benefits like tracking your submission history, receiving notifications when verification is complete, contributing to community discussions, and building your contributor reputation score."
    },
    {
      question: "How do I flag incorrect fact-checks?",
      answer: "If you believe a fact-check result is incorrect, you can flag it by clicking the 'Report Issue' button on any fact-check result page. Provide specific reasons for your concern and include additional sources if available. Our team reviews all flags within 48 hours. Frequent contributors with high accuracy rates can also participate in our peer review system to help improve fact-check quality across the platform."
    },
    {
      question: "Who can view my submitted claims?",
      answer: "Anonymous submissions are not linked to any personal information. For registered users, your submission history is private by default and only visible to you. You can choose to make individual submissions public to contribute to our community database. Public submissions help other users see previously fact-checked claims and contribute to our collective knowledge base. Your personal information is never shared without explicit consent."
    },
    {
      question: "Is FactCheck free to use?",
      answer: "Yes, FactCheck - No Misinfo is completely free for individual users. You can submit unlimited claims, access all fact-check results, and participate in community features at no cost. We're supported by grants from digital literacy organizations and partnerships with educational institutions. For organizations requiring API access or bulk verification services, we offer premium plans to help sustain the platform."
    },
    {
      question: "How quickly will I receive fact-check results?",
      answer: "Most fact-check results are available within 2-5 minutes of submission. Complex claims involving multiple statements or requiring deep research may take up to 15 minutes. During peak usage times, results may take slightly longer. You'll receive an email notification (if provided) or can check your submission status on the website. Priority processing is available for urgent claims from verified journalists and educators."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Add padding top to account for fixed header */}
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          {/* FAQ Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Questions Answered</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Everything you need to know about using our platform effectively.
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                {faqData.map((faq, index) => (
                  <div 
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className={`flex-shrink-0 transform transition-transform duration-300 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}>
                        <ChevronDown className={`w-6 h-6 ${
                          openFAQ === index ? 'text-red-600' : 'text-blue-900'
                        }`} />
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-500 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-8 pb-6">
                        <div className="border-t border-gray-100 pt-6">
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Help Section */}
              <div className="mt-16 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Can't find what you're looking for? Our community and support team 
                  are here to help you make the most of FactCheck - No Misinfo.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/submit" 
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Try Submitting a Claim
                  </Link>
                  <Link 
                    to="/about" 
                    className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold border-2 border-blue-900 hover:bg-blue-50 transition-colors"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;
