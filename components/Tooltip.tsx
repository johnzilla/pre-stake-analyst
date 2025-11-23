import React from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'bottom', 
  align = 'center',
  className = '' 
}) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2'
  };

  const alignClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  };

  const arrowClasses = {
    top: 'top-full border-t-slate-800 border-b-transparent',
    bottom: 'bottom-full border-b-slate-800 border-t-transparent'
  };

  const arrowAlignClasses = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4'
  };

  return (
    <div className={`group relative flex items-center gap-1 cursor-help w-fit ${className}`}>
      {children}
      <div className={`absolute ${positionClasses[position]} ${alignClasses[align]} w-48 p-3 bg-slate-800 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none whitespace-normal`}>
        <div className="relative z-10 leading-relaxed text-center">
          {content}
        </div>
        {/* Arrow */}
        <div className={`absolute ${arrowClasses[position]} ${arrowAlignClasses[align]} border-8 border-x-transparent`} />
      </div>
    </div>
  );
};

export default Tooltip;