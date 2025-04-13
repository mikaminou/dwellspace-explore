import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useVideoLoader(bucket: string, path: string) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    async function loadVideo() {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 3600); // 1 hour expiration

        if (error) {
          throw error;
        }

        if (data?.signedUrl) {
          setVideoUrl(data.signedUrl);
        } else {
          setVideoError(true);
          setShowAlert(true);
        }
      } catch (error) {
        console.error('Error loading video:', error);
        setVideoError(true);
        setShowAlert(true);
      } finally {
        setIsVideoLoading(false);
      }
    }

    loadVideo();
  }, [bucket, path]);

  return { videoUrl, videoError, isVideoLoading, showAlert };
}