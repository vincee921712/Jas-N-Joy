import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Crop, Move } from 'lucide-react';

/**
 * GalleryPhotoCropper
 * 
 * True mobile gallery photo cropper:
 * - Shows the full picture on a dark backdrop
 * - Users can drag the 4 corner handles and 4 edge handles to resize the crop box from ANY side
 * - Users can also drag the crop box itself to reposition it
 * - Users can zoom in/out the photo
 * - Crops via HTML5 canvas and outputs the cropped dataUrl
 */
export default function GalleryPhotoCropper({ 
  imageUrl, 
  onSaveCroppedImage, 
  onClose,
  title = "Crop & Frame Photo"
}) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Natural image dimensions and rendered image rect within container
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgLayout, setImgLayout] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Crop box rect relative to container (px)
  const [cropBox, setCropBox] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Zoom scale of the image
  const [zoom, setZoom] = useState(1);

  // Active interaction: null | 'move-box' | 'handle-tl' | 'handle-tr' | 'handle-bl' | 'handle-br' | 'handle-t' | 'handle-b' | 'handle-l' | 'handle-r'
  const [dragMode, setDragMode] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0, cropBox: null });

  // Compute image layout inside container
  const computeLayout = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const naturalW = imgRef.current.naturalWidth;
    const naturalH = imgRef.current.naturalHeight;
    if (!naturalW || !naturalH) return;

    // Available space in container with 24px padding
    const maxW = container.width - 48;
    const maxH = container.height - 48;

    const imgAspect = naturalW / naturalH;
    let renderedW = maxW;
    let renderedH = renderedW / imgAspect;

    if (renderedH > maxH) {
      renderedH = maxH;
      renderedW = renderedH * imgAspect;
    }

    // Apply zoom
    renderedW *= zoom;
    renderedH *= zoom;

    const left = (container.width - renderedW) / 2;
    const top = (container.height - renderedH) / 2;

    const layout = { left, top, width: renderedW, height: renderedH };
    setImgLayout(layout);

    return layout;
  }, [zoom]);

  // Initial load: compute layout and initialize crop box over 85% of image
  const handleImageLoad = () => {
    setImageLoaded(true);
    setTimeout(() => {
      const layout = computeLayout();
      if (layout) {
        // Initialize crop box nicely centered on the image
        const boxW = Math.round(layout.width * 0.85);
        const boxH = Math.round(layout.height * 0.85);
        const boxLeft = Math.round(layout.left + (layout.width - boxW) / 2);
        const boxTop = Math.round(layout.top + (layout.height - boxH) / 2);
        setCropBox({ left: boxLeft, top: boxTop, width: boxW, height: boxH });
      }
    }, 50);
  };

  useEffect(() => {
    if (imageLoaded) {
      computeLayout();
    }
  }, [zoom, imageLoaded, computeLayout]);

  useEffect(() => {
    const handleResize = () => computeLayout();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeLayout]);

  // Pointer down on handles or crop box
  const startDrag = (mode, e) => {
    e.stopPropagation();
    e.preventDefault();
    setDragMode(mode);
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      cropBox: { ...cropBox }
    };
  };

  // Pointer move to adjust sides/corners or move the whole box
  const handlePointerMove = useCallback((e) => {
    if (!dragMode || !containerRef.current) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;
    const orig = dragStartRef.current.cropBox;

    const minSize = 40; // minimum width/height for crop box

    let newLeft = orig.left;
    let newTop = orig.top;
    let newWidth = orig.width;
    let newHeight = orig.height;

    // Bounds constraint: can crop inside container
    const cWidth = containerRef.current.clientWidth;
    const cHeight = containerRef.current.clientHeight;

    if (dragMode === 'move-box') {
      newLeft = Math.max(0, Math.min(orig.left + dx, cWidth - orig.width));
      newTop = Math.max(0, Math.min(orig.top + dy, cHeight - orig.height));
    } else {
      // Adjust edges/corners
      if (dragMode.includes('l')) {
        const proposedLeft = orig.left + dx;
        const maxLeft = orig.left + orig.width - minSize;
        newLeft = Math.max(0, Math.min(proposedLeft, maxLeft));
        newWidth = orig.width - (newLeft - orig.left);
      }
      if (dragMode.includes('r')) {
        const proposedWidth = orig.width + dx;
        newWidth = Math.max(minSize, Math.min(proposedWidth, cWidth - orig.left));
      }
      if (dragMode.includes('t')) {
        const proposedTop = orig.top + dy;
        const maxTop = orig.top + orig.height - minSize;
        newTop = Math.max(0, Math.min(proposedTop, maxTop));
        newHeight = orig.height - (newTop - orig.top);
      }
      if (dragMode.includes('b')) {
        const proposedHeight = orig.height + dy;
        newHeight = Math.max(minSize, Math.min(proposedHeight, cHeight - orig.top));
      }
    }

    setCropBox({
      left: Math.round(newLeft),
      top: Math.round(newTop),
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    });
  }, [dragMode]);

  const handlePointerUp = () => {
    setDragMode(null);
  };

  useEffect(() => {
    if (dragMode) {
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
  }, [dragMode, handlePointerMove]);

  // Crop & Export
  const handleApplyCrop = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;

    // Calculate crop box relative to the rendered image
    const relX = cropBox.left - imgLayout.left;
    const relY = cropBox.top - imgLayout.top;

    // Scale factors to map rendered pixels back to full natural image resolution
    const scaleX = img.naturalWidth / imgLayout.width;
    const scaleY = img.naturalHeight / imgLayout.height;

    const sourceX = Math.max(0, relX * scaleX);
    const sourceY = Math.max(0, relY * scaleY);
    const sourceW = Math.min(img.naturalWidth - sourceX, cropBox.width * scaleX);
    const sourceH = Math.min(img.naturalHeight - sourceY, cropBox.height * scaleY);

    if (sourceW <= 0 || sourceH <= 0) return;

    // Offscreen Canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(sourceW);
    canvas.height = Math.round(sourceH);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSaveCroppedImage(croppedDataUrl);
  };

  const handleReset = () => {
    setZoom(1);
    if (imgLayout.width > 0) {
      const boxW = Math.round(imgLayout.width * 0.85);
      const boxH = Math.round(imgLayout.height * 0.85);
      const boxLeft = Math.round(imgLayout.left + (imgLayout.width - boxW) / 2);
      const boxTop = Math.round(imgLayout.top + (imgLayout.height - boxH) / 2);
      setCropBox({ left: boxLeft, top: boxTop, width: boxW, height: boxH });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-sm select-none">
      <div className="bg-[#1C1917] text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[96vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-800 flex items-center justify-between">
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

        {/* Full Image + Adjustable Crop Window */}
        <div 
          ref={containerRef}
          className="relative w-full h-[380px] sm:h-[460px] bg-[#12100E] overflow-hidden flex items-center justify-center"
        >
          {/* Instructions Pill */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-stone-300">
            <Move className="w-3 h-3 text-amber-400" />
            <span>Drag any side or corner to adjust grid • Drag inside to reposition</span>
          </div>

          {/* Full Image */}
          <img 
            ref={imgRef}
            src={imageUrl} 
            alt="To crop" 
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
            draggable={false}
            style={{
              position: 'absolute',
              left: `${imgLayout.left}px`,
              top: `${imgLayout.top}px`,
              width: `${imgLayout.width}px`,
              height: `${imgLayout.height}px`,
              maxWidth: 'none',
              maxHeight: 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Dimmed Curtain outside Crop Box */}
          {cropBox.width > 0 && (
            <div 
              style={{
                position: 'absolute',
                left: `${cropBox.left}px`,
                top: `${cropBox.top}px`,
                width: `${cropBox.width}px`,
                height: `${cropBox.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)'
              }}
              onPointerDown={(e) => startDrag('move-box', e)}
              className="cursor-move border-2 border-white/90 z-20"
            >
              {/* Rule-of-Thirds Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
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

              {/* 4 CORNER HANDLES (Thick L-shaped notches like phone gallery) */}
              {/* Top-Left */}
              <div 
                onPointerDown={(e) => startDrag('tl', e)}
                className="absolute -top-3 -left-3 w-7 h-7 cursor-nwse-resize z-30 flex items-start justify-start p-1"
              >
                <div className="w-5 h-5 border-t-4 border-l-4 border-white shadow-xs" />
              </div>

              {/* Top-Right */}
              <div 
                onPointerDown={(e) => startDrag('tr', e)}
                className="absolute -top-3 -right-3 w-7 h-7 cursor-nesw-resize z-30 flex items-start justify-end p-1"
              >
                <div className="w-5 h-5 border-t-4 border-r-4 border-white shadow-xs" />
              </div>

              {/* Bottom-Left */}
              <div 
                onPointerDown={(e) => startDrag('bl', e)}
                className="absolute -bottom-3 -left-3 w-7 h-7 cursor-nesw-resize z-30 flex items-end justify-start p-1"
              >
                <div className="w-5 h-5 border-b-4 border-l-4 border-white shadow-xs" />
              </div>

              {/* Bottom-Right */}
              <div 
                onPointerDown={(e) => startDrag('br', e)}
                className="absolute -bottom-3 -right-3 w-7 h-7 cursor-nwse-resize z-30 flex items-end justify-end p-1"
              >
                <div className="w-5 h-5 border-b-4 border-r-4 border-white shadow-xs" />
              </div>

              {/* 4 EDGE HANDLES (Center bar notches for adjusting each side individually) */}
              {/* Top Side */}
              <div 
                onPointerDown={(e) => startDrag('t', e)}
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-6 cursor-ns-resize z-30 flex items-center justify-center"
              >
                <div className="w-8 h-1.5 bg-white rounded-full shadow-xs" />
              </div>

              {/* Bottom Side */}
              <div 
                onPointerDown={(e) => startDrag('b', e)}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-6 cursor-ns-resize z-30 flex items-center justify-center"
              >
                <div className="w-8 h-1.5 bg-white rounded-full shadow-xs" />
              </div>

              {/* Left Side */}
              <div 
                onPointerDown={(e) => startDrag('l', e)}
                className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-14 cursor-ew-resize z-30 flex items-center justify-center"
              >
                <div className="w-1.5 h-8 bg-white rounded-full shadow-xs" />
              </div>

              {/* Right Side */}
              <div 
                onPointerDown={(e) => startDrag('r', e)}
                className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-14 cursor-ew-resize z-30 flex items-center justify-center"
              >
                <div className="w-1.5 h-8 bg-white rounded-full shadow-xs" />
              </div>

            </div>
          )}
        </div>

        {/* Toolbar & Controls */}
        <div className="p-4 bg-[#1C1917] border-t border-stone-800 space-y-3">
          <div className="flex items-center justify-between gap-4">
            
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <button
                type="button"
                onClick={() => setZoom(z => Math.max(0.7, Math.round((z - 0.1) * 100) / 100))}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input 
                type="range" 
                min="0.7" 
                max="2.5" 
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={() => setZoom(z => Math.min(2.5, Math.round((z + 0.1) * 100) / 100))}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs font-semibold text-amber-400 bg-stone-800 px-2 py-1 rounded w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Reset */}
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
              Drag corners & edges to adjust framing
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
                onClick={handleApplyCrop}
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
