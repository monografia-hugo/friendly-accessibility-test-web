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
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Initialize the Whisper model
  useEffect(() => {
    const initTranscriber = async () => {
      try {
        transcriber.current = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en'
        );
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize transcriber:', error);
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
      // Clean up any existing audio context
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }

      // Create new audio context for recording (separate from playback)
      audioContextRef.current = new AudioContext();
      
      // Get media stream from video element without affecting playback
      const stream = (videoElement as any).captureStream ? 
        (videoElement as any).captureStream() : 
        (videoElement as any).mozCaptureStream();
      
      if (!stream) {
        throw new Error('Cannot capture stream from video element');
      }

      // Record audio chunks
      const audioChunks: Blob[] = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Transcribe the recorded audio
          const result = await transcriber.current(audioUrl);
          
          // Clean up
          URL.revokeObjectURL(audioUrl);
          
          // Create subtitle segments (simplified timing)
          const text = result.text || '';
          if (text.trim()) {
            const words = text.split(' ');
            const duration = videoElement.duration || 30;
            const wordsPerSegment = 5;
            const segmentDuration = duration / Math.ceil(words.length / wordsPerSegment);
            
            const generatedSubtitles: Subtitle[] = [];
            
            for (let i = 0; i < words.length; i += wordsPerSegment) {
              const chunk = words.slice(i, i + wordsPerSegment).join(' ');
              const start = (i / wordsPerSegment) * segmentDuration;
              const end = start + segmentDuration;
              
              generatedSubtitles.push({
                text: chunk,
                start,
                end: Math.min(end, duration)
              });
            }
            
            setSubtitles(generatedSubtitles);
          }
        } catch (error) {
          console.error('Failed to process recorded audio:', error);
        } finally {
          setIsGenerating(false);
        }
      };

      // Start recording for a short duration (10 seconds max for demo)
      mediaRecorderRef.current.start();
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, Math.min(10000, (videoElement.duration || 10) * 1000));

    } catch (error) {
      console.error('Failed to generate subtitles:', error);
      setIsGenerating(false);
    }
  }, [isReady]);

  const updateCurrentSubtitle = useCallback((currentTime: number) => {
    const current = subtitles.find(
      subtitle => currentTime >= subtitle.start && currentTime <= subtitle.end
    );
    setCurrentSubtitle(current?.text || '');
  }, [subtitles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    subtitles,
    currentSubtitle,
    isGenerating,
    isReady,
    generateSubtitles,
    updateCurrentSubtitle
  };
};