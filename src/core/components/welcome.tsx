'use client';

import SignInButton from '@/core/components/auth/sign-in-button';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import BackgroundImage from '@/core/components/shared/background-image';

const WelcomeClient = () => {
  return (
    <div className="relative h-dvh flex flex-1 flex-col flex-center bg-main-image-background">
      <BackgroundImage />

      <div className="py-8 relative flex-center flex-1 flex-col cursor-default z-20">
        {/* Title */}
        <AnimatedAppear>
          <h1 className="text-6xl text-accent font-black">Welcome!</h1>
        </AnimatedAppear>

        {/* Signin Button */}
        <AnimatedAppear className="flex-center mt-12" delay={400}>
          <SignInButton variant="accent" title="Sign In" className="w-40" />
        </AnimatedAppear>
      </div>
    </div>
  );
};

export default WelcomeClient;
