'use client'

import * as React from 'react'
import { format } from 'date-fns'
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

export function DatePicker({ defaultValue, buttonClassName }) {
  const [selectedDate, setSelectedDate] = React.useState(
    defaultValue ? new Date(defaultValue) : new Date(),
  )
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [viewDate, setViewDate] = React.useState(
    defaultValue ? new Date(defaultValue) : new Date(),
  )

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    setIsPopoverOpen(false)
  }

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10)
    setViewDate(new Date(viewDate.getFullYear(), month, 1))
  }

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10)
    setViewDate(new Date(year, viewDate.getMonth(), 1))
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
            className="w-8 h-8 flex items-center justify-center font-normal"
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
            variant={'light'}
            className={cn(
              'w-[360px] justify-between text-left font-normal border-primary-400',
              buttonClassName,
            )}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            {selectedDate ? (
              format(selectedDate, 'yyyy.MM.dd')
            ) : (
              <span>날짜를 선택하세요</span>
            )}
            <div className="absolute inset-y-0 end-0 flex items-center pr-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#CCCED0]"
              >
                <path
                  d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                  className="fill-[#CCCED0]"
                />
                <path
                  d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                  className="fill-[#CCCED0]"
                />
              </svg>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 h-72 p-4 bg-primary-50 text-xs text-[#49454F]">
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
                className="fill-[#49454F]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  className="fill-[#49454F]"
                />
              </svg>
            </button>
            <select
              value={viewDate.getMonth()}
              onChange={handleMonthChange}
              className="bg-primary-50 focus:outline-none"
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
                className="fill-[#49454F]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  className="fill-[#49454F]"
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
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#49454F]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
                  className="fill-[#49454F]"
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
                className="fill-[#49454F]"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  className="fill-[#49454F]"
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
