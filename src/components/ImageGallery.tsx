// Accessible image gallery with proper semantic structure and keyboard navigation
import React, { useState } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ImageGallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const images = [
    { src: '/src/assets/gallery/mountain-landscape.jpg', alt: 'Beautiful landscape with mountains and lake at sunset', category: 'nature' },
    { src: '/src/assets/gallery/professional-portrait.jpg', alt: 'Portrait of a smiling person in professional attire', category: 'people' },
    { src: '/src/assets/gallery/modern-building.jpg', alt: 'Modern building architecture with glass facade', category: 'architecture' },
    { src: '/src/assets/gallery/abstract-pattern.jpg', alt: 'Abstract geometric pattern in blue and white', category: 'abstract' }
  ];

  const categories = [
    { value: 'all', label: 'All Photos', count: images.length },
    { value: 'nature', label: 'Nature', count: images.filter(img => img.category === 'nature').length },
    { value: 'people', label: 'People', count: images.filter(img => img.category === 'people').length },
    { value: 'architecture', label: 'Architecture', count: images.filter(img => img.category === 'architecture').length },
    { value: 'abstract', label: 'Abstract', count: images.filter(img => img.category === 'abstract').length }
  ];

  const filteredImages = activeFilter === 'all' 
    ? images 
    : images.filter(img => img.category === activeFilter);

  const handleImageAction = (action: string, imageIndex: number) => {
    console.log(`${action} action for image ${imageIndex + 1}`);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(2, prev + 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <section className="stat-card p-6 rounded-lg mb-6">
      <h2 className="text-lg font-bold nav-text mb-4">Photo Gallery</h2>
      
      {/* Accessible category filter */}
      <div className="mb-6 p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 nav-text" aria-hidden="true" />
          <h3 className="text-sm font-medium nav-text">Filter by Category</h3>
        </div>
        
        <div role="tablist" aria-label="Photo categories" className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              role="tab"
              aria-selected={activeFilter === category.value}
              aria-controls="photo-grid"
              onClick={() => setActiveFilter(category.value)}
              onKeyDown={(e) => handleKeyDown(e, () => setActiveFilter(category.value))}
              className={`px-4 py-2 rounded-lg text-sm font-medium accessible-focus transition-colors ${
                activeFilter === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Accessible image grid */}
      <div 
        id="photo-grid"
        role="tabpanel"
        aria-label={`${filteredImages.length} photos in ${activeFilter} category`}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {filteredImages.map((image, index) => (
          <article key={index} className="relative group">
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover rounded accessible-focus cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleImageAction('view', index)}
              onKeyDown={(e) => handleKeyDown(e, () => handleImageAction('view', index))}
              tabIndex={0}
              role="button"
              aria-describedby={`image-actions-${index}`}
            />
            
            {/* Accessible overlay with proper contrast */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageAction('view', index);
                  }}
                  className="p-2 bg-white/90 text-background rounded-full hover:bg-white accessible-focus transition-colors"
                  aria-label={`View ${image.alt}`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageAction('download', index);
                  }}
                  className="p-2 bg-white/90 text-background rounded-full hover:bg-white accessible-focus transition-colors"
                  aria-label={`Download ${image.alt}`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            
            {/* Screen reader description */}
            <div id={`image-actions-${index}`} className="sr-only">
              Click to view full image, or use action buttons to view or download
            </div>
          </article>
        ))}
      </div>

      {/* Accessible pagination */}
      <nav aria-label="Photo gallery pagination" className="flex justify-between items-center">
        <button 
          onClick={handlePrevious}
          onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
          disabled={currentPage === 0}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 accessible-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>
        
        {/* Accessible pagination indicators */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Page indicators">
          {[0, 1, 2].map((page) => (
            <button
              key={page}
              role="tab"
              aria-selected={currentPage === page}
              onClick={() => setCurrentPage(page)}
              className={`w-3 h-3 rounded-full accessible-focus transition-colors ${
                currentPage === page ? 'bg-primary' : 'bg-muted-foreground hover:bg-primary/60'
              }`}
              aria-label={`Go to page ${page + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          onKeyDown={(e) => handleKeyDown(e, handleNext)}
          disabled={currentPage === 2}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 accessible-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
      
      {/* Status announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Showing {filteredImages.length} photos in {activeFilter === 'all' ? 'all categories' : activeFilter + ' category'}
      </div>
    </section>
  );
};

export default ImageGallery;