'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { LiaSlashSolid } from 'react-icons/lia'

// 위치 정보를 나타내는 인터페이스
interface Location {
  latitude: number | null
  longitude: number | null
}

interface WeatherCondition {
  id: number
  description: string
}

// 일일 날씨 정보를 나타내는 인터페이스
interface DailyWeather {
  dayOfWeek: string // 요일
  date: string // 날짜
  minTemp: number
  maxTemp: number
  description: string // 한국어 설명
  humidity: number
  icon: string
}

const getSeason = (month: number): string => {
  switch (month) {
    case 3:
    case 4:
    case 5:
      return '봄'
    case 6:
    case 7:
    case 8:
      return '여름'
    case 9:
    case 10:
    case 11:
      return '가을'
    case 12:
    case 1:
    case 2:
      return '겨울'
    default:
      return ''
  }
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

const getWeatherDescription = (id: number): string => {
  switch (true) {
    case id >= 200 && id < 300:
      return '뇌우'
    case id >= 300 && id < 400:
      return '이슬비'
    case id !== 511 && id >= 500 && id < 600:
      return id >= 520 && id <= 531 ? '소나기' : '비'
    case id === 511 || (id >= 600 && id < 700):
      return '눈'
    case id >= 700 && id < 800:
      switch (id) {
        case 701 || 721 || 741:
          return '안개'
        case 711:
          return '연기'
        case 731 || 751 || 761:
          return '먼지'
        case 762:
          return '화산재'
        case 771:
          return '돌풍'
        case 781:
          return '토네이도'
      }
    case id === 800:
      return '맑음'
    case id === 801:
      return '구름 조금'
    case id === 802:
      return '구름 많음'
    case id === 803 || id === 804:
      return '흐림'
    default:
      return '알 수 없음'
  }
}

const getWeatherIcon = (weather: WeatherCondition): string => {
  const { id, description } = weather

  switch (true) {
    case id >= 200 && id < 300:
      return 'thunderstorm.png'
    case id >= 300 && id < 400:
      return description.includes('shower') ? 'shower.png' : 'drizzle.png'
    case id !== 511 && id >= 500 && id < 600:
      return description.includes('shower') ? 'shower.png' : 'rain.png'
    case id === 511 || (id >= 600 && id < 700):
      return 'snow.png'
    case id >= 700 && id < 800:
      return 'atmosphere.png'
    case id === 800:
      return 'clear.png'
    case id === 801:
      return 'few-clouds.png'
    case id === 802:
      return 'scattered-clouds.png'
    case id >= 803 && id <= 804:
      return 'clouds.png'
    default:
      return 'clear.png'
  }
}

const fetchWeather = async (
  latitude: number,
  longitude: number,
): Promise<DailyWeather[]> => {
  const API_KEY = '6b791431143aa1d88e1ee9fba2e3b7a7' // OpenWeatherMap API 키를 여기에 입력하세요
  const response = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data = await response.json()
  return data.daily.slice(0, 7).map((day: any) => {
    const date = new Date(day.dt * 1000)
    const weatherId = day.weather[0].id
    return {
      dayOfWeek: format(date, 'EEE', { locale: ko }), // 요일
      date: format(date, 'MM/dd'), // 날짜
      minTemp: Math.round(day.temp.min),
      maxTemp: Math.round(day.temp.max),
      description: getWeatherDescription(weatherId), // 한국어 설명
      humidity: day.humidity,
      icon: getWeatherIcon(day.weather[0]),
    }
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

export default function Weather() {
  const [location, setLocation] = useState<Location>({
    latitude: null,
    longitude: null,
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
          const weatherData = await fetchWeather(
            currentPosition.latitude,
            currentPosition.longitude,
          )
          setWeather(weatherData)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchLocationAndWeather()
  }, [])

  return (
    <div className="m-4 p-2 flex justify-center bg-gray-light rounded-lg">
      <div>
        {error && <p>Error: {error}</p>}
        {location.latitude === null && location.longitude === null && (
          <p>Loading location...</p>
        )}
        {weather ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">
                {weather[selectedDay].date} ({weather[selectedDay].dayOfWeek})
              </span>
              <span className="bg-secondary rounded-full text-white text-xs px-2 py-0.5">
                {getSeason(new Date(weather[selectedDay].date).getMonth() + 1)}
              </span>
            </div>
            <div className="flex items-center space-x-10 font-semibold text-lg">
              <div className="flex flex-col items-center">
                <span className="text-red-500 me-10">
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
              <div className="text-center text-lg">
                <p>{weather[selectedDay].description}</p>
                <p className="text-sm">습도 {weather[selectedDay].humidity}%</p>
              </div>
            </div>
            <div className="flex">
              {weather.map((day, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`flex flex-col items-center cursor-pointer p-2 m-0.5 ${
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
