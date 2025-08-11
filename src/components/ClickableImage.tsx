import React from 'react';
import { ImageModal } from './ImageModal';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ClickableImage: React.FC<ClickableImageProps> = ({ src, alt, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
        onClick={() => setIsModalOpen(true)}
        loading="lazy"
      />
      
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
