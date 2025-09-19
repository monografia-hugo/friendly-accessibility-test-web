import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Square,
  Settings,
  Eye,
  MousePointer,
  Keyboard,
  X,
  Accessibility
} from 'lucide-react';
// We'll use fetch API for ElevenLabs instead of the client library

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  isOpen,
  onToggle
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSetup, setIsSetup] = useState(false);

  // Accessibility states
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focusIndicator, setFocusIndicator] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize API key from environment variable or storage
  useEffect(() => {
    // First check environment variable
    const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (envApiKey && envApiKey !== 'your_elevenlabs_api_key_here') {
      setApiKey(envApiKey);
      setIsSetup(true);
    } else {
      // Fallback to localStorage
      const storedApiKey = localStorage.getItem('elevenlabs_api_key');
      if (storedApiKey) {
        setApiKey(storedApiKey);
        setIsSetup(true);
      }
    }
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (largeText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '';
    }

    if (reduceMotion) {
      root.style.setProperty('--transition-smooth', 'none');
    } else {
      root.style.removeProperty('--transition-smooth');
    }

    if (focusIndicator) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }
  }, [highContrast, largeText, reduceMotion, focusIndicator]);

  const setupApiKey = () => {
    // Get API key from environment variable
    const key = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (key && key !== 'your_elevenlabs_api_key_here') {
      setApiKey(key);
      localStorage.setItem('elevenlabs_api_key', key);
      setIsSetup(true);
    } else {
      // Fallback to prompt if environment variable is not set
      const promptKey = prompt('Please enter your ElevenLabs API key:');
      if (promptKey) {
        setApiKey(promptKey);
        localStorage.setItem('elevenlabs_api_key', promptKey);
        setIsSetup(true);
      }
    }
  };

  const getSelectedTextOrPageContent = () => {
    const selection = window.getSelection()?.toString();
    if (selection && selection.trim()) {
      return selection.trim();
    }

    // Get content from the active AdminPanel section only
    const main = document.querySelector('main');
    if (main) {
      // Look for the active content area within main (this contains the current section)
      const activeContent = main.querySelector('[aria-live="polite"]');
      if (activeContent) {
        // Get the section title first
        const sectionTitle = getCurrentSectionTitle();
        const textContent = activeContent.textContent || '';
        const cleanContent = textContent.replace(/\s+/g, ' ').trim();

        // Return section title + content for better context
        return sectionTitle ? `${sectionTitle}. ${cleanContent}` : cleanContent;
      }

      // Fallback: get main content but exclude navigation elements
      const navigationElements = main.querySelectorAll('nav, header, .sidebar-bg, [role="navigation"]');
      const clonedMain = main.cloneNode(true) as Element;

      // Remove navigation elements from the clone
      navigationElements.forEach(nav => {
        const navClone = clonedMain.querySelector(`[class*="${nav.className}"]`);
        if (navClone) {
          navClone.remove();
        }
      });

      const textContent = clonedMain.textContent || '';
      return textContent.replace(/\s+/g, ' ').trim();
    }

    // Final fallback to body content
    const bodyText = document.body.textContent || '';
    return bodyText.replace(/\s+/g, ' ').trim();
  };

  const getCurrentSectionTitle = () => {
    // Try to find the current section title based on the active navigation
    const activeNavButton = document.querySelector('button[aria-current="page"]');
    if (activeNavButton) {
      const buttonText = activeNavButton.textContent?.trim();
      if (buttonText) {
        // Map button text to section titles
        const sectionTitles: { [key: string]: string } = {
          'Dashboard': 'Seção do Painel Principal',
          'Analytics': 'Seção de Análises',
          'Users': 'Seção de Usuários',
          'Content': 'Seção de Conteúdo',
          'Notifications': 'Seção de Notificações',
          'Settings': 'Seção de Configurações',
          'Painel': 'Seção do Painel Principal',
          'Análises': 'Seção de Análises',
          'Usuários': 'Seção de Usuários',
          'Notificações': 'Seção de Notificações',
          'Configurações': 'Seção de Configurações'
        };
        return sectionTitles[buttonText] || `Seção ${buttonText}`;
      }
    }

    // Fallback: try to find a heading in the main content
    const main = document.querySelector('main');
    if (main) {
      const heading = main.querySelector('h1, h2, h3');
      if (heading) {
        return `Seção: ${heading.textContent?.trim()}`;
      }
    }

    return 'Conteúdo da seção atual';
  };

  const speakText = async (text: string) => {
    if (!apiKey || !text) return;

    try {
      setIsPlaying(true);
      setCurrentText(text);

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setCurrentText('');
          URL.revokeObjectURL(audioUrl);
        };
      }

    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlaying(false);
      alert('Erro ao gerar fala. Verifique sua chave da API e tente novamente.');
    }
  };

  const handlePlayPause = () => {
    if (!isSetup) {
      setupApiKey();
      return;
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const textToRead = getSelectedTextOrPageContent();
      if (textToRead) {
        speakText(textToRead);
      }
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentText('');
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg"
        variant="default"
        aria-label="Abrir barra de ferramentas de acessibilidade"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 p-4 w-80 shadow-xl border">
      <audio ref={audioRef} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          <h3 className="font-semibold">Ferramentas de Acessibilidade</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          aria-label="Fechar barra de ferramentas de acessibilidade"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Voice Reading Section */}
      <div className="mb-4">
        <Label className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4" />
          Leitura por Voz
        </Label>

        {!isSetup && (
          <p className="text-sm text-muted-foreground mb-2">
            Configuração necessária. Clique play para inserir chave da API.
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pausar leitura" : "Começar leitura da aba atual do painel"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={stopSpeaking}
            disabled={!isPlaying}
            aria-label="Parar leitura"
          >
            <Square className="w-4 h-4" />
          </Button>

          {isSetup && (
            <Button
              variant="ghost"
              size="sm"
              onClick={setupApiKey}
              aria-label="Change API key"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>

        {currentText && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            Lendo: {currentText.substring(0, 100)}...
          </p>
        )}
      </div>

      <Separator className="my-4" />

      {/* Visual Accessibility Settings */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Configurações Visuais
        </Label>

        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="text-sm">
            Alto Contraste
          </Label>
          <Switch
            id="high-contrast"
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="large-text" className="text-sm">
            Texto Grande
          </Label>
          <Switch
            id="large-text"
            checked={largeText}
            onCheckedChange={setLargeText}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="text-sm">
            Reduzir Movimento
          </Label>
          <Switch
            id="reduce-motion"
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="focus-indicator" className="text-sm">
            Foco Aprimorado
          </Label>
          <Switch
            id="focus-indicator"
            checked={focusIndicator}
            onCheckedChange={setFocusIndicator}
          />
        </div>
      </div>

      <Separator className="my-4" />

      {/* Quick Actions */}
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Keyboard className="w-4 h-4" />
          Ações Rápidas
        </Label>
        <p className="text-sm text-muted-foreground">
          • Selecione texto específico ou clique play para ler a aba atual<br/>
          • Lê apenas o conteúdo da seção ativa do painel<br/>
          • Use Tab para navegar, Enter/Espaço para ativar<br/>
          • Alt + A para alternar esta barra de ferramentas
        </p>
      </div>
    </Card>
  );
};

export default AccessibilityToolbar;