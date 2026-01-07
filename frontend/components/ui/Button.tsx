import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-800 text-gray-200 hover:bg-gray-700': variant === 'secondary',
          'text-gray-400 hover:bg-gray-800 hover:text-gray-200': variant === 'ghost'
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
