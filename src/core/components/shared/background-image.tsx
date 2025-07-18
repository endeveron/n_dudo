'use client';

import Image from 'next/image';

import AnimatedAppear from '@/core/components/shared/animated-appear';

const imgPlaceholder =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYGBgYHBwYJCgkKCQ0MCwsMDRQODw4PDhQfExYTExYTHxshGxkbIRsxJiIiJjE4Ly0vOEQ9PURWUVZwcJYBBgYGBgYGBgcHBgkKCQoJDQwLCwwNFA4PDg8OFB8TFhMTFhMfGyEbGRshGzEmIiImMTgvLS84RD09RFZRVnBwlv/CABEIAAYACgMBEQACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAADBv/aAAgBAQAAAACXX//EABUBAQEAAAAAAAAAAAAAAAAAAAIF/9oACAECEAAAAIS//8QAFQEBAQAAAAAAAAAAAAAAAAAAAAb/2gAIAQMQAAAApX//xAAfEAACAgEEAwAAAAAAAAAAAAACAwESBAAFBiFSVNL/2gAIAQEAAT8AxMrE2RLmgzKTKVsMYQRRFjmvmPU170HPAoFp3OZr7jPrX//EABwRAQACAQUAAAAAAAAAAAAAAAEAAhEDFDFSkv/aAAgBAgEBPwC5fUuDYc85CbN7V8k//8QAGxEAAgIDAQAAAAAAAAAAAAAAAQIAAxESISL/2gAIAQMBAT8AqRXGtaAd5kwlgT5Wf//Z';

const BackgroundImage = () => {
  return (
    <AnimatedAppear className="absolute inset-0 bg-main-image-background">
      <Image
        src="/images/bg.jpg"
        alt="background"
        className="object-cover opacity-85 dark:opacity-80"
        fill
        priority
        quality={100}
        placeholder="blur"
        blurDataURL={imgPlaceholder}
      />
    </AnimatedAppear>
  );
};

export default BackgroundImage;
