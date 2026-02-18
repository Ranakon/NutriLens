
import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCcw, Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorType, setErrorType] = useState<'permission' | 'notfound' | 'other' | null>(null);

  const startCamera = async (isRetry = false) => {
    setErrorType(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: isRetry ? 'user' : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorType('permission');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        if (!isRetry) startCamera(true);
        else setErrorType('notfound');
      } else {
        setErrorType('other');
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        onCapture(canvas.toDataURL('image/jpeg', 0.9));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (errorType) {
    return (
      <div className="glass-panel p-10 rounded-[3.5rem] text-center border border-white/10 space-y-8 animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
          <AlertCircle className="text-red-500 w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white leading-tight tracking-tight">Camera Restricted</h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
            The neural link to your camera was interrupted. You can still use the database by uploading a photo.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <button onClick={() => fileInputRef.current?.click()} className="w-full h-16 bg-emerald-500 text-white rounded-3xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
            <ImageIcon className="w-5 h-5" /> Browse Library
          </button>
          <button onClick={() => startCamera()} className="w-full h-14 bg-white/5 text-white rounded-3xl font-bold active:scale-95 transition-all flex items-center justify-center gap-3">
            <RefreshCcw className="w-4 h-4" /> Reset Stream
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-[4rem] overflow-hidden shadow-2xl aspect-[3/4] border-[6px] border-white/5 group">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover brightness-[1.1] contrast-[1.1]" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Neural HUD Overlay */}
      <div className="absolute inset-0 p-12 pointer-events-none">
        <div className="h-full w-full border border-white/10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-[4px] border-l-[4px] border-emerald-500 rounded-tl-3xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-[4px] border-r-[4px] border-emerald-500 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-[4px] border-l-[4px] border-emerald-500 rounded-bl-3xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-[4px] border-r-[4px] border-emerald-500 rounded-br-3xl"></div>
          
          {/* Moving Scan Beam */}
          <div className="animate-scan" />
        </div>
      </div>

      <div className="absolute top-10 inset-x-0 flex justify-center">
        <div className="px-5 py-2 glass-panel rounded-full flex items-center gap-3 border border-white/10">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
           <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Recognition Active</span>
        </div>
      </div>

      {/* Control Dock */}
      <div className="absolute bottom-0 inset-x-0 p-12 pt-16 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-center justify-between">
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-16 h-16 glass-panel rounded-[1.8rem] flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/10"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        <button onClick={captureImage} className="w-28 h-28 bg-white p-1 rounded-full shadow-2xl active:scale-95 transition-all relative">
          <div className="w-full h-full border-[5px] border-slate-950 rounded-full flex items-center justify-center p-1.5">
            <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center shadow-inner">
              <Camera className="text-white w-10 h-10" />
            </div>
          </div>
          <div className="absolute -inset-2 border border-emerald-500/30 rounded-full animate-ping opacity-20 pointer-events-none"></div>
        </button>

        <div className="w-16 h-16 flex items-center justify-center">
           <Zap className="w-6 h-6 text-white/20" />
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
    </div>
  );
};

export default CameraCapture;
