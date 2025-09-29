// Accessible image gallery with proper semantic structure and keyboard navigation
import React, { useState } from 'react';
import { Eye, Download, Filter } from 'lucide-react';
import mountainLandscape from '@/assets/gallery/mountain-landscape.jpg';
import professionalPortrait from '@/assets/gallery/professional-portrait.jpg';
import modernBuilding from '@/assets/gallery/modern-building.jpg';
import abstractPattern from '@/assets/gallery/abstract-pattern.jpg';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';

const ImageGallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: mountainLandscape, alt: 'Bela paisagem com montanhas e lago ao pôr do sol', category: 'nature' },
    { src: professionalPortrait, alt: 'Retrato de uma pessoa sorridente em trajes profissionais', category: 'people' },
    { src: modernBuilding, alt: 'Arquitetura de prédio moderno com fachada de vidro', category: 'architecture' },
    { src: abstractPattern, alt: 'Padrão geométrico abstrato em azul e branco', category: 'abstract' }
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

  // Hook into carousel API to track current index
  React.useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentIndex(carouselApi.selectedScrollSnap());
    // Set initial index
    setCurrentIndex(carouselApi.selectedScrollSnap());
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  // When filter changes, reset the carousel to the first slide
  React.useEffect(() => {
    setCurrentIndex(0);
    carouselApi?.scrollTo(0);
  }, [activeFilter, carouselApi]);

  const handleImageAction = (action: string, imageIndex: number) => {
    console.log(`${action} action for image ${imageIndex + 1}`);
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
          <h3 className="text-sm sm:text-base font-medium nav-text">Filtrar por Categoria</h3>
        </div>

        <div role="tablist" aria-label="Categorias de fotos" className="flex gap-1 sm:gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.value}
              role="tab"
              aria-selected={activeFilter === category.value}
              aria-controls="photo-carousel"
              onClick={() => setActiveFilter(category.value)}
              onKeyDown={(e) => handleKeyDown(e, () => setActiveFilter(category.value))}
              className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium accessible-focus transition-colors ${
                activeFilter === category.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="hidden sm:inline">{category.label}</span>
              <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              <span className="ml-1 sm:ml-2 text-sm opacity-80">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Accessible carousel showing one image per slide */}
  <Carousel id="photo-carousel" setApi={setCarouselApi} className="mb-4 sm:mb-6" opts={{ loop: true }}>
        <CarouselContent>
          {filteredImages.map((image, index) => (
            <CarouselItem key={`${image.src}-${index}`} className="">
              <article className="relative group w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-56 sm:h-64 lg:h-72 xl:h-80 object-contain bg-muted rounded accessible-focus cursor-pointer hover:opacity-90 transition-opacity"
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel navigation arrows - positioned inside to avoid overflow */}
        <CarouselPrevious
          aria-label="Slide anterior"
          className="left-2 top-1/2 -translate-y-1/2 sm:left-3 md:left-4 z-20"
        />
        <CarouselNext
          aria-label="Próximo slide"
          className="right-2 top-1/2 -translate-y-1/2 sm:right-3 md:right-4 z-20"
        />
      </Carousel>

      {/* Accessible slide indicators */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2" role="tablist" aria-label="Indicadores de slide">
        {Array.from({ length: filteredImages.length }, (_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={currentIndex === i}
            onClick={() => carouselApi?.scrollTo(i)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full accessible-focus transition-all duration-300 ${
              currentIndex === i ? 'bg-primary scale-110' : 'bg-muted-foreground hover:bg-primary/60 hover:scale-105'
            }`}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Status announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        Mostrando slide {currentIndex + 1} de {filteredImages.length} em {activeFilter === 'all' ? 'todas as categorias' : 'categoria ' + activeFilter}
      </div>
    </section>
  );
};

export default ImageGallery;