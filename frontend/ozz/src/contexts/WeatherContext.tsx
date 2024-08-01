'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface Location {
  latitude: number
  longitude: number
}

interface DailyWeather {
  dayOfWeek: string
  date: Date
  minTemp: number
  maxTemp: number
  description: string
  humidity: number
  icon: string
  season: string
}

interface WeatherContextType {
  weather: DailyWeather[] | null
  setWeather: (weather: DailyWeather[]) => void
  selectedWeather: DailyWeather | null
  setSelectedWeather: (weather: DailyWeather) => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export const WeatherProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Location>({
    latitude: 37.5665, // 서울의 위도
    longitude: 126.978, // 서울의 경도
  })
  const [weather, setWeather] = useState<DailyWeather[] | null>(null)
  const [selectedWeather, setSelectedWeather] = useState<DailyWeather | null>(
    null,
  )

  const getLocation = async (): Promise<Location> => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.')
    }

    return new Promise<Location>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
      )
    })
  }

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        const currentPosition = await getLocation()
        setLocation(currentPosition)

        if (
          currentPosition.latitude !== null &&
          currentPosition.longitude !== null
        ) {
          const response = await fetch(
            `/api/weather?lat=${currentPosition.latitude}&lon=${currentPosition.longitude}`,
            { cache: 'force-cache' },
          )

          if (!response.ok) {
            throw new Error('Failed to fetch weather data')
          }

          const weatherData = await response.json()
          const formattedWeatherData = weatherData.map((day: any) => ({
            ...day,
            date: new Date(day.date),
          }))
          setWeather(formattedWeatherData)
          setSelectedWeather(formattedWeatherData[0])
        }
      } catch (err: any) {
        console.error(err.message)
      }
    }

    fetchLocationAndWeather()
  }, [])

  return (
    <WeatherContext.Provider
      value={{ weather, setWeather, selectedWeather, setSelectedWeather }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}
