import { Plus, Code, Trophy } from 'lucide-react'


const iconMap = {
  Plus: Plus,
  Code: Code,
  Trophy: Trophy
}


function TestiCard({ info }) {
  const IconComponent = iconMap[info.icon] // Capital letter is important

  return (
    <div className='max-w-xl p-5 rounded-2xl bg-blue-900 text-white font-medium hover:cursor-pointer hover:scale-95 transition-transform duration-300 ease-in-out'
      style={{
        background: "radial-gradient(125% 125% at 50% 10%, #000 40%, #010133 100%)",
      }}>
      <div>
        {IconComponent && <IconComponent size={24} />}
      </div>
      <h1>
        {info.title}
      </h1>
    </div>
  )
}

export default TestiCard