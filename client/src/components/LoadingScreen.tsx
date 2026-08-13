import { Loader } from "lucide-react";

type LoadingScreenTypes = {
   text: string;
};

function LoadingScreen({ text }: LoadingScreenTypes) {
  return (
    <div className="w-screen h-screen bg-[#090909] text-white flex flex-col items-center justify-center z-1200 absolute left-0 top-0 gap-5">
      <Loader className="animate-spin [animation-duration:1.4s] w-8 h-8" />
      <h1 className="text-2xl">{text}</h1>
    </div>
  )
}

export default LoadingScreen;