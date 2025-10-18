import { NavLink } from "react-router"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

const Navbar = () => {
  const navanime = useRef()
  useGSAP(() => {
    gsap.from(navanime.current, {
      x: -100,
      opacity: 0,
      duration: 1
    })
  })

  const buttonanime = useRef()
  useGSAP(() => {
    gsap.from(buttonanime.current.children, {
      x: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.25
    })
  })

  return (
    <nav className='flex gap-7 justify-between px-7 items-center pt-2 sm:pt-5 sm:gap-2 sm:px-2 font-family-geist sm:justify-around sticky top-0 bg-blue/20 backdrop-blur-xs z-10000'>
      <div ref={navanime} className='text-xl sm:text-3xl font-bold hover:cursor-pointer flex items-center text-white'>
        <NavLink to={'/'}>
          <span>Codezy</span>
        </NavLink>
      </div>
      <div ref={buttonanime} className='flex justify-center items-center'>
        <button className='sm:text-xl p-2 btn bg-transparent border-none shadow-none text-white'>
          <NavLink to={'/login'}>Login</NavLink>
        </button>
        <button className='sm:text-xl p-2 btn bg-transparent border-none shadow-none text-white'>
          <NavLink to={'/signup'}>Signup</NavLink>
        </button>
      </div>
    </nav>
  )
}

export default Navbar


