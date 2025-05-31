import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

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
  const [isIncognito, setIsIncognito] = useState(false);

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
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sources: formData.sources.filter(source => source.trim()),
        mediaType: formData.mediaType,
        attachments: formData.attachments.map(att => ({
          name: att.name,
          url: att.preview // Assuming preview is the data URL or a temporary link
        })),
        isIncognito: isIncognito // Add incognito status to the payload
      };

      // Send claim to backend
      const response = await fetch('/api/verify_claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Modify body to send the whole submitData, or adjust backend to expect `claim` and `isIncognito` separately
        body: JSON.stringify({ claim_text: submitData.title, is_incognito: submitData.isIncognito, full_claim_data: submitData }),
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent mb-6">
              Submit a Claim
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Help us combat misinformation by submitting claims for verification.
            </p>
          </div>

          {/* Claim Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-300"
                  placeholder="Enter the claim to be fact-checked"
                />
                {errors.title && (
                  <p className="mt-2 text-red-600">{errors.title}</p>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-300"
                  placeholder="Provide additional context about the claim"
                />
              </div>
            </div>

            {/* Media Type Selection */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <label className="block text-lg font-semibold mb-4 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                  Media Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Article', 'Social Media', 'Video', 'Image'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('mediaType', type)}
                      className={`p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
                        formData.mediaType === type
                          ? 'bg-gradient-to-r from-blue-900 to-red-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <label className="block text-lg font-semibold mb-4 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                  Sources
                </label>
                {formData.sources.map((source, index) => (
                  <div key={index} className="flex gap-4 mb-4">
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => handleSourceChange(index, e.target.value)}
                      placeholder="Enter source URL"
                      className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeSource(index)}
                      className="p-3 text-red-600 hover:text-red-700 transition-colors duration-300"
                      disabled={formData.sources.length === 1}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSource}
                  className="text-blue-900 hover:text-red-600 font-semibold transition-colors duration-300"
                >
                  + Add Another Source
                </button>
              </div>
            </div>

            {/* File Upload Area */}
            <div 
              className={`group relative transform transition-all duration-300 hover:scale-[1.02] ${
                dragActive ? 'ring-2 ring-blue-900' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <label className="block text-lg font-semibold mb-4 bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-900 transition-colors duration-300">
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
                    className="cursor-pointer text-gray-600 hover:text-blue-900 transition-colors duration-300"
                  >
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-lg">Drop files here or click to upload</span>
                    <p className="text-sm text-gray-500 mt-2">Maximum 3 images, 5MB each</p>
                  </label>
                </div>

                {/* Attachment Previews */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.attachments.map((att) => (
                    <div key={att.id} className="relative group">
                      <img
                        src={att.preview}
                        alt={att.name}
                        className="w-full h-32 object-cover rounded-lg transform transition-all duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {Object.entries(uploadProgress).map(([id, progress]) => (
                    <div key={id} className="relative h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 relative">
                        <svg className="animate-spin w-16 h-16 text-blue-900" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Incognito Mode Toggle */}
            <div className="group relative transform transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-900 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="incognito-toggle" className="block text-lg font-semibold bg-gradient-to-r from-blue-900 to-red-600 bg-clip-text text-transparent">
                    Submit Anonymously (Incognito)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsIncognito(!isIncognito)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 ${
                      isIncognito ? 'bg-blue-900' : 'bg-gray-300'
                    }`}
                    id="incognito-toggle"
                  >
                    <span className="sr-only">Enable Incognito Mode</span>
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                        isIncognito ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  When enabled, your claim will be verified, but it will not appear on the "Browse Claims" page or be linked to your profile (if logged in).
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-900 to-red-600 text-white px-10 py-4 rounded-lg text-lg font-semibold 
                  transition-all duration-300 transform hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSubmitting ? 'animate-pulse' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Claim'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitClaimPage;





