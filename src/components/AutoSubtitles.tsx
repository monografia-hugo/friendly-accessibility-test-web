import React, { useEffect, useRef } from 'react';
import { useAutoSubtitles } from '../hooks/useAutoSubtitles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface AutoSubtitlesProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
}

const AutoSubtitles: React.FC<AutoSubtitlesProps> = ({ videoRef, enabled }) => {
  const {
    currentSubtitle,
    isGenerating,
    isReady,
    generateSubtitles,
    updateCurrentSubtitle
  } = useAutoSubtitles();
  
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (enabled && videoRef.current) {
      const video = videoRef.current;
      
      // Start tracking video time for subtitle updates
      const trackTime = () => {
        updateCurrentSubtitle(video.currentTime);
      };

      intervalRef.current = setInterval(trackTime, 100);
      video.addEventListener('timeupdate', trackTime);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        video.removeEventListener('timeupdate', trackTime);
      };
    }
  }, [enabled, videoRef, updateCurrentSubtitle]);

  const handleGenerateSubtitles = async () => {
    if (videoRef.current && isReady) {
      // Pause video during generation to avoid audio conflicts
      const wasPlaying = !videoRef.current.paused;
      if (wasPlaying) {
        videoRef.current.pause();
      }
      
      await generateSubtitles(videoRef.current);
      
      // Resume playback if it was playing before
      if (wasPlaying) {
        videoRef.current.play();
      }
    }
  };

  if (!enabled) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleGenerateSubtitles}
          disabled={!isReady || isGenerating}
          variant="outline"
        >
          {isGenerating ? 'Generating...' : 'Generate Subtitles'}
        </Button>
        
        {!isReady && (
          <Badge variant="secondary">Loading AI Model...</Badge>
        )}
        
        {isGenerating && (
          <Badge variant="secondary">Processing Audio...</Badge>
        )}
      </div>

      {!isReady && (
        <Alert>
          <AlertDescription>
            Loading Whisper AI model for subtitle generation. This may take a moment...
          </AlertDescription>
        </Alert>
      )}

      {currentSubtitle && (
        <div className="bg-black/80 text-white p-2 rounded text-center text-sm">
          {currentSubtitle}
        </div>
      )}
    </div>
  );
};

export default AutoSubtitles;