// Video component with accessibility improvements
import { useRef } from 'react';
import SubtitleControls from './SubtitleControls';
import firstVideo from '../assets/videos/videoplayback1.mp4';
import secondVideo from '../assets/videos/videoplayback2.mp4';
import firstVideoVtt from '../assets/subtitles/videoplayback1.vtt';
import secondVideoVtt from '../assets/subtitles/videoplayback2.vtt';

const VideoSection = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const subtitleTracks = [
    { label: 'Português', src: firstVideoVtt, language: 'pt-BR' }
  ];

  const bunnySubtitleTracks = [
    { label: 'Português', src: secondVideoVtt, language: 'pt-BR' }
  ];

  return (
    <section className="stat-card p-4 sm:p-6 rounded-lg mb-6" aria-labelledby="training-videos-heading">
       <form className="mt-4 flex flex-col sm:flex-row gap-2 mb-8" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="video-search" className="sr-only">Pesquisar vídeos</label>
        <input
          id="video-search"
          type="text"
          placeholder="Pesquisar vídeos..."
          className="flex-1 p-2 sm:p-3 border border-border rounded accessible-focus nav-text bg-input text-sm"
          aria-describedby="search-instructions"
        />
        <div id="search-instructions" className="sr-only">
          Digite palavras-chave para pesquisar nos vídeos de treinamento disponíveis
        </div>
        <button
          type="submit"
          className="px-4 py-2 sm:py-3 bg-primary text-primary-foreground rounded accessible-focus hover:bg-primary/90 transition-colors text-sm font-medium"
          aria-label="Pesquisar vídeos"
        >
          Pesquisar
        </button>
      </form>

      <h2 id="training-videos-heading" className="text-base sm:text-xl font-bold stat-title mb-4">Vídeos de Treinamento</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Video with subtitles and accessibility features */}
        <div className="relative">
          <video
            ref={video1Ref}
            className="w-full bg-black rounded object-contain"
            style={{ maxHeight: '300px' }}
            controls
            poster="/placeholder.svg"
            aria-describedby="video-1-description"
          >
            <source src={firstVideo} type="video/mp4" />
            <track
              kind="subtitles"
              src={firstVideoVtt}
              srcLang="pt-BR"
              label="Português"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div id="video-1-description" className="sr-only">
            Vídeo de treinamento com legendas em português disponíveis
          </div>
          {/* Accessible favorite button */}
          {/* <button
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded accessible-focus transition-colors"
            onClick={() => console.log('Favorited')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Favorited');
              }
            }}
            aria-label="Adicionar aos favoritos"
          >
            <span aria-hidden="true">❤️</span>
          </button> */}
          <div className="mt-2">
            <SubtitleControls videoRef={video1Ref} subtitleTracks={subtitleTracks} />
          </div>
        </div>

        {/* Second video with subtitles */}
        <div className="relative">
          <video
            ref={video2Ref}
            className="w-full bg-black rounded object-contain"
            style={{ maxHeight: '300px' }}
            controls
            poster="/placeholder.svg"
            aria-describedby="video-2-description"
          >
            <source src={secondVideo} type="video/mp4" />
            <track
              kind="subtitles"
              src={secondVideoVtt}
              srcLang="pt-BR"
              label="Português"
              default
            />
            Your browser does not support the video tag.
          </video>
          <div id="video-2-description" className="sr-only">
            Vídeo de revisão do Volkswagen GTI com legendas em português disponíveis
          </div>
          <div className="mt-2">
            <SubtitleControls videoRef={video2Ref} subtitleTracks={bunnySubtitleTracks} />
          </div>
        </div>
      </div>

      {/* Accessible status indicators with text alternatives */}
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4" role="status" aria-label="Status do processamento de vídeo">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-sm sm:text-base font-medium">Processamento Completo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-600 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-sm sm:text-base font-medium">Em Andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full" aria-hidden="true"></div>
          <span className="nav-text text-sm sm:text-base font-medium">Erro</span>
        </div>
      </div>

      {/* Accessible search form */}

    </section>
  );
};

export default VideoSection;