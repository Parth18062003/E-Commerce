import Image from "next/image";

const Loading = () => {
  return (
    <div>
      <CutoutTextLoader
        height="100vh"
        background="rgba(0, 0, 0, 0.5)" // Optional: Adds a semi-transparent overlay
        imgUrl="https://res.cloudinary.com/dvl7demzb/image/upload/v1733170440/ezgif-5-77250cce93_lgr9cc.gif"
      />
    </div>
  );
};

const CutoutTextLoader = ({
  height,
  background,
  imgUrl,
}: {
  height: string;
  background: string;
  imgUrl: string;
}) => {
  return (
    <div className="relative" style={{ height }}>
      <Image
        src={imgUrl}
        fill
        alt="Loading..."
        sizes="50vw"
        className="absolute inset-0 z-0"
      />
      <div style={{ background }} className="absolute inset-0 z-10" />
      <span
        className="font-black absolute inset-0 z-20 text-center bg-clip-text text- pointer-events-none"
        style={{
          backgroundPosition: "center",
          fontSize: "clamp(3rem, 12vw, 10rem)",
          lineHeight: height,
        }}
      >
        Loading...
      </span>
    </div>
  );
};

export default Loading;
