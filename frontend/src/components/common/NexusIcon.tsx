import * as LucideIcons from 'lucide-react';

interface NexusIconProps {
  name: string;
  size?: number;
  className?: string;
  fill?: string;
  strokeWidth?: number;
}

export const NexusIcon = ({ name, size = 16, className, fill, strokeWidth = 2 }: NexusIconProps) => {
  const IconComponent = (LucideIcons as any)[name];

  // Agrupamos as props básicas
  const iconProps = {
    size,
    className,
    strokeWidth,
    ...(fill && { fill }) // O segredo: só injeta o 'fill' se ele existir
  };

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...iconProps} />;
  }

  return <IconComponent {...iconProps} />;
};