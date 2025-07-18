'use client';

import Image from 'next/image';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import { useState } from 'react';
import { cn } from '@/core/utils/common';

const imgPlaceholder =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYGBgYHBwYJCgkKCQ0MCwsMDRQODw4PDhQfExYTExYTHxshGxkbIRsxJiIiJjE4Ly0vOEQ9PURWUVZwcJYBBgYGBgYGBgcHBgkKCQoJDQwLCwwNFA4PDg8OFB8TFhMTFhMfGyEbGRshGzEmIiImMTgvLS84RD09RFZRVnBwlv/CABEIAAYACgMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAADBv/aAAgBAQAAAACXX//EABUBAQEAAAAAAAAAAAAAAAAAAAIF/9oACAECEAAAAIS//8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/2gAIAQMQAAAApX//xAAfEAACAgEEAwAAAAAAAAAAAAACAwESBAAFBiFSVNL/2gAIAQEAAT8AxMrE2RLmgzKTKVsMYQRRFjmvmPU170HPAoFp3OZr7jPrX//EABwRAQACAQUAAAAAAAAAAAAAAAEAAhEDFDFSkv/aAAgBAgEBPwC5fUuDYc85CbN7V8k//8QAGxEAAgIDAQAAAAAAAAAAAAAAAQIAAxESISL/2gAIAQMBAT8AqRXGtaAd5kwlgT5Wf//Z';

const BackgroundImage = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <AnimatedAppear className="absolute inset-0">
      <div className="relative h-full">
        <Image
          src="/images/bg.jpg"
          alt="background"
          className="z-10 object-cover opacity-85 dark:opacity-80"
          fill
          priority
          quality={100}
          placeholder="blur"
          blurDataURL={imgPlaceholder}
          onLoad={() => setIsImageLoaded(true)}
        />
        <div
          className={cn(
            'opacity-0 absolute inset-0 bg-main-image-background transition-opacity',
            isImageLoaded && 'opacity-100'
          )}
        />
      </div>
    </AnimatedAppear>
  );
};

export default BackgroundImage;
