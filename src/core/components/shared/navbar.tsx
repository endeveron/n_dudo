'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import SignOutButton from '@/core/components/auth/sign-out-btn';
import AnimatedAppear from '@/core/components/shared/animated-appear';
import NavbarItem from '@/core/components/shared/navbar-item';
import { useLangCode } from '@/core/context/lang-context';
import { NavbarItem as TNavbarItem } from '@/core/types/common';
import { getNavbarTranslation } from '@/core/utils/dictionary';
import DashboardIcon from '~/public/icons/navbar/apps.svg';

const navbarItems: TNavbarItem[] = [
  // {
  //   id: 'home',
  //   path: '/',
  //   icon: <HomeIcon />,
  // },
];

const Navbar = () => {
  const { langCode } = useLangCode();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [translationMap, setTranslationMap] = useState<Map<string, string>>();
  const [isPending, setIsPending] = useState(false);

  const handleItemClick = (path?: string) => {
    if (!path) return;
    router.push(path);
  };

  const handleLogout = () => {
    setIsPending(true);
  };

  useEffect(() => {
    const initData = async () => {
      // Get translation
      const translation = await getNavbarTranslation(langCode);
      if (!translation) {
        toast(`Unable to load localized data for navbar`);
        return;
      }
      const map = new Map(translation.itemMap);
      setTranslationMap(map);
    };

    initData();
  }, [langCode]);

  // Add the dashboard item
  useEffect(() => {
    if (status === 'loading') return;

    const isAdmin = session?.user?.role === 'admin';
    const itemId = isAdmin ? 'admin' : 'dashboard';

    const exists = navbarItems.some((item) => item.id === itemId);
    if (exists) return;

    navbarItems.push({
      id: itemId,
      path: `/${itemId}`,
      icon: <DashboardIcon />,
    });
  }, [session, status]);

  if (status === 'loading') return <div className="h-16"></div>;

  return (
    <AnimatedAppear
      delay={1000}
      className="h-14 mb-2 pt-2 pb-1 px-10 mx-auto flex items-center justify-evenly gap-10 bg-card rounded-full"
    >
      {navbarItems.map((data) => (
        <NavbarItem
          onClick={handleItemClick}
          {...data}
          title={translationMap?.get(data.id) ?? data.id}
          pathname={pathname}
          key={data.id}
        />
      ))}
      <NavbarItem
        id="logout"
        icon={<SignOutButton />}
        onClick={handleLogout}
        isPending={isPending}
        title={translationMap?.get('logout') ?? 'Logout'}
        key="logout"
      />
    </AnimatedAppear>
  );
};

export default Navbar;
