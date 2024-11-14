const HeaderBanner = () => {
  return (
    <section className="relative w-full h-[20vh] md:h-[20vh] bg-cover bg-center bg-gradient-to-r from-yellow-500 to-orange-600">
      <div className="absolute inset-0 opacity-50"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full text-center text-white px-4">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-3xl lg:text-6xl font-extrabold leading-tight">
            Welcome to QuickHotel
          </h1>
          <p className="text-xl sm:text-2xl md:w-2/3 mx-auto">
            Discover the perfect stay for your next getaway.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeaderBanner;
