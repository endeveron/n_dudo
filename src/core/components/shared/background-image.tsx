'use client';

import Image from 'next/image';

import AnimatedAppear from '@/core/components/shared/animated-appear';

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
      />
    </AnimatedAppear>
  );
};

export default BackgroundImage;
