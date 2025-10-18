
const Footer = () => {

    return (
        <>
            <footer className="border-t-1 max-w-screen mx-auto flex justify-evenly sm:py-20 py-10">
                <div classname='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer'>Codezy</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer '>Challenges</li>
                        <li className='mb-1 hover:cursor-pointer'>Tutorials</li>
                        <li className='mb-1 hover:cursor-pointer'>Practice</li>
                        <li className='mb-1 hover:cursor-pointer'>Competitions</li>
                        <li className='hover:cursor-pointer'>Overview</li>
                    </ul>
                </div>
                <div classname='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer'>Community</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer'>Discussions</li>
                        <li className='mb-1 hover:cursor-pointer'>Blog</li>
                        {/* ✅ Fixed: added 'cursor' */}
                        <li className='mb-1 hover:cursor-pointer'>Leaderboard</li>
                        <li className='mb-1 hover:cursor-pointer'>Events</li>
                        <li className='hover:cursor-pointer'>Mentorship</li>
                    </ul>
                </div>
                <div classname='text-white'>
                    <h1 className='text-xl font-medium mb-4 hover:cursor-pointer'>Support</h1>
                    <ul className='font-light'>
                        <li className='mb-1 hover:cursor-pointer'>Help Center</li>
                        <li className='mb-1 hover:cursor-pointer'>FAQ</li>
                        <li className='mb-1 hover:cursor-pointer'>Contact Us</li>
                        <li className='mb-1 hover:cursor-pointer'>Report Issue</li>
                    </ul>
                </div>
            </footer>
            <div className="bottom border-t-1 py-5 flex flex-col items-center gap-2">
                <div>
                    <p className="text-[200px] font-bold bg-gradient-to-t from-black to-white bg-clip-text text-transparent sm:block hidden">CODEZY</p>
                </div>
                <p className='font-semibold text-white'>&copy; 2025 Codezy. All rights reserved</p>
                <div className='flex gap-2'>
                    <p classname='text-white'>Made With</p>
                    <span className='hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out'>☕</span>
                    <span>&</span>
                    <span className='hover:cursor-pointer hover:scale-125 transition-transform duration-300 ease-in-out'>❣️</span>
                </div>
            </div>
        </>
    )
}


export default Footer
