import React, { useEffect, useRef } from 'react';
import { useAutoSubtitles } from '../hooks/useAutoSubtitles';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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

  const handleGenerateSubtitles = () => {
    if (videoRef.current && isReady) {
      generateSubtitles(videoRef.current);
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

      {currentSubtitle && (
        <div className="bg-black/80 text-white p-2 rounded text-center text-sm">
          {currentSubtitle}
        </div>
      )}
    </div>
  );
};

export default AutoSubtitles;