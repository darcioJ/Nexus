import { Activity } from 'lucide-react';
import { inputBaseClass } from '../../config/vault.config'; // Ajuste o path

interface NexusSignalVisorProps {
  register: any;
  fieldName: string;
  value: string; // O valor real (ID ou string consolidada)
  displayValue?: string; // O nome amigável para mostrar (opcional)
  placeholder?: string;
  required?: string;
  maxSlots?: number; // Quantidade de traços no gauge (padrão 2)
  accentColor?: string; // Cor para o LED e Gauge
}

export const NexusSignalVisor = ({
  register,
  fieldName,
  value,
  displayValue,
  placeholder = "Aguardando indexação...",
  required = "Campo obrigatório",
  maxSlots = 2,
  accentColor = "#3b82f6"
}: NexusSignalVisorProps) => {
  
  // Calcula quantos slots preencher com base no valor (separado por ' e ')
  const activeCount = value ? value.split(' e ').filter(Boolean).length : 0;
  // Se não houver displayValue, usa o value bruto
  const textToShow = displayValue || value;

  return (
    <div className="relative group overflow-hidden rounded-[2rem]">
      {/* ÍCONE DE ATIVIDADE COM VARREDURA */}
      <div className={`
        absolute left-5 top-1/2 -translate-y-1/2 z-10 transition-colors duration-500
        ${value ? 'text-blue-500' : 'text-slate-300'}
      `}>
        <Activity 
          size={16} 
          strokeWidth={2.5} 
          className={value ? 'animate-pulse' : ''} 
          style={{ color: value ? accentColor : undefined }}
        />
      </div>

      {/* VISOR DE TEXTO (Apenas Leitura) */}
      <input
        value={textToShow}
        readOnly
        placeholder={placeholder}
        className={`
          ${inputBaseClass} !pl-14 !pr-24 !py-5 !rounded-[2rem] text-[11px] font-bold italic
          !bg-white/60 border-white shadow-inner cursor-default transition-all duration-500
          ${value ? 'text-slate-700' : 'text-slate-300'}
        `}
      />

      {/* REGISTRO TÉCNICO (Oculto para o React Hook Form) */}
      <input type="hidden" {...register(fieldName, { required })} />

      {/* GAUGE DE SLOTS: HARDWARE FEEDBACK */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5">
        <span className="text-[6px] font-black text-slate-300 uppercase tracking-widest">
          {activeCount > 0 ? 'Signal_Active' : 'Waiting_Input'}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: maxSlots }).map((_, i) => {
            const isActive = i < activeCount || (maxSlots === 1 && value);
            return (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-700 ${isActive ? 'shadow-[0_0_8px]' : 'bg-slate-100'}`}
                style={{ 
                  width: maxSlots === 1 ? '1.5rem' : '1rem',
                  backgroundColor: isActive ? accentColor : undefined,
                  color: accentColor // Para a variável do shadow
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};