import React, { useState } from 'react'
import Modal from '@/components/Modal'
import Image from 'next/image'
import PencilIcon from '../../../../public/icons/pencil.svg'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const PurchaseDateModal: React.FC<{
  onClose: () => void
  setValue: (value: string) => void
}> = ({ onClose, setValue }) => {
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>()

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setPurchaseDate(date)
      setValue(format(date, 'yyyy-MM-dd')) // 날짜를 문자열로 변환하여 전달
    }
    onClose()
  }

  return (
    <Modal title="구매일자" onClose={onClose}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !purchaseDate && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {purchaseDate ? (
              format(purchaseDate, 'PPP')
            ) : (
              <span>구매일자 선택</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={purchaseDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </Modal>
  )
}

export default PurchaseDateModal
