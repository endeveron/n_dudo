'use client';

import { useEffect, useState } from 'react';

import AnimatedAppear from '@/core/components/shared/animated-appear';
import './fireworks.css';

type FireworksProps = {
  active?: boolean;
  iterations?: number;
  children: React.ReactNode;
  colors?: [string, string]; // gradient: center, mid, edge
  duration?: number;
};

const Fireworks = ({
  active = false,
  children,
  colors = ['#efda9d', '#d7095f'],
  duration = 5000,
}: FireworksProps) => {
  const [isActive, setIsActive] = useState(false);
  const [color1, color2] = colors;

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
              '--c1': color1,
              '--c2': color2,
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
