import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Welcome to Lexa</h2>
      <p className="text-gray-600">Start expanding your vocabulary today!</p>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Today's Progress
        </h3>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Words Learned:</span>
            <span className="font-medium text-green-600">12</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Streak:</span>
            <span className="font-medium text-blue-600">5 days</span>
          </li>
        </ul>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
        Start Learning
      </button>
    </div>
  )
}

export default Home
