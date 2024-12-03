import React from "react";

type CTAProps = {
  mainHeading: string;
  topdescription?: string;
  bottomdescription?: string;
  buttonText: string;
};

const CTA: React.FC<CTAProps> = ({
  mainHeading,
  topdescription,
  bottomdescription,
  buttonText,
}) => {
  return (
    <div className="relative flex items-center justify-center py-12 text-zinc-800">
      <div className="text-left lg:text-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Main CTA Text */}
        <p className="text-lg sm:text-xl md:text-2xl mb-2">{topdescription}</p>
        <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-8xl mb-2 leading-tight uppercase">
          {mainHeading}
        </h1>

        {/* Description Text */}
        <p className="text-lg sm:text-xl md:text-2xl mb-6">
          {bottomdescription}
        </p>

        {/* CTA Button */}
        <button className="bg-indigo-500 text-white py-3 px-6 rounded-full text-lg hover:bg-indigo-600 transition duration-300">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CTA;
