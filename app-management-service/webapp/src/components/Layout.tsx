import Navigation from "./Navigation";

export default function Layout({
  children,
  hideNav = false,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  return (
    <div className="flex flex-col w-full h-screen">
      {!hideNav && <Navigation />}
      <div className="max-w-5xl w-full mx-auto mt-24 px-4 pb-16">
        {children}
      </div>
    </div>
  );
}
