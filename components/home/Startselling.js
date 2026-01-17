import { useState } from 'react';

export default function CallToAction() {
  const [showForm, setShowForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 fields
    fullName: '',
    githubLink: '',
    email: '',
    phone: '',
    // Step 2 fields
    projectName: '',
    domain: '',
    image: null,
    video: null,
    zipFile: null,
    price: ''
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formStep === 1) {
    setFormStep(2);
    return;
  }

  try {
    const formData = new FormData();
    
    // Add all text fields
    formData.append('fullName', formData.fullName);
    formData.append('githubLink', formData.githubLink);
    formData.append('email', formData.email);
    formData.append('phone', formData.phone);
    formData.append('projectName', formData.projectName);
    formData.append('domain', formData.domain);
    formData.append('price', formData.price);
    
    // Add files if they exist
    if (formData.image) formData.append('image', formData.image);
    if (formData.video) formData.append('video', formData.video);
    if (formData.zipFile) formData.append('zipFile', formData.zipFile);

    const response = await fetch('/api/users/sellers', {
      method: 'POST',
      body: formData, // No Content-Type header needed for FormData
    });

    if (!response.ok) {
      throw new Error('Failed to submit form');
    }

    const result = await response.json();
    console.log('Success:', result);
    
    setShowForm(false);
    setFormStep(1);
    // Reset form or show success message
    alert('Submission successful!');
    
  } catch (err) {
    console.error('Submission error:', err);
    alert(`Error: ${err.message}`);
  }
};
  return (
    <div className="bg-[#E5FFFE] py-16 relative overflow-hidden">
  {/* Animated background elements */}
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-pulse"></div>
    <div
      className="absolute top-32 right-20 w-16 h-16 bg-red-400/20 rounded-full animate-bounce"
      style={{ animationDelay: "1s" }}
    ></div>
    <div
      className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full animate-ping"
      style={{ animationDelay: "2s" }}
    ></div>
    <div
      className="absolute bottom-32 right-1/3 w-24 h-24 bg-green-400/20 rounded-full animate-pulse"
      style={{ animationDelay: "0.5s" }}
    ></div>
  </div>

  <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
    <h2
      className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
      style={{ fontFamily: "pikachuBold" }}
    >
      Ready to Start Your Journey? 🚀
    </h2>
    <p className="text-xl text-gray-600 mb-8">
      Join thousands of developers who've already chosen PikaProjects
      for their success
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
        <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          Browse Projects ⚡
        </span>
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
      </button>
      <button 
        onClick={() => setShowForm(true)}
        className="group relative border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">
          Start Selling 💪
        </span>
      </button>
    </div>
  </div>

  {/* Form Modal */}
  {showForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {formStep === 1 ? "Seller Information" : "Project Details"}
          </h3>
          <button 
            onClick={() => {
              setShowForm(false);
              setFormStep(1);
            }}
            className="text-white hover:text-yellow-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formStep === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="githubLink">
                  GitHub Profile Link
                </label>
                <input
                  type="url"
                  id="githubLink"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2" htmlFor="projectName">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="domain">
                  Project Domain/Category
                </label>
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  required
                >
                  <option value="">Select a domain</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-apps">Mobile Apps</option>
                  <option value="data-science">Data Science</option>
                  <option value="machine-learning">Machine Learning</option>
                  <option value="game-development">Game Development</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="image">
                  Project Image (Thumbnail)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-800 hover:file:bg-yellow-300"
                  accept="image/*"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="video">
                  Project Demo Video (Optional)
                </label>
                <input
                  type="file"
                  id="video"
                  name="video"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-800 hover:file:bg-yellow-300"
                  accept="video/*"
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="zipFile">
                  Project Files (ZIP)
                </label>
                <input
                  type="file"
                  id="zipFile"
                  name="zipFile"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-800 hover:file:bg-yellow-300"
                  accept=".zip,.rar,.7z"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2" htmlFor="price">
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-white/50"
                  min="1"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {formStep === 2 && (
              <button
                type="button"
                onClick={() => setFormStep(1)}
                className="px-6 py-2 border border-yellow-400 rounded-full font-medium text-yellow-400 hover:bg-yellow-400/20 transition-colors"
              >
                Back
              </button>
            )}
            
            <button
              type="submit"
              className={`px-6 py-2 bg-yellow-400 hover:bg-yellow-300 rounded-full font-medium text-gray-800 hover:shadow-md transition-all ml-auto ${formStep === 1 ? 'w-full' : ''}`}
            >
              {formStep === 1 ? 'Next' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
   
  );
  
}