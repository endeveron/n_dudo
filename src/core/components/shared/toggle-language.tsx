'use client';

import { Button } from '@/core/components/ui/button';
import { useLangCode } from '@/core/context/lang';

const ToggleLanguage = () => {
  const { langCode, toggleLangCode } = useLangCode();

  return (
    <div className="">
      <Button variant="secondary" size="sm" onClick={toggleLangCode}>
        {langCode === 'en' ? 'Українська' : 'English'}
      </Button>
    </div>
  );
};

export default ToggleLanguage;
