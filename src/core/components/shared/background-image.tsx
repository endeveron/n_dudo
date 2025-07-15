'use client';

import Image from 'next/image';

import AnimatedAppear from '@/core/components/shared/animated-appear';

const BackgroundImage = () => {
  return (
    <AnimatedAppear className="absolute inset-0">
      <Image
        src="/images/bg.jpg"
        alt="background"
        className="object-cover opacity-50 dark:opacity-40"
        fill
        priority
        quality={100}
      />
    </AnimatedAppear>
  );
};

export default BackgroundImage;
