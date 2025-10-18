import CompanySection from '../components/CompanySection'
import HeroSection from '../components/HeroSection'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useRef } from 'react'
import { ScrollTrigger } from "gsap/ScrollTrigger" // Import ScrollTrigger
import FreAQ from '../components/FreAQ'


gsap.registerPlugin(ScrollTrigger);

function ActualHome() {
  return (
    <div className='min-h-screen relative overflow-clip'
      style={{
        background: "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
      }}>
      <Navbar />

      <HeroSection />
      <CompanySection />
      <FreAQ/>
      <Footer/>
      {/* <div ref={testscroll} className='w-50 h-50 bg-red-500 testbox mb-150' ></div> */}
    </div>
  )
}

export default ActualHome
