
import Image from "next/image";
import Introduction from "@/components/layout/introduction";
import LightRays from "@/components/background/lightRise";
import Orb from "@/components/background/orb";
import Navbar from "@/components/layout/navbar";
import Galaxy from "@/components/background/galaxy";
import Services from "@/components/layout/service";
import Product from "@/components/layout/product";
// import { Globe } from "@/components/ui/globe";
import Quote from "@/components/layout/quote";
import FAQ from "@/components/layout/faq";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      {/* <Globe /> */}
      <LightRays
        raysOrigin='top-center'
        raysColor='##aaaaff'
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className='custom-rays'
      />
      {/* <Orb/> */}
      {/* <Galaxy /> */}

      <Navbar />
      <Introduction />
      <Services />
      <Product />
<Quote/>
<FAQ/>
<Footer/>
    </>
  );
}
