import { useState } from 'react';

// Mock responses for demonstration - replace with actual API integration
const MOCK_RESPONSES = {
  'What AI models do you use for verification?': 'FactCheck uses a combination of advanced language models including GPT-4 and specialized fact-checking models trained on verified datasets. Our AI cross-references claims against trusted news sources, academic papers, and government databases to provide accurate verification.',
  
  'How accurate is your fact-checking process?': 'Our AI-powered fact-checking achieves 94% accuracy on tested claims. We combine multiple verification methods: automated source checking, sentiment analysis, and cross-referencing with our database of over 50,000 verified claims. Community contributions help improve accuracy over time.',
  
  'What sources does FactCheck consult?': 'We consult over 200 trusted sources including Reuters, AP News, BBC, academic journals, government databases, and fact-checking organizations like Snopes and PolitiFact. Our algorithm prioritizes sources based on credibility scores and recency.',
  
  'Which news organizations are in your database?': 'Our database includes major outlets like CNN, BBC, Reuters, AP, The Guardian, The New York Times, and specialized fact-checkers. We also include academic sources, government publications, and international news agencies for global coverage.',
  
  'How do you ensure source credibility?': 'We use a multi-factor credibility system evaluating: editorial standards, fact-checking history, bias ratings from Media Bias/Fact Check, peer review processes, and transparency in corrections. Each source receives a credibility score that influences our AI\'s weighting.',
  
  'Can I suggest new sources to include?': 'Yes! You can suggest sources through our "Submit Source" feature. We evaluate suggestions based on editorial standards, fact-checking practices, and transparency. Community-suggested sources that meet our criteria are added within 2-3 weeks.',
  
  'What file formats can I upload?': 'You can upload images (JPG, PNG, GIF), PDFs, Word documents, and text files. Our AI can analyze screenshots of social media posts, news articles, and documents up to 10MB. We also support URL submissions for web content.',
  
  'How long does verification take?': 'Basic claims are verified within 30 seconds using our AI. Complex claims requiring deeper research may take 2-5 minutes. Community-contributed evidence typically takes 24-48 hours to be reviewed and incorporated into our analysis.',
  
  'Can I submit anonymous claims?': 'Yes, anonymous submissions are welcome. However, creating a free account allows you to track your submission status, receive updates, and contribute to our community fact-checking efforts. Anonymous submissions help protect whistleblowers and sensitive sources.',
  
  'How are trust scores calculated?': 'Trust scores (0-100) consider: source credibility (40%), content consistency across sources (25%), recency of information (15%), expert verification (10%), and community consensus (10%). Higher scores indicate more reliable information.',
  
  'What makes a high vs low trust score?': 'High scores (80-100): verified by multiple credible sources, consistent across outlets, recent information. Medium (50-79): some verification, minor inconsistencies. Low (0-49): contradicted by sources, lacks verification, or flagged as misinformation.',
  
  'Can trust scores change over time?': 'Yes, trust scores are dynamic. They update as new information emerges, sources are added, or community feedback changes. Breaking news often starts with lower scores that improve as verification increases.',
  
  'How can I contribute to fact-checking?': 'Join our community by creating an account. You can: flag suspicious content, provide additional sources, submit evidence, participate in peer review, and help improve our AI training data. Top contributors earn recognition badges.',
  
  'What are community guidelines?': 'Our guidelines promote respectful discourse, evidence-based contributions, and accurate information sharing. Key rules: cite sources, avoid personal attacks, respect diverse viewpoints, and report violations. Full guidelines are available in your account dashboard.',
  
  'How do you prevent abuse of the system?': 'We use multiple safeguards: community moderation, automated spam detection, reputation systems for contributors, mandatory source citations, and regular audits. Users who violate guidelines may have privileges restricted.'
};

const useChatbot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (message, context = 'general') => {
    setIsLoading(true);
    setError(null);

    try {
      // Check for mock response first
      if (MOCK_RESPONSES[message]) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setIsLoading(false);
        return MOCK_RESPONSES[message];
      }

      // For production, replace this with your actual API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsLoading(false);
      return data.response || data.message || 'I understand your question, but I need more specific information to provide a helpful answer. Could you please rephrase or provide more context?';

    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      
      // Fallback response for errors
      if (message.toLowerCase().includes('fact check') || message.toLowerCase().includes('verify')) {
        return 'FactCheck uses AI to verify claims by cross-referencing multiple trusted sources. You can submit any claim through our platform and receive a detailed trust score with explanations.';
      } else if (message.toLowerCase().includes('source')) {
        return 'We use over 200 trusted sources including major news outlets, academic journals, and government databases. Each source is evaluated for credibility and bias.';
      } else if (message.toLowerCase().includes('trust score')) {
        return 'Trust scores range from 0-100 and are calculated based on source credibility, content consistency, recency, and community input. Higher scores indicate more reliable information.';
      } else if (message.toLowerCase().includes('submit') || message.toLowerCase().includes('upload')) {
        return 'You can submit claims through our Submit page. We accept text, images, documents, and URLs. Basic verification takes about 30 seconds.';
      } else {
        return 'I\'m here to help with questions about FactCheck, misinformation detection, and our verification process. What would you like to know?';
      }
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};

export default useChatbot;