import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const FreAQ = () => {
    return (
        <div className='max-w-5xl mx-auto flex flex-col gap-5 items-center mb-10'>
            <h1 className ='text-3xl sm:text-5xl font-bold mx-auto text-center p-5 bg-gradient-to-b black from-white bg-clip-text text-transparent'>FAQ's Section</h1>
            <div className="sm:mx-auto w-full max-w-lg divide-y divide-white/5 rounded-xl bg-white/5 bg-red-900 m-10">
                <Disclosure as="div" className="p-6" defaultOpen={true} >
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                            What makes CODEZY different from other coding platforms?
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                        CODEZY uses AI to generate unlimited, unique coding problems on-demand. Instead of solving the same problems as everyone else, you get custom problems based on your chosen topic and difficulty level. This means endless practice material tailored just for you.
                    </DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="p-6">
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                            How do I generate a coding problem?
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">Select a topic and difficulty level, then click "Generate Problem." Our AI creates a unique problem in seconds. If you don't like it, regenerate to get a different one on the same topic.</DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="p-6">
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                            Can I see the solution if I'm stuck?
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">Yes. After attempting a problem, you can view the detailed solution with code of the approach, time complexity, and optimizations. This helps you learn and improve.</DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="p-6">
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                            How can I track my progress?
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">Your CODEZY dashboard shows all solved problems, attempts, success rate, and performance metrics. You can filter by topic or difficulty to see where you're excelling and where you need more practice.</DisclosurePanel>
                </Disclosure>
                <Disclosure as="div" className="p-6">
                    <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80">
                            What languages does CODEZY support?
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel className="mt-2 text-sm/5 text-white/50">CODEZY currently supports JavaScript, Java, and C++. As we continue to grow and upgrade our platform, we'll be adding more languages based on user demand. Stay tuned for updates!</DisclosurePanel>
                </Disclosure>
            </div>
        </div>
    )
}

export default FreAQ


