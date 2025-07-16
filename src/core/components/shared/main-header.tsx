import SignInButton from '@/core/components/auth/signin-button';

const MainHeader = async () => {
  return (
    <div className="flex flex-row items-center justify-between p-4 bg-card xl:rounded-br-4xl xl:rounded-bl-4xl">
      <div className="logo flex flex-row items-center"></div>
      <div className="toolbar flex flex-row items-center">
        <SignInButton />
      </div>
    </div>
  );
};

export default MainHeader;
