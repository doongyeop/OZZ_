import React, { useState } from 'react'
import Modal from '@/components/Modal'

const seasons = ['봄', '여름', '가을', '겨울']

const SeasonModal: React.FC<{
  onClose: () => void
  setValue: (value: string[]) => void
}> = ({ onClose, setValue }) => {
  const [season, setSeason] = useState<{ [key: string]: boolean }>({
    봄: false,
    여름: false,
    가을: false,
    겨울: false,
  })

  const toggleSeason = (season: string) => {
    setSeason((prevSeasons) => ({
      ...prevSeasons,
      [season]: !prevSeasons[season],
    }))
  }

  const handleSave = () => {
    const selected = Object.keys(season).filter((ss) => season[ss])
    setValue(selected)
    onClose()
  }

  return (
    <Modal title="계절감" onClose={onClose}>
      <div className="flex justify-between l-1 pr-2">
        {seasons.map((ss) => (
          <button
            key={ss}
            type="button"
            className={`px-2 py-0.5 m-1 rounded-lg border-2 border-primary-400 text-sm font-semibold ${
              season[ss]
                ? 'bg-primary-400 text-secondary'
                : 'bg-secondary text-primary-400'
            }`}
            onClick={() => toggleSeason(ss)}
          >
            {ss}
          </button>
        ))}
      </div>
      <div className="mt-2 flex w-full justify-center">
        <button
          className="w-[55px] h-[25px] border-2 border-primary-400 rounded-2xl bg-secondary text-primary-400 text-xs font-semibold hover:bg-primary-400 hover:text-secondary"
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </Modal>
  )
}

export default SeasonModal
