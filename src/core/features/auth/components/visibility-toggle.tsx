'use client';

import { useState } from 'react';

import Eye from '~/public/icons/auth/eye.svg';
import EyeSlash from '~/public/icons/auth/eye-slash.svg';

type TVisibilityToggleProps = {
  onClick: () => void;
};

const VisibilityToggle = ({ onClick }: TVisibilityToggleProps) => {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible((prev) => !prev);
    onClick();
  };

  return <div onClick={handleClick}>{visible ? <EyeSlash /> : <Eye />}</div>;
};

export default VisibilityToggle;
