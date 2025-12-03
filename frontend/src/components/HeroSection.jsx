import { useRef } from "react"
import TestiCard from "./TestiCard"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"


const testimonials = [
  {
    "title": "50K+ Problems Created",
    "icon": "Plus"
  },
  {
    "title": "200K+ Lines Coded",
    "icon": "Code"
  },
  {
    "title": "95% User Growth",
    "icon": "Trophy"
  }
]

function HeroSection() {

  const titleanim = useRef()
  useGSAP(() => {
    gsap.from(titleanim.current, {
      opacity: 0,
      delay: 0.25,
      duration: 1
    })
  })

  const titleanimesecond = useRef()
  useGSAP(() => {
    gsap.from(titleanimesecond.current, {
      opacity: 0,
      delay: 0.25,
      duration: 1
    })
  })
  const heroclip = useRef()
  useGSAP(() => {
    gsap.from(heroclip.current, {
      opacity: 0,
      scale: 1.2,
      y: 50,
      delay: 0.25,
      duration: 0.75,
    })
  })
  const content = useRef()
  useGSAP(() => {
    gsap.from(content.current, {
      y: 50,
      delay: 1,
      duration: 0.5,
      opacity: 0
    })
  })
  const contenttwo = useRef()
  useGSAP(() => {
    gsap.from(contenttwo.current, {
      y: 50,
      delay: 1.25,
      duration: 0.5,
      opacity: 0
    })
  })
  const contentthird = useRef()
  useGSAP(() => {
    gsap.from(contentthird.current, {
      y: 50,
      delay: 1.5,
      duration: 0.5,
      opacity: 0
    })
  })
  const testanime = useRef()
  useGSAP(() => {
    gsap.from(testanime.current.children, {
      opacity: 0,
      stagger: 0.2,
      delay: 1,
      duration: 1.75,
      filter: "blur(5px)" 
    })
  })

  return (
    <>
      <div className="max-w-6xl relative mx-auto mt-10 sm:mt-15 flex flex-col justify-center p-5 items-center">
        <div ref={heroclip}>
          <span className="max-w-xl bg-white text-black px-2 py-1 rounded-3xl shadow-sm text-sm shadow-white hover:scale-90 hover:cursor-pointer transition-transform duration-300 ease-in-out font-medium">
            Create Problems with AI 🤖
          </span>
        </div>
        <div className="mt-5 flex flex-col items-center leading-tight">
          <div ref={titleanim} >
            <span className=" text-5xl sm:text-8xl text-white">
              Craft Your
            </span>
          </div>
          <div ref={titleanimesecond} className="mt-4">
            <span className=" text-xl sm:text-4xl font-medium text-white">
              Own Coding Challenges
            </span>
          </div>
          <div className="max-w-2xl mt-5 text-base sm:text-lg flex flex-col items-center leading-relaxed text-zinc-200">
            <p ref={content} className="text-center px-5 sm:px-20">Move beyond a standard problem library by describing exactly what you need.</p>
            <p ref={contenttwo} className="mt-1 text-center">Just provide the topic and desired difficulty.</p>
            <span ref={contentthird}>We generate it instantly.</span>
          </div>
        </div>
        <div ref={testanime} className="flex flex-col sm:flex-row gap-10 mt-10 sm:mt-20">
          {testimonials.map((info) => {
            return <TestiCard info={info} key={info.title} />
          })}
        </div>
      </div>
    </>
  )
}

export default HeroSection



