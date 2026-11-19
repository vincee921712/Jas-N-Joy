import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Crop, Move } from 'lucide-react';

/**
 * GalleryPhotoCropper
 * 
 * Works like a mobile gallery/Instagram/WhatsApp photo cropper:
 * - Shows the full picture on a dark backdrop
 * - Displays a movable/scalable white crop frame (with authentic corner/edge notches like the user's screenshot)
 * - Or lets user drag and zoom the image with smooth mouse/touch dragging
 * - Produces a cropped dataURL via an offscreen HTML5 canvas so the exact cropped frame is saved!
 */
export default function GalleryPhotoCropper({ 
  imageUrl, 
  aspectRatio = 4 / 5, // width / height (matches our card aspect ratio)
  onSaveCroppedImage, 
  onClose,
  title = "Crop & Frame Photo"
}) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 }); // offset in px relative to crop frame
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgNaturalDim, setImgNaturalDim] = useState({ width: 0, height: 0 });

  // Frame dimension inside dialog (calculated based on container size and desired aspect ratio)
  const [frameDim, setFrameDim] = useState({ width: 280, height: 350 });

  // Calculate crop window size based on container and aspect ratio
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxW = Math.min(rect.width * 0.85, 340);
      const maxH = Math.min(rect.height * 0.85, 420);

      let targetW = maxW;
      let targetH = targetW / aspectRatio;

      if (targetH > maxH) {
        targetH = maxH;
        targetW = targetH * aspectRatio;
      }

      setFrameDim({ width: Math.round(targetW), height: Math.round(targetH) });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [aspectRatio]);

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgNaturalDim({ width: naturalWidth, height: naturalHeight });
    setImageLoaded(true);
  };

  // Mouse / Touch Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    dragStartRef.current = { x: clientX, y: clientY };
    positionStartRef.current = { ...position };
  };

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    setPosition({
      x: positionStartRef.current.x + dx,
      y: positionStartRef.current.y + dy
    });
  }, [isDragging]);

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove]);

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setScale(prev => Math.min(3.5, Math.max(0.6, Math.round((prev + delta) * 100) / 100)));
  };

  // Generate cropped output via Canvas
  const handleCropAndSave = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    // Output resolution: 800px width x corresponding height for crisp quality
    const outWidth = 800;
    const outHeight = Math.round(outWidth / aspectRatio);
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext('2d');

    // Get current rendered bounds of the image element relative to viewport
    const imgRect = img.getBoundingClientRect();
    
    // Get crop frame bounds
    const frameEl = document.getElementById('gallery-crop-frame');
    if (!frameEl) return;
    const frameRect = frameEl.getBoundingClientRect();

    // Relationship between rendered pixels and natural image pixels
    const renderScaleX = img.naturalWidth / imgRect.width;
    const renderScaleY = img.naturalHeight / imgRect.height;

    // Source rect inside the natural image corresponding to the crop frame
    const sx = (frameRect.left - imgRect.left) * renderScaleX;
    const sy = (frameRect.top - imgRect.top) * renderScaleY;
    const sWidth = frameRect.width * renderScaleX;
    const sHeight = frameRect.height * renderScaleY;

    // Draw to canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outWidth, outHeight);
    
    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      outWidth,
      outHeight
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSaveCroppedImage(croppedDataUrl);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm select-none">
      <div className="bg-[#1C1917] text-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-stone-100">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport & Full Photo Workspace */}
        <div 
          ref={containerRef}
          onWheel={handleWheel}
          className="relative w-full h-[380px] sm:h-[440px] bg-[#12100E] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
        >
          {/* Instructions Overlay */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-stone-300">
            <Move className="w-3 h-3 text-amber-400" />
            <span>Drag photo to position • Pinch / scroll to zoom</span>
          </div>

          {/* Full Image being cropped (visible in full, with crop frame on top) */}
          <div 
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            className="shrink-0 flex items-center justify-center"
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Crop target" 
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
              draggable={false}
              className="max-w-[400px] max-h-[400px] sm:max-w-[460px] sm:max-h-[460px] object-contain pointer-events-none"
            />
          </div>

          {/* Semi-transparent dark curtain outside the crop frame (like phone gallery crop) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* The Cutout Crop Frame */}
            <div 
              id="gallery-crop-frame"
              style={{
                width: `${frameDim.width}px`,
                height: `${frameDim.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
              }}
              className="relative border-2 border-white pointer-events-none rounded-sm"
            >
              {/* Authentic Gallery Crop Corner & Notch Markers (as in user screenshot) */}
              {/* Top-Left Corner */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white" />
              {/* Top-Right Corner */}
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white" />
              {/* Bottom-Left Corner */}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white" />
              {/* Bottom-Right Corner */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white" />

              {/* Edge center notch ticks */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white" />
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-8 bg-white" />
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-8 bg-white" />

              {/* Subtle Rule-of-Thirds Grid inside crop area */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-4 bg-[#1C1917] border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <button
                type="button"
                onClick={() => setScale(s => Math.max(0.6, Math.round((s - 0.1) * 100) / 100))}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input 
                type="range" 
                min="0.6" 
                max="3.0" 
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setScale(s => Math.min(3.0, Math.round((s + 0.1) * 100) / 100))}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-semibold text-amber-400 bg-stone-800 px-2 py-1 rounded w-12 text-center">
                {Math.round(scale * 100)}%
              </span>
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">
              Crop box fits storefront card display ratio
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropAndSave}
                className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-amber-200" />
                <span>Apply Crop</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
