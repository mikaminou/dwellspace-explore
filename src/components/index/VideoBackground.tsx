import React, { useState, useEffect, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { supabase } from '@/integrations/supabase/client';

export const VideoBackground: React.FC = () => {
  const { t } = useLanguage();
  const VIDEO_BUCKET = "herosection";
  const VIDEO_PATH = "hero.mp4";
  const FALLBACK_SIGNED_URL = "https://kaebtzbmtozoqvsdojkl.supabase.co/storage/v1/object/sign/herosection/hero.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJoZXJvc2VjdGlvbi9oZXJvLm1wNCIsImlhdCI6MTc0MTg5MTQyMCwiZXhwIjoxNzczNDI3NDIwfQ.ocQCcfFXgHHMW8do_xssp2P5csUFT-efMRtqqw_L1_M";
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const { data, error } = await supabase.storage
          .from(VIDEO_BUCKET)
          .createSignedUrl(VIDEO_PATH, 60 * 60); // 1 hour expiration

        if (error) throw error;
        if (data) {
          setVideoUrl(data.signedUrl);
          setIsVideoLoading(false);
        } else {
          throw new Error('No signed URL returned');
        }
      } catch (error) {
        console.error("Error fetching video URL:", error);
        setVideoError(true);
        setShowAlert(true);
        setIsVideoLoading(false);
        setVideoUrl(FALLBACK_SIGNED_URL);
      }
    };

    fetchVideoUrl();
  }, []);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  const handleVideoError = () => {
    setVideoError(true);
    setShowAlert(true);
  };

  return (
    <>
      {showAlert && (
        <Alert variant="destructive" className="mb-4 mx-4">
          <AlertTitle>Video File Missing</AlertTitle>
          <AlertDescription>
            The hero video ({VIDEO_PATH}) needs to be uploaded to the "{VIDEO_BUCKET}" bucket in Supabase Storage.
            A static image is being shown as a fallback.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="absolute inset-0 overflow-hidden z-0">
        {!videoError ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-cover opacity-30"
            autoPlay
            muted
            loop
            playsInline
            poster={FALLBACK_SIGNED_URL}
            preload="auto"
            onError={handleVideoError}
            onLoadedData={() => setIsVideoLoading(false)}
          >
            {videoUrl && <source src={videoUrl} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={FALLBACK_SIGNED_URL}
            alt={t('hero.title')} 
            className="object-cover w-full h-full opacity-20"
          />
        )}
        
        {isVideoLoading && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <p className="text-white">Loading video...</p>
          </div>
        )}
      </div>
    </>
  );
};