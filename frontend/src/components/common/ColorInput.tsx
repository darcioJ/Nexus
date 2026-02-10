import { Pipette } from 'lucide-react';
import { inputBaseClass } from '../../config/vault.config';

export const ColorInput = ({ register, watch, setValue, name }: any) => {
  // Cor padrão do Nexus caso esteja vazio
  const currentColor = watch(name) || "#6366f1";

  // Lógica para aplicar a cor no preview (suporta Hex e var)
  const renderColor = currentColor.startsWith('var')
    ? `var${currentColor.match(/\(([^)]+)\)/)?.[0]}`
    : currentColor;

  return (
    <div className="flex items-center gap-3 group/color w-full">
      <div className="relative flex-1 group">

        {/* 1. INPUT DE TEXTO (HEX/VAR) */}
        <input
          {...register(name)}
          className={`${inputBaseClass} pl-16 pr-12`}
          placeholder="var(--color-...) ou #HEX"
        />

        {/* 2. GEMA PRISMÁTICA (PREVIEW & COLOR PICKER) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center">
          {/* Efeito de Aura: Brilho que emana da cor selecionada */}
          <div
            className="absolute inset-0 rounded-xl opacity-20 blur-md transition-all duration-500 group-focus-within:opacity-40 animate-pulse"
            style={{ backgroundColor: renderColor }}
          />

          <div className="relative w-9 h-9 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white/80 backdrop-blur-sm transition-transform active:scale-90 duration-300 ring-1 ring-black/5 pointer-events-auto">
            <input
              type="color"
              value={currentColor.startsWith('var') ? "#6366f1" : currentColor}
              onChange={(e) => setValue(name, e.target.value)}
              className="absolute inset-0 w-[200%] h-[200%] cursor-pointer border-none bg-transparent -translate-x-1/4 -translate-y-1/4 opacity-0 z-20"
            />

            {/* Camada Visual de Cor (O preenchimento da gema) */}
            <div
              className="absolute inset-1 rounded-lg transition-colors duration-500 z-10"
              style={{ backgroundColor: renderColor }}
            />

            {/* Brilho de Superfície (Efeito de Vidro) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/60 z-11 pointer-events-none" />
          </div>
        </div>

        {/* 3. ÍCONE DE AUXÍLIO (DIREITA) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
          <Pipette size={14} strokeWidth={3} />
        </div>

        {/* 4. BARRA DE REFLEXO (ESTÉTICA) */}
        <div className="absolute left-16 right-16 bottom-2 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};