'use client'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
export default function test() {
  const { toast } = useToast()
  // toast({ description: '회원정보가 수정되었습니다.' })

  return (
    <div>
      <button
        className="border bg-primary-400"
        onClick={() =>
          toast({ description: '회원정보가 수정되었다는그런얘기' })
        }
      >
        나를눌러바
      </button>
      <Button
        variant={'default'}
        onClick={() => {
          toast({
            className: cn(
              'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
            ),
            variant: 'default',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }}
      >
        Save
      </Button>
    </div>
  )
}
