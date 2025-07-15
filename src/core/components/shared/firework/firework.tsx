'use client';

import { useEffect, useState } from 'react';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import './firework.css';

type FireworksProps = {
  active?: boolean;
  iterations?: number;
  children: React.ReactNode;
  color?: string;
  duration?: number;
};

const Fireworks = ({
  active = false,
  children,
  color = '#ff2056',
  duration = 10,
}: FireworksProps) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (active) {
      setIsActive(true);

      setTimeout(() => {
        setIsActive(false);
      }, duration * 1000);
    }
  }, [active, duration]);

  return (
    <div className="fireworks">
      {children}

      <AnimatedAppear isShown={isActive}>
        <div
          className="explosion"
          style={
            {
              '--color': color,
            } as React.CSSProperties
          }
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div className="pw" key={i}>
              <span className="p" />
            </div>
          ))}
        </div>
      </AnimatedAppear>
    </div>
  );
};

export default Fireworks;
