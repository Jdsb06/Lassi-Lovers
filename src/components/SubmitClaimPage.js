import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SubmitClaimPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sources: [''],
    mediaType: 'Article',
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll effect handler like BrowseClaimsPage
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Validation functions
  const validateTitle = (title) => {
    if (!title.trim()) return 'Title is required';
    if (title.length > 100) return 'Title must be 100 characters or less';
    return '';
  };

  const validateDescription = (description) => {
    if (description.length > 500) return 'Description must be 500 characters or less';
    return '';
  };

  const validateUrl = (url) => {
    if (!url.trim()) return '';
    const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    if (!urlRegex.test(url)) return 'Please enter a valid URL';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate title as it's the only required field
    newErrors.title = validateTitle(formData.title);
    
    setErrors(newErrors);
    // Return true if there are no title errors
    return !newErrors.title;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSourceChange = (index, value) => {
    const newSources = [...formData.sources];
    newSources[index] = value;
    setFormData(prev => ({ ...prev, sources: newSources }));
    
    // Clear source errors
    if (errors.sources) {
      setErrors(prev => ({ ...prev, sources: undefined }));
    }
  };

  const addSource = () => {
    setFormData(prev => ({ 
      ...prev, 
      sources: [...prev.sources, ''] 
    }));
  };

  const removeSource = (index) => {
    if (formData.sources.length > 1) {
      const newSources = formData.sources.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, sources: newSources }));
    }
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });

    if (formData.attachments.length + validFiles.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    validFiles.forEach(file => {
      const fileId = Date.now() + Math.random();
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress >= 100) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: currentProgress + 10 };
        });
      }, 100);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, {
              id: fileId,
              file,
              preview: e.target.result,
              name: file.name
            }]
          }));
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
          });
        }, 1000); // Simulate upload time
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== id)
    }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare form data for submission
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sources: formData.sources.filter(source => source.trim()),
        mediaType: formData.mediaType,
        attachments: formData.attachments.map(att => ({
          name: att.name,
          url: att.preview
        }))
      };

      // Send claim to backend
      const response = await fetch('http://localhost:5000/verify_claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claim: submitData.title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to verify claim');
      }

      const result = await response.json();
      
      // Store the result in localStorage
      localStorage.setItem('claimResult', JSON.stringify({
        ...result,
        claim: submitData.title // Make sure the claim text is included
      }));
      
      // Navigate to result page
      navigate('/result');
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(error.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update isFormValid to only check title
  const isFormValid = formData.title.trim() && !errors.title;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Updated to match BrowseClaimsPage */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center relative">
                <div className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-900 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">FactCheck</h1>
                <p className="text-xs text-red-600 font-semibold -mt-1">NO MISINFO</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-900 transition-colors">Home</Link>
              <Link to="/submit" className="text-blue-900 font-semibold border-b-2 border-red-600">Submit a Claim</Link>
              <Link to="/browse" className="text-gray-700 hover:text-blue-900 transition-colors">Browse Claims</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 transition-colors">About</Link>
              <Link to="/faqs" className="text-gray-700 hover:text-blue-900 transition-colors">FAQ/Help</Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="px-4 py-3 space-y-3">
                <Link to="/" className="block text-gray-700">Home</Link>
                <Link to="/submit" className="block text-blue-900 font-semibold">Submit a Claim</Link>
                <Link to="/browse" className="block text-gray-700">Browse Claims</Link>
                <Link to="/about" className="block text-gray-700">About</Link>
                <Link to="/faqs" className="block text-gray-700">FAQ/Help</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-12 max-w-6xl">
        {/* Page title */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Submit a Claim</h1>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Claim Title */}
            <div className="space-y-2 mb-6">
              <label htmlFor="title" className="block text-lg font-bold text-gray-900">
                Claim Title *
              </label>
              <p className="text-gray-600 text-sm">Provide a clear, concise title that summarizes the claim you want fact-checked.</p>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all ${
                  errors.title ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Enter a clear, concise title for the claim..."
                maxLength={100}
              />
              <div className="flex justify-between mt-2">
                {errors.title && <p className="text-red-600 text-sm font-medium">{errors.title}</p>}
                <p className="text-gray-500 text-sm ml-auto font-medium">{formData.title.length}/100</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <label htmlFor="description" className="block text-lg font-bold text-gray-900">
                Additional Context
              </label>
              <p className="text-gray-600 text-sm">Provide background information, where you encountered this claim, and why you think it needs verification.</p>
              <textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-4 py-2 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all resize-none ${
                  errors.description ? 'border-red-500 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Provide additional context, where you encountered this claim, why you think it might be false, etc..."
                maxLength={500}
              />
              <div className="flex justify-between mt-2">
                {errors.description && <p className="text-red-600 text-sm font-medium">{errors.description}</p>}
                <p className="text-gray-500 text-sm ml-auto font-medium">{formData.description.length}/500</p>
              </div>
            </div>

            {/* Media Type */}
            <div className="space-y-2 mb-6">
              <label className="block text-lg font-bold text-gray-900">
                Content Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'Article', icon: '📰', label: 'Article' },
                  { value: 'Social Media Post', icon: '📱', label: 'Social Media' },
                  { value: 'Video', icon: '🎥', label: 'Video' },
                  { value: 'Other', icon: '📄', label: 'Other' }
                ].map((type) => (
                  <label key={type.value} className="group cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value={type.value}
                      checked={formData.mediaType === type.value}
                      onChange={(e) => handleInputChange('mediaType', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-xl text-center transition-all ${
                      formData.mediaType === type.value
                        ? 'border-red-500 bg-red-50 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}>
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <span className="text-sm font-semibold text-gray-700">{type.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="space-y-2 mb-6">
              <label className="block text-lg font-bold text-gray-900">
                Supporting URLs or Sources
              </label>
              <p className="text-gray-600 text-sm">Add links to articles, social media posts, or other sources related to this claim.</p>
              <div className="space-y-3">
                {formData.sources.map((source, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={source}
                        onChange={(e) => handleSourceChange(index, e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 transition-all hover:border-gray-300"
                        placeholder="https://example.com/source"
                      />
                    </div>
                    {formData.sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSource(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.sources && (
                <p className="text-red-600 text-sm font-medium">Please check your URLs for correct formatting</p>
              )}
              <button
                type="button"
                onClick={addSource}
                className="text-blue-900 hover:text-blue-700 text-sm font-bold flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add another source</span>
              </button>
            </div>

            {/* File Upload */}
            <div className="space-y-2 mb-6">
              <label className="block text-lg font-bold text-gray-900">
                Upload Evidence (Max 3 images)
              </label>
              <p className="text-gray-600 text-sm">Screenshots, photos, or other visual evidence that supports your claim.</p>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-red-500 rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700 text-lg mb-2 font-medium">Drag and drop images here, or</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl hover:from-red-700 hover:to-red-800 transition-all cursor-pointer inline-block font-semibold shadow-lg hover:shadow-xl"
                    >
                      Choose Files
                    </label>
                  </div>
                  <p className="text-gray-500 text-sm">JPG, PNG up to 5MB each</p>
                </div>
              </div>

              {/* Upload Progress */}
              {Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(uploadProgress).map(([fileId, progress]) => (
                    <div key={fileId} className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-red-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Image Previews */}
              {formData.attachments.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {formData.attachments.map((attachment) => (
                    <div key={attachment.id} className="relative group">
                      <img
                        src={attachment.preview}
                        alt={attachment.name}
                        className="w-full h-32 object-cover rounded-xl shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-xl truncate">
                        {attachment.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Section */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <Link
                to="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  isFormValid && !isSubmitting
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Submit Claim</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Our AI-powered system will analyze your submission and provide a comprehensive fact-check report. 
              The more details you provide, the more accurate our analysis will be.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Be Specific</h4>
                <p className="text-gray-600">Provide clear, specific claims rather than vague statements</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Context</h4>
                <p className="text-gray-600">Include background information and why verification is needed</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Include Sources</h4>
                <p className="text-gray-600">Add relevant URLs and supporting evidence when possible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Added to match BrowseClaimsPage */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center relative">
                  <div className="w-5 h-5 bg-blue-900 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">FactCheck</h3>
                  <p className="text-xs text-red-400">NO MISINFO</p>
                </div>
              </div>
              <p className="text-gray-400">
                Fighting misinformation with AI-powered fact-checking and community collaboration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/submit" className="hover:text-white transition-colors">Submit Claim</Link></li>
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse Claims</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/faqs" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/guidelines" className="hover:text-white transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="/" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-sm font-bold">t</span>
                </a>
                <a href="/" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors">
                  <span className="text-sm font-bold">in</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} FactCheck - No Misinfo. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubmitClaimPage;

