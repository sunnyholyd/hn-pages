import React, { ReactNode } from 'react';

interface InfoSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function InfoSection({ title, children, className = '' }: InfoSectionProps) {
  return (
    <div className={`p-2 bg-gray-100 rounded ${className}`}>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
} 