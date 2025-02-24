
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="flex flex-col items-center text-center border-2 p-6 data-[state=open]:slide-in-from-top-1/2 data-[state=closed]:slide-out-to-right-1/2"
          >
            <div className="grid gap-1 items-center">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 px-8"
                onClick={() => props.onOpenChange?.(false)}
              >
                OK
              </Button>
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-0 left-1/2 -translate-x-1/2 flex flex-col gap-2 p-4 w-96" />
    </ToastProvider>
  )
}
