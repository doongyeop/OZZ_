import { ImSpinner8 } from 'react-icons/im'

export default function Loading() {
  return (
    <div className="absolute top-0 flex items-center justify-center h-screen w-screen bg-secondary text-primary-400">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-3xl font-bold text-center">
          <p>옷을</p>
          <p>가져오고</p>
          <p>있어요</p>
        </div>
        <ImSpinner8 className="animate-spin" size="40" />
        <p>조금만 기다려 주세요...</p>
      </div>
    </div>
  )
}
