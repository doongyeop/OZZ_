import { ImSpinner8 } from 'react-icons/im'

type LoadingPageProps = {
  messages: string[]
  footerMessage: string
}

export default function LoadingPage({
  messages,
  footerMessage,
}: LoadingPageProps) {
  return (
    <div className="absolute top-0 flex items-center justify-center h-screen w-screen bg-secondary text-primary-400">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-3xl font-bold text-center">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        <ImSpinner8 className="animate-spin" size="40" />
        <p>{footerMessage}</p>
      </div>
    </div>
  )
}
