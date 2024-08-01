'use client'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { LiaSlashSolid } from 'react-icons/lia'

interface Location {
  latitude: number
  longitude: number
}

interface DailyWeather {
  dayOfWeek: string
  date: string
  minTemp: number
  maxTemp: number
  description: string
  humidity: number
  icon: string
  season: string
}

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

const getDayOfWeekColor = (dayOfWeek: string): string => {
  switch (dayOfWeek) {
    case '토':
      return 'text-blue-500'
    case '일':
      return 'text-red-500'
    default:
      return ''
  }
}

export default function Weather({
  setSelectedDate,
}: {
  setSelectedDate: (date: string) => void
}) {
  const [location, setLocation] = useState<Location>({
    latitude: 37.5665, // 서울의 위도
    longitude: 126.978, // 서울의 경도
  })
  const [weather, setWeather] = useState<DailyWeather[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(0) // 선택된 날짜의 인덱스

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
          setWeather(weatherData)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchLocationAndWeather()
  }, [])

  useEffect(() => {
    if (weather) {
      setSelectedDate(
        format(new Date(weather[selectedDay].date), 'M월 d일', { locale: ko }),
      ) // 선택된 날짜 업데이트
    }
  }, [selectedDay, weather, setSelectedDate])

  return (
    <div className="m-4 p-2 flex justify-center bg-gray-light rounded-lg">
      <div className="w-full">
        {error && !weather && <p>Error: {error}</p>}
        {location.latitude === null && location.longitude === null && (
          <p>Loading location...</p>
        )}
        {weather ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center space-x-2 my-1">
              <span className="text-lg font-semibold">
                {weather[selectedDay].date} ({weather[selectedDay].dayOfWeek})
              </span>
              <span className="bg-secondary rounded-full text-white text-xs px-2 py-0.5">
                {weather[selectedDay].season}
              </span>
            </div>
            <div className="flex items-center space-x-10 font-semibold text-lg">
              <div className="flex flex-col items-center min-w-20">
                <span className="text-red-500 me-8">
                  {weather[selectedDay].maxTemp}°
                </span>
                <LiaSlashSolid className="absolute mt-5 text-secondary" />
                <span className="text-blue-500 ms-12">
                  {weather[selectedDay].minTemp}°
                </span>
              </div>
              <img
                src={`/images/weather/${weather[selectedDay].icon}`}
                alt={weather[selectedDay].description}
                className="w-16"
              />
              <div className="text-center min-w-20">
                <p className="text-lg">{weather[selectedDay].description}</p>
                <p className="text-sm">습도 {weather[selectedDay].humidity}%</p>
              </div>
            </div>
            <div className="flex justify-between min-w-full">
              {weather.map((day, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`shrink flex flex-col items-center cursor-pointer p-2 ${
                    selectedDay === index ? 'bg-gray-medium rounded-lg' : ''
                  }`}
                >
                  <p className={`text-sm ${getDayOfWeekColor(day.dayOfWeek)}`}>
                    {day.dayOfWeek}
                  </p>
                  <img
                    src={`/images/weather/${day.icon}`}
                    alt={day.description}
                    className="w-6"
                  />
                  <p className="text-xs text-secondary font-light">
                    {day.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          location.latitude !== null &&
          location.longitude !== null && <p>Loading weather...</p>
        )}
      </div>
    </div>
  )
}
