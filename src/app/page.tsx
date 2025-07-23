import Image from "next/image";
import Introduction from "@/components/layout/introduction";
import LightRays from "@/components/background/lightRise";
import Orb from "@/components/background/orb";
import Navbar from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
      <LightRays />
      {/* <Orb/> */}

      <Navbar />
      <Introduction />
    </>
  );
}
