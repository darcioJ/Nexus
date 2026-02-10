import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import { motion } from 'framer-motion';
import { Check, X, ZoomIn, Scan, Maximize } from 'lucide-react';
import { getCroppedImg } from '../../utils/getCroppedImage';
import { triggerHaptic } from '../../utils/triggerHaptic';

interface ImageCropperModalProps {
    imageSrc: string;
    onCancel: () => void;
    onComplete: (croppedBase64: string) => void;
}

export const ImageCropperModal = ({ imageSrc, onCancel, onComplete }: ImageCropperModalProps) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        triggerHaptic("MEDIUM");

        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onComplete(croppedImage);
        } catch (e) {
            console.error("Erro ao cortar imagem:", e);
            triggerHaptic("HEAVY");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-0 md:p-6"
        >
            {/* CONTAINER PRINCIPAL: ESTILO CRYSTAL CARD */}
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full h-full md:h-auto md:max-w-xl bg-white/5 border-y md:border-2 border-white/20 md:rounded-[3.5rem] overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]"
            >
                {/* 1. SCANLINE & TEXTURA DE FUNDO */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <motion.div 
                    animate={{ y: ["0%", "100%", "0%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1/2 bg-linear-to-b from-step-identity/10 to-transparent pointer-events-none z-10"
                />

                {/* HEADER: PROTOCOLO DE SINCRONIA */}
                <div className="relative z-20 flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-step-identity/20 flex items-center justify-center text-step-identity border border-step-identity/30">
                            <Scan size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-step-identity/60 leading-none mb-1">Neural_Link_Active</span>
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">Ajuste Biométrico</h3>
                        </div>
                    </div>
                    <button 
                        onClick={onCancel} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ÁREA DO CROPPER COM CANTONEIRAS */}
                <div className="relative flex-1 min-h-[350px] md:min-h-[400px] bg-black/20 group">
                    {/* Cantoneiras de Foco Hardware */}
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-step-identity/40 rounded-tl-xl z-20" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-step-identity/40 rounded-tr-xl z-20" />
                    <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-step-identity/40 rounded-bl-xl z-20" />
                    <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-step-identity/40 rounded-br-xl z-20" />

                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={3 / 4}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        showGrid={false}
                        objectFit="contain"
                        classes={{
                            containerClassName: "bg-transparent",
                            mediaClassName: "opacity-90",
                            cropAreaClassName: "border-2 border-step-identity shadow-[0_0_20px_rgba(16,185,129,0.3)] !rounded-3xl"
                        }}
                    />
                </div>

                {/* CONTROLES MOBILE-OPTIMIZED (THUMB-ZONE) */}
                <div className="relative z-20 p-8 flex flex-col gap-8 bg-linear-to-t from-slate-950 to-transparent">
                    
                    {/* Slider de Zoom Customizado */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Magnification_Level</span>
                            <span className="text-[10px] font-mono text-step-identity">x{zoom.toFixed(1)}</span>
                        </div>
                        <div className="relative flex items-center group">
                            <ZoomIn size={14} className="absolute left-3 text-step-identity/50 group-hover:text-step-identity transition-colors" />
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.01}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl appearance-none cursor-pointer px-10 accent-step-identity"
                            />
                            <Maximize size={14} className="absolute right-3 text-step-identity/50 group-hover:text-step-identity transition-colors" />
                        </div>
                    </div>

                    {/* Ações Finais */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 px-6 border border-white/10 rounded-2xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/5 transition-all"
                        >
                            Abortar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="flex-[2] relative group overflow-hidden py-4 px-6 bg-step-identity rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check size={18} className="text-white" />
                                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Sincronizar</span>
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Footer: Nexus Metadata */}
                    <div className="flex justify-center pt-2">
                        <span className="text-[6px] font-mono text-white/20 uppercase tracking-[0.6em]">
                            Protocol_Ref: IMAGE_STABILIZATION_v2.26
                        </span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};