import { LoadingScreenIcon } from "../assets/svgs";

type LoadingScreenTypes = {
   text: string;
};

function LoadingScreen({ text }: LoadingScreenTypes) {
  return (
    <div className="w-screen h-screen bg-[#151515] text-white flex flex-col items-center justify-center z-1200 absolute left-0 top-0 gap-5">
      <LoadingScreenIcon />
      <h1 className="text-2xl">{text}</h1>
    </div>
  )
}

export default LoadingScreen;