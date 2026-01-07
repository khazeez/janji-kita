
import Introduction from "@/components/layout/introduction";
import LightRays from '@/components/background/lightRise';
import Navbar from "@/components/layout/navbar";
import Product from "@/components/layout/product";
import FAQ from "@/components/layout/faq";
import Footer from "@/components/layout/footer";
import Steps from "@/components/layout/Steps"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"


export default function Home() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
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
      <Navbar />
      <Introduction />
      <Steps/>
      <Product />
      <FAQ />
      <Footer />
    </>
  );
}
