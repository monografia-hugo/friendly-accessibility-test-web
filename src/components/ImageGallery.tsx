// Accessible image gallery with proper semantic structure and keyboard navigation
import React, { useState } from 'react';
import { Eye, Download, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ImageGallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  
  const images = [
    { src: '/src/assets/gallery/mountain-landscape.jpg', alt: 'Bela paisagem com montanhas e lago ao pôr do sol', category: 'nature' },
    { src: '/src/assets/gallery/professional-portrait.jpg', alt: 'Retrato de uma pessoa sorridente em trajes profissionais', category: 'people' },
    { src: '/src/assets/gallery/modern-building.jpg', alt: 'Arquitetura de prédio moderno com fachada de vidro', category: 'architecture' },
    { src: '/src/assets/gallery/abstract-pattern.jpg', alt: 'Padrão geométrico abstrato em azul e branco', category: 'abstract' }
  ];

  const categories = [
    { value: 'all', label: 'Todas as Fotos', count: images.length },
    { value: 'nature', label: 'Natureza', count: images.filter(img => img.category === 'nature').length },
    { value: 'people', label: 'Pessoas', count: images.filter(img => img.category === 'people').length },
    { value: 'architecture', label: 'Arquitetura', count: images.filter(img => img.category === 'architecture').length },
    { value: 'abstract', label: 'Abstrato', count: images.filter(img => img.category === 'abstract').length }
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
    <section className="stat-card p-4 sm:p-6 rounded-lg mb-6">
      <h2 className="text-base sm:text-lg font-bold nav-text mb-4">Galeria de Fotos</h2>
      
      {/* Accessible category filter */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 nav-text" aria-hidden="true" />
          <h3 className="text-xs sm:text-sm font-medium nav-text">Filtrar por Categoria</h3>
        </div>
        
        <div role="tablist" aria-label="Categorias de fotos" className="flex gap-1 sm:gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              role="tab"
              aria-selected={activeFilter === category.value}
              aria-controls="photo-grid"
              onClick={() => setActiveFilter(category.value)}
              onKeyDown={(e) => handleKeyDown(e, () => setActiveFilter(category.value))}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium accessible-focus transition-colors ${
                activeFilter === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              <span className="ml-1 sm:ml-2 text-xs opacity-75">
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
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6"
      >
        {filteredImages.map((image, index) => (
          <article key={index} className="relative group">
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-24 sm:h-32 object-cover rounded accessible-focus cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => handleImageAction('view', index)}
              onKeyDown={(e) => handleKeyDown(e, () => handleImageAction('view', index))}
              tabIndex={0}
              role="button"
              aria-describedby={`image-actions-${index}`}
            />
            
            {/* Accessible overlay with proper contrast */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded flex items-center justify-center">
              <div className="flex gap-1 sm:gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageAction('view', index);
                  }}
                  className="p-1 sm:p-2 bg-white/90 text-background rounded-full hover:bg-white accessible-focus transition-colors"
                  aria-label={`Ver ${image.alt}`}
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageAction('download', index);
                  }}
                  className="p-1 sm:p-2 bg-white/90 text-background rounded-full hover:bg-white accessible-focus transition-colors"
                  aria-label={`Baixar ${image.alt}`}
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            
            {/* Screen reader description */}
            <div id={`image-actions-${index}`} className="sr-only">
              Clique para ver imagem completa, ou use os botões de ação para ver ou baixar
            </div>
          </article>
        ))}
      </div>

      {/* Accessible pagination */}
      <nav aria-label="Paginação da galeria de fotos" className="flex justify-between items-center">
        <button 
          onClick={handlePrevious}
          onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
          disabled={currentPage === 0}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 accessible-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
          <span className="sm:hidden">Ant</span>
        </button>
        
        {/* Accessible pagination indicators */}
        <div className="flex items-center gap-1 sm:gap-2" role="tablist" aria-label="Indicadores de página">
          {[0, 1, 2].map((page) => (
            <button
              key={page}
              role="tab"
              aria-selected={currentPage === page}
              onClick={() => setCurrentPage(page)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full accessible-focus transition-colors ${
                currentPage === page ? 'bg-primary' : 'bg-muted-foreground hover:bg-primary/60'
              }`}
              aria-label={`Ir para página ${page + 1}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          onKeyDown={(e) => handleKeyDown(e, handleNext)}
          disabled={currentPage === 2}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 accessible-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Próxima</span>
          <span className="sm:hidden">Próx</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
        </button>
      </nav>
      
      {/* Status announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Mostrando {filteredImages.length} fotos em {activeFilter === 'all' ? 'todas as categorias' : 'categoria ' + activeFilter}
      </div>
    </section>
  );
};

export default ImageGallery;