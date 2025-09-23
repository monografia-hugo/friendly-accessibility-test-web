// Componente de mídia acessível para teste com usuários com deficiência
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Captions, Settings, Download, Share } from 'lucide-react';
import bigBuckBunnyVtt from '../assets/subtitles/big-buck-bunny.vtt';
// Remover importação do VTT - usar arquivo local

const AccessibleMedia = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fechar menus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.video-controls')) {
        setShowSettings(false);
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleToggleCaptions = () => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      const newShowCaptions = !showCaptions;

      console.log('Toggle legendas:', {
        showCaptions,
        newShowCaptions,
        tracksLength: tracks.length
      });

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        console.log(`Track ${i} before:`, {
          kind: track.kind,
          label: track.label,
          mode: track.mode
        });

        if (track.kind === 'subtitles' || track.kind === 'captions') {
          track.mode = newShowCaptions ? 'showing' : 'hidden';
          console.log(`Track ${i} after:`, {
            kind: track.kind,
            label: track.label,
            mode: track.mode
          });
        }
      }

      setShowCaptions(newShowCaptions);

      // Feedback para screen readers
      const announcement = newShowCaptions ? 'Legendas ativadas' : 'Legendas desativadas';
      console.log('Announcement:', announcement);

      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = announcement;
      document.body.appendChild(liveRegion);

      setTimeout(() => {
        document.body.removeChild(liveRegion);
      }, 1000);
    }
  };

  // Inicializar legendas quando o vídeo carregar
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const initializeTracks = () => {
        const tracks = video.textTracks;
        console.log('Tracks encontradas:', tracks.length);

        for (let i = 0; i < tracks.length; i++) {
          const track = tracks[i];
          console.log(`Track ${i}:`, {
            kind: track.kind,
            label: track.label,
            language: track.language,
            mode: track.mode
          });

          if (track.kind === 'subtitles' || track.kind === 'captions') {
            track.mode = showCaptions ? 'showing' : 'hidden';
            console.log(`Track ${i} mode set to:`, track.mode);
          }
        }
      };

      // Múltiplos eventos para garantir que funcione
      video.addEventListener('loadedmetadata', initializeTracks);
      video.addEventListener('loadeddata', initializeTracks);
      video.addEventListener('canplay', initializeTracks);

      // Timeout de fallback
      const timeoutId = setTimeout(initializeTracks, 1000);

      return () => {
        video.removeEventListener('loadedmetadata', initializeTracks);
        video.removeEventListener('loadeddata', initializeTracks);
        video.removeEventListener('canplay', initializeTracks);
        clearTimeout(timeoutId);
      };
    }
  }, [showCaptions]);

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleDownload = async () => {
    if (videoRef.current) {
      try {
        setDownloadProgress(0);
        const videoUrl = videoRef.current.src;
        const response = await fetch(videoUrl);
        const blob = await response.blob();

        // Simular progresso de download
        const interval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 100);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'video-acessibilidade.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao baixar vídeo:', error);
        alert('Erro ao baixar o vídeo. Tente novamente.');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vídeo sobre Acessibilidade Web',
          text: 'Confira este vídeo demonstrativo sobre práticas de acessibilidade web!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Compartilhamento cancelado ou erro:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
      setShowShareMenu(false);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      alert('Erro ao copiar link. Tente novamente.');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Dashboard de análise de dados com gráficos coloridos mostrando métricas de vendas, receita e crescimento em tempo real. Interface moderna com elementos visuais organizados e legíveis.',
      caption: 'Dashboard de Análise de Dados'
    },
    {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Gráfico de barras interativo em tons de azul mostrando crescimento de vendas mensais ao longo de 12 meses. Dados apresentados de forma clara e acessível com valores numéricos visíveis.',
      caption: 'Gráfico de Crescimento Mensal'
    },
    {
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Equipe de desenvolvedores trabalhando em computadores com múltiplos monitores. Ambiente de trabalho colaborativo com foco em acessibilidade e inclusão digital.',
      caption: 'Equipe de Desenvolvimento'
    },
    {
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Interface de usuário acessível com elementos de design inclusivo, botões grandes, contraste adequado e navegação por teclado destacada.',
      caption: 'Interface Acessível'
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Usuário com deficiência visual utilizando screen reader em computador. Demonstração de tecnologia assistiva para navegação web acessível.',
      caption: 'Tecnologia Assistiva'
    },
    {
      src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&crop=center&auto=format&q=80',
      alt: 'Smartphone com aplicativo acessível aberto, mostrando interface responsiva com elementos grandes, contraste adequado e navegação simplificada.',
      caption: 'Aplicativo Móvel Acessível'
    }
  ];

  return (
    <section className="stat-card p-6 rounded-lg mb-6" aria-labelledby="accessible-media-heading">
      <h2 id="accessible-media-heading" className="text-lg font-bold nav-text mb-6">
        Mídia Acessível
      </h2>

      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-4">
          Esta seção demonstra práticas de acessibilidade para mídia, incluindo vídeos com legendas,
          imagens com texto alternativo descritivo e controles acessíveis.
        </p>
      </div>

      <div className="space-y-8">
        {/* Vídeo com controles acessíveis */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-4">Vídeo com Controles Acessíveis</h3>
          <div className="bg-black rounded-lg overflow-hidden">
            <div className="aspect-video bg-black">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                poster="https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                aria-label="Vídeo demonstrativo sobre acessibilidade web com controles acessíveis e legendas em português"
              >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              <track
                kind="subtitles"
                src={bigBuckBunnyVtt}
                srcLang="pt-BR"
                label="Português"
                default
              />
              {/* <track
                kind="captions"
                src="/subtitles-corrected.vtt"
                srcLang="pt-BR"
                label="Legendas em Português"
              /> */}
              Seu navegador não suporta o elemento de vídeo. Este vídeo demonstra práticas de acessibilidade web.
              </video>
            </div>

            {/* Controles customizados */}
            <div className="bg-gray-800 p-4 space-y-3 video-controls">
              {/* Barra de progresso */}
              <div>
                <label htmlFor="progress" className="sr-only">
                  Barra de progresso do vídeo
                </label>
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accessible-focus"
                  aria-label="Posição atual do vídeo"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controles principais */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-white hover:bg-gray-700 rounded accessible-focus"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <button
                    className="p-2 text-white hover:bg-gray-700 rounded accessible-focus"
                    onClick={handleMute}
                    aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <label htmlFor="volume" className="sr-only">
                      Controle de volume
                    </label>
                    <input
                      id="volume"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accessible-focus"
                      aria-label="Nível de volume"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className={`p-2 text-white hover:bg-gray-700 rounded accessible-focus relative ${
                      showCaptions ? 'bg-blue-600' : ''
                    }`}
                    onClick={handleToggleCaptions}
                    aria-label={showCaptions ? 'Ocultar legendas' : 'Mostrar legendas'}
                    title={showCaptions ? 'Legendas ativadas - Clique para ocultar' : 'Legendas desativadas - Clique para mostrar'}
                  >
                    <Captions className="h-5 w-5" />
                    {showCaptions && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center" aria-label="Legendas ativas">
                        <span className="sr-only">Legendas ativas</span>
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      className={`p-2 text-white hover:bg-gray-700 rounded accessible-focus ${
                        showSettings ? 'bg-blue-600' : ''
                      }`}
                      onClick={handleToggleSettings}
                      aria-label="Configurações do vídeo"
                      aria-expanded={showSettings}
                    >
                      <Settings className="h-5 w-5" />
                    </button>

                    {showSettings && (
                      <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg p-3 min-w-48 z-10">
                        <h4 className="text-sm font-medium text-white mb-2">Configurações</h4>
                        <div className="space-y-2">
                          <div>
                            <label className="text-xs text-gray-300 block mb-1">Qualidade:</label>
                            <select className="w-full p-1 bg-gray-600 text-white text-xs rounded">
                              <option>Auto</option>
                              <option>720p</option>
                              <option>480p</option>
                              <option>360p</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-300 block mb-1">Legendas:</label>
                            <select className="w-full p-1 bg-gray-600 text-white text-xs rounded">
                              <option>Português</option>
                              <option>Inglês</option>
                              <option>Desabilitado</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className="p-2 text-white hover:bg-gray-700 rounded accessible-focus"
                    onClick={handleDownload}
                    aria-label="Baixar vídeo"
                    disabled={downloadProgress > 0 && downloadProgress < 100}
                  >
                    <Download className="h-5 w-5" />
                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {downloadProgress}%
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <button
                      className={`p-2 text-white hover:bg-gray-700 rounded accessible-focus ${
                        showShareMenu ? 'bg-blue-600' : ''
                      }`}
                      onClick={handleShare}
                      aria-label="Compartilhar vídeo"
                      aria-expanded={showShareMenu}
                    >
                      <Share className="h-5 w-5" />
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-gray-700 rounded-lg shadow-lg p-3 min-w-48 z-10">
                        <h4 className="text-sm font-medium text-white mb-2">Compartilhar</h4>
                        <div className="space-y-2">
                          <button
                            className="w-full p-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 accessible-focus"
                            onClick={copyToClipboard}
                          >
                            Copiar Link
                          </button>
                          <button
                            className="w-full p-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 accessible-focus"
                            onClick={() => {
                              const url = `mailto:?subject=Vídeo sobre Acessibilidade Web&body=Confira este vídeo: ${window.location.href}`;
                              window.open(url);
                              setShowShareMenu(false);
                            }}
                          >
                            Enviar por Email
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controles de velocidade */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Velocidade:</span>
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    className={`px-2 py-1 text-xs rounded accessible-focus ${
                      playbackRate === rate
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                    onClick={() => handlePlaybackRateChange(rate)}
                    aria-label={`Velocidade ${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de imagens acessível */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-4">Galeria de Imagens Acessível</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {images.map((image, index) => (
              <div key={index} className="bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 lg:p-4">
                  <p className="text-sm lg:text-base font-medium nav-text">{image.caption}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                    Imagem {index + 1} de {images.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Áudio com controles acessíveis */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-4">Áudio com Controles Acessíveis</h3>
          <div className="bg-muted p-4 rounded-lg">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              aria-label="Áudio demonstrativo sobre acessibilidade web com controles acessíveis e transcrição disponível"
            >
              <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
              <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
              <track
                kind="captions"
                src="https://raw.githubusercontent.com/mozilla/vtt.js/main/sample/sample.vtt"
                srcLang="pt-BR"
                label="Legendas em Português"
              />
              Seu navegador não suporta o elemento de áudio. Uma transcrição está disponível abaixo.
            </audio>
            <p className="text-sm text-muted-foreground mt-2">
              Use os controles nativos do navegador para reproduzir o áudio. Uma transcrição completa está disponível abaixo.
            </p>
          </div>
        </div>

        {/* Transcrição de áudio */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-4">Transcrição de Áudio</h3>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="text-sm font-medium nav-text mb-2">Transcrição do áudio acima:</h4>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>00:00 - 00:05:</strong> [Som de sino tocando] - Notificação sonora indicando início da demonstração.
              </p>
              <p>
                <strong>00:05 - 00:10:</strong> [Som de sino tocando novamente] - Confirmação de que o sistema de acessibilidade está ativo.
              </p>
              <p>
                <strong>00:10 - 00:15:</strong> [Som de sino final] - Indicação de que a demonstração de acessibilidade foi concluída com sucesso.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Nota:</strong> Esta transcrição inclui descrições de sons não verbais para usuários com deficiência auditiva,
                seguindo as diretrizes WCAG para acessibilidade de mídia.
              </p>
            </div>
          </div>
        </div>

        {/* Vídeos educativos sobre acessibilidade */}
        <div>
          <h3 className="text-base font-semibold nav-text mb-4">Vídeos Educativos sobre Acessibilidade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src="https://www.youtube.com/embed/20SHvU2PKsM"
                  title="Introdução à Acessibilidade Web - WCAG Guidelines"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  aria-label="Vídeo educativo sobre introdução à acessibilidade web e diretrizes WCAG"
                ></iframe>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium nav-text mb-2">Introdução à Acessibilidade Web</h4>
                <p className="text-xs text-muted-foreground">
                  Aprenda os fundamentos da acessibilidade web e como implementar as diretrizes WCAG em seus projetos.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src="https://www.youtube.com/embed/cMO5maAcgQ8?si=m6yVAW5Jxw1PAFBb"
                  title="Navegação por Teclado e Screen Readers"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  aria-label="Vídeo educativo sobre navegação por teclado e uso de screen readers"
                ></iframe>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium nav-text mb-2">Navegação por Teclado</h4>
                <p className="text-xs text-muted-foreground">
                  Demonstração prática de como usuários com deficiência visual navegam na web usando teclado e screen readers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções de acessibilidade */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-base font-semibold text-blue-900 mb-2">
            Instruções de Acessibilidade para Mídia
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Vídeos:</strong> Use Tab para navegar pelos controles, Enter/Espaço para ativar</p>
            <p><strong>Imagens:</strong> Texto alternativo deve descrever o conteúdo e contexto</p>
            <p><strong>Áudio:</strong> Forneça transcrições para usuários surdos ou com deficiência auditiva</p>
            <p><strong>Legendas:</strong> Devem ser sincronizadas e incluir descrições de sons importantes</p>
            <p><strong>Iframes:</strong> Sempre inclua título descritivo e aria-label para conteúdo embarcado</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccessibleMedia;
