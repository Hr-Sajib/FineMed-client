const Branding = () => {
  return (
    <section className="bg-[url('/images/medic.jpg')] bg-fixed w-full lg:h-80 h-[22vh] bg-no-repeat bg-center bg-cover px-4 text-center shadow-md mb-20 relative">
      <div className="bg-gradient-to-tr from-[#4fd1c57a] to-[#000000d4] w-full h-full absolute left-0"></div>
      <div className="container mx-auto">
        <div className="relative top-2 md:top-20">
          <h1 className="text-4xl font-bold text-teal-200 mb-3">finemed</h1>
          <p className="text-lg text-white mb-6">
            Your trusted online pharmacy for genuine medicines, health products,
            and wellness care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white px-4 py-2 rounded-full border text-sm text-teal-600 shadow">
              24/7 Support
            </span>
            <span className="bg-white px-4 py-2 rounded-full border text-sm text-teal-600 shadow">
              100% Genuine Products
            </span>
            <span className="bg-white px-4 py-2 rounded-full border text-sm text-teal-600 shadow">
              Fast Delivery
            </span>
          </div>
        </div>
      </div>
    </section>


  );
};

export default Branding;
