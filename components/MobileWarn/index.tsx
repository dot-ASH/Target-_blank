const MobileWarn = () => {
  return (
    <div className="absolute flex lg:hidden top-[50%] left-[50%] translate-x-[-50%] w-[70%] translate-y-[-50%] z-[1000]">
      <div className="rounded-lg p-[2rem] bg-[#fefae0]">
        <h1>This site is not optimised for mobile view</h1>
      </div>
    </div>
  );
};

export default MobileWarn;
