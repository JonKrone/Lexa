import { useEffect } from 'react'
import { useLocation } from 'wouter'

export const NotFound: React.FC = () => {
  const [location, setLocation] = useLocation()

  useEffect(() => {
    setLocation('/home')
  }, [location, setLocation])

  return <div>404</div>
}
