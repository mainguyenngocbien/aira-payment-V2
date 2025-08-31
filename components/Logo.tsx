import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',    // Tăng từ w-8 h-8 lên w-16 h-16
    md: 'w-32 h-32',    // Tăng từ w-16 h-16 lên w-32 h-32
    lg: 'w-48 h-48'     // Tăng từ w-24 h-24 lên w-48 h-48
  };

  const imageSizes = {
    sm: 64,
    md: 128,
    lg: 192
  };

  return (
    <Image 
      src="/logo.png" 
      alt="AIRA Payment Logo" 
      width={imageSizes[size]}
      height={imageSizes[size]}
      className={`${sizeClasses[size]} object-contain ${className}`}
      priority
    />
  );
}
