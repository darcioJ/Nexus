export const ColorInput = ({ register, watch, setValue, name }: any) => {
  const currentColor = watch(name) || "#6366f1";

  return (
    <div className="flex items-center gap-2 group/color">
      {/* Input de Texto (CSS Var ou Hex) */}
      <div className="relative flex-1">
        <input 
          {...register(name)}
          className="nexus-input-high pl-12"
          placeholder="var(--color-...) ou #000"
        />
        {/* Preview da Cor / Color Picker */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg border border-white/20 shadow-sm overflow-hidden flex items-center justify-center pointer-events-auto">
          <input 
            type="color"
            value={currentColor.startsWith('var') ? "#6366f1" : currentColor}
            onChange={(e) => setValue(name, e.target.value)}
            className="absolute inset-0 w-[150%] h-[150%] cursor-pointer border-none bg-transparent"
            style={{ appearance: 'none' }}
          />
          <div 
            className="w-full h-full pointer-events-none" 
            style={{ backgroundColor: currentColor.startsWith('var') ? `var${currentColor.match(/\(([^)]+)\)/)?.[0]}` : currentColor }} 
          />
        </div>
      </div>
    </div>
  );
};