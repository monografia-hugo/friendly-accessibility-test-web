import { useState, useRef, useCallback, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';

interface Subtitle {
  text: string;
  start: number;
  end: number;
}

export const useAutoSubtitles = () => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const transcriber = useRef<any>(null);

  // Initialize the Whisper model
  useEffect(() => {
    const initTranscriber = async () => {
      try {
        transcriber.current = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en',
          { device: 'webgpu' }
        );
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize transcriber:', error);
        // Fallback to CPU if WebGPU fails
        try {
          transcriber.current = await pipeline(
            'automatic-speech-recognition',
            'onnx-community/whisper-tiny.en'
          );
          setIsReady(true);
        } catch (fallbackError) {
          console.error('Failed to initialize transcriber with CPU fallback:', fallbackError);
        }
      }
    };

    initTranscriber();
  }, []);

  const generateSubtitles = useCallback(async (videoElement: HTMLVideoElement) => {
    if (!transcriber.current || !isReady) {
      console.warn('Transcriber not ready');
      return;
    }

    setIsGenerating(true);
    setSubtitles([]);

    try {
      // Create audio context to extract audio from video
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(videoElement);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // For this demo, we'll transcribe the entire video when it loads
      // In a real implementation, you might want to transcribe in chunks
      const audioUrl = videoElement.currentSrc;
      
      if (audioUrl) {
        const result = await transcriber.current(audioUrl);
        
        // Create subtitle segments (simplified - in reality you'd need timing info)
        const text = result.text || '';
        const words = text.split(' ');
        const duration = videoElement.duration || 30;
        const wordsPerSecond = words.length / duration;
        
        const generatedSubtitles: Subtitle[] = [];
        let currentTime = 0;
        
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ');
          const start = currentTime;
          const end = currentTime + (5 / wordsPerSecond);
          
          generatedSubtitles.push({
            text: chunk,
            start,
            end
          });
          
          currentTime = end;
        }
        
        setSubtitles(generatedSubtitles);
      }
    } catch (error) {
      console.error('Failed to generate subtitles:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [isReady]);

  const updateCurrentSubtitle = useCallback((currentTime: number) => {
    const current = subtitles.find(
      subtitle => currentTime >= subtitle.start && currentTime <= subtitle.end
    );
    setCurrentSubtitle(current?.text || '');
  }, [subtitles]);

  return {
    subtitles,
    currentSubtitle,
    isGenerating,
    isReady,
    generateSubtitles,
    updateCurrentSubtitle
  };
};