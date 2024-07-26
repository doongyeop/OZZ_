'use client'

import * as React from 'react'
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function DatePicker() {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [viewDate, setViewDate] = React.useState<Date>(new Date())

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setIsPopoverOpen(false)
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(event.target.value, 10)
    setViewDate(new Date(viewDate.getFullYear(), month, 1))
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(event.target.value, 10)
    setViewDate(new Date(year, viewDate.getMonth(), 1))
  }

  const handleSaveDate = () => {
    setIsPopoverOpen(false)
  }

  const handleCancel = () => {
    setIsPopoverOpen(false)
  }

  const renderCalendar = () => {
    const startOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      1,
    )
    const endOfMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
    )
    const startDay = startOfMonth.getDay()
    const daysInMonth = endOfMonth.getDate()

    const calendarDays = []
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8" />)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), i)
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString()
      calendarDays.push(
        <button
          key={i}
          onClick={() => handleSelectDate(date)}
          className={cn(
            'w-8 h-8 flex items-center justify-center rounded-full',
            isSelected ? 'bg-primary-400' : 'hover:bg-primary-400',
          )}
        >
          {i}
        </button>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="w-8 h-8 flex items-center justify-center font-bold"
          >
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    )
  }

  const renderYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 1900; i <= currentYear; i++) {
      years.push(i)
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))
  }

  return (
    <div className="relative inline-block">
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-between text-left font-normal border-primary-400',
              !selectedDate && 'text-muted-foreground',
            )}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {selectedDate ? (
              format(selectedDate, 'yyyy.MM.dd')
            ) : (
              <span>날짜를 선택하세요</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 h-72 p-4 bg-primary-50 text-secondary">
          <div className="flex justify-between mb-2 space-x-2">
            <button
              onClick={() =>
                handleMonthChange({
                  target: { value: viewDate.getMonth() - 1 },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  fill="#49454F"
                />
              </svg>
            </button>
            <select
              value={viewDate.getMonth()}
              onChange={handleMonthChange}
              className="bg-primary-50 focus-outline-none"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <button
              onClick={() =>
                handleMonthChange({
                  target: { value: viewDate.getMonth() + 1 },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  fill="#49454F"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                handleYearChange({
                  target: { value: viewDate.getFullYear() - 1 },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  fill="#49454F"
                />
              </svg>
            </button>
            <select
              value={viewDate.getFullYear()}
              onChange={handleYearChange}
              className="bg-primary-50 focus:outline-none"
            >
              {renderYears()}
            </select>
            <button
              onClick={() =>
                handleYearChange({
                  target: { value: viewDate.getFullYear() + 1 },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-secondary"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  fill="#49454F"
                />
              </svg>
            </button>
          </div>
          {renderCalendar()}
        </PopoverContent>
      </Popover>
    </div>
  )
}
