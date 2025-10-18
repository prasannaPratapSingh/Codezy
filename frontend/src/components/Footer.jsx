
const Footer = () => {

    return (
        <>
            <footer className="border-t-1 max-w-screen mx-auto flex justify-evenly sm:py-20 py-10">
                <div className='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer text-white'>Codezy</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer text-white'>Challenges</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Tutorials</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Practice</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Competitions</li>
                        <li className='hover:cursor-pointer text-white'>Overview</li>
                    </ul>
                </div>
                <div className='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer text-white'>Community</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer text-white'>Discussions</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Blog</li>
                        {/* ✅ Fixed: added 'cursor' */}
                        <li className='mb-1 hover:cursor-pointer text-white'>Leaderboard</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Events</li>
                        <li className='hover:cursor-pointer text-white'>Mentorship</li>
                    </ul>
                </div>
                <div className='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer text-white'>Support</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer text-white'>Help Center</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>FAQ</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Contact Us</li>
                        <li className='mb-1 hover:cursor-pointer text-white'>Report Issue</li>
                    </ul>
                </div>
            </footer>
            <div className="bottom border-t-1 py-5 flex flex-col items-center gap-2">
                <div>
                    <p className="text-[200px] font-bold bg-gradient-to-t from-black to-white bg-clip-text text-transparent sm:block hidden">CODEZY</p>
                </div>
                <p className='font-semibold text-white'>&copy; 2025 Codezy. All rights reserved</p>
                <div className='flex gap-2'>
                    <p className='text-white>Made With</p>
                    <span className='hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out'>☕</span>
                    <span className='text-white'>&</span>
                    <span className='hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out'>❣️</span>
                </div>
            </div>
        </>
    )
}


export default Footer

