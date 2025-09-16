// Image gallery with accessibility violations
import React from 'react';

const ImageGallery = () => {
  const images = [
    '/placeholder.svg',
    '/placeholder.svg', 
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  return (
    <section className="stat-card p-6 rounded-lg mb-6">
      {/* Skipped heading level - h5 after h1 */}
      <h5 className="text-lg font-bold stat-title mb-4">Recent Photos</h5>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative group">
            {/* Images without alt text - major accessibility violation */}
            <img 
              src={src}
              className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
              onClick={() => console.log(`Image ${index + 1} clicked`)}
              // Missing alt attribute
            />
            
            {/* Overlay with poor contrast */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded">
              <div className="absolute bottom-2 left-2 text-white text-xs">
                Photo {index + 1}
              </div>
              
              {/* Icon buttons without labels or text */}
              <div className="absolute top-2 right-2 flex gap-1">
                <div className="w-6 h-6 bg-white/30 rounded cursor-pointer flex items-center justify-center">
                  👁️
                </div>
                <div className="w-6 h-6 bg-white/30 rounded cursor-pointer flex items-center justify-center">
                  💾
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive elements without keyboard support */}
      <div className="mt-4 flex justify-between items-center">
        <div 
          className="text-primary cursor-pointer"
          onClick={() => console.log('Previous')}
          // No keyboard support - accessibility violation
        >
          ← Previous
        </div>
        
        {/* Pagination dots without meaning */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
        
        <div 
          className="text-primary cursor-pointer"
          onClick={() => console.log('Next')}
          // No keyboard support - accessibility violation
        >
          Next →
        </div>
      </div>

      {/* Complex interactive widget without ARIA */}
      <div className="mt-4 p-4 border rounded">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm">Filter by category</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Nature', 'People', 'Architecture', 'Abstract'].map((category) => (
            <div
              key={category}
              className="px-3 py-1 bg-gray-200 rounded cursor-pointer hover:bg-gray-300"
              onClick={() => console.log(`Filter: ${category}`)}
              // No role, no keyboard support - accessibility violation
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;