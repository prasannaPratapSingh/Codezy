import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useRef } from 'react'
import { ScrollTrigger } from "gsap/ScrollTrigger" // Import ScrollTrigger


const logoarray = [
    {
        "imageUrl": "/company_logos/behance.png",
        "alt": "Behance logo"
    },
    {
        "imageUrl": "/company_logos/firebase.png",
        "alt": "Firebase logo"
    },

    {
        "imageUrl": "/company_logos/google.png",
        "alt": "Google logo"
    },
    {
        "imageUrl": "/company_logos/linkedin.png",
        "alt": "LinkedIn logo"
    }
]

gsap.registerPlugin(ScrollTrigger);


const CompanySection = () => {
    const headanime = useRef()
    useGSAP(() => {
        gsap.from(headanime.current, {
            y: -50,
            opacity: 0,
            delay: 2.25,
            duration: 0.75
        })
    })
    const subheadanime = useRef()
    useGSAP(() => {
        gsap.from(subheadanime.current, {
            scrollTrigger:{
                trigger:subheadanime.current,
                start:"top 100%",
                end:"bottom 80%",
                // markers:true,
                scrub:true
            },
            y: 50,
            opacity: 0,
            filter:"blur(5px)",
            delay: 0.25,
            duration: 0.5
        })
    })
    const logoanime = useRef([])
    useGSAP(() => {
        gsap.from(logoanime.current.children, {
            scrollTrigger:{
                trigger:logoanime.current,
                start:"top 80%",
                end:"bottom 70%",
                scrub:true,
            },
            filter:"blur(5px)",
            opacity: 0,
            delay: 1,
            duration: 1,
            stagger: 0.25
        })
    })

    return (
        <>
            <h2 ref={headanime} className='text-2xl sm:text-5xl font-bold max-w-6xl mx-auto text-center mt-10 sm:mt-20 sm:mb-2 '>ACE YOUR TECHNICAL INTERVIEWS</h2>
            <h1 ref={subheadanime} className='sm:text-xl text-center italic font-light'>Get Hired by Top Tech Companies</h1>
            <div ref={logoanime} className="flex max-w-xl sm:max-w-4xl mx-auto justify-between pt-2 pl-10 pr-10 mt-5 pb-20">
                {logoarray.map((dets, index) => (
                    <img src={dets.imageUrl}
                        key={dets.imageUrl}
                        alt={dets.alt}
                        className='w-10 sm:w-15 hover:cursor-pointer hover:scale-90 transition-transform duration-300 ease-in-out sm:mt-5' />
                ))}
            </div>
        </>
    )
}

export default CompanySection
