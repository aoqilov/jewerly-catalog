import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'onImage'
type ButtonSize = 'md' | 'lg'

type ButtonBaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  fullWidth?: boolean
}

// href berilsa <a>, aks holda <button> chiziladi
export type CusButtonProps =
  | (ButtonBaseProps & ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | (ButtonBaseProps & ComponentPropsWithoutRef<'a'> & { href: string })

const baseClass =
  'inline-flex select-none items-center justify-center gap-2 aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50'

// primary: ekrandagi yagona asosiy harakat. icon / onImage: faqat ikonka, aria-label shart
const variantClass: Record<ButtonVariant, string> = {
  primary: 'glass-brand rounded-md px-5 font-bold',
  secondary: 'glass rounded-md px-5 font-semibold text-text',
  icon: 'glass size-11 rounded-full text-text',
  onImage: 'glass-on-image size-11 rounded-full',
}

const sizeClass: Record<ButtonSize, string> = {
  md: 'h-12 text-[15px]',
  lg: 'h-13 text-base',
}

function buttonClass(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className = '',
) {
  const isRound = variant === 'icon' || variant === 'onImage'
  return [
    baseClass,
    variantClass[variant],
    isRound ? '' : sizeClass[size],
    // fullWidth: flex qatorda hamqator elementlar bilan joy bo'lishishi uchun shrink-0 emas, min-w-0 + w-full
    fullWidth ? 'min-w-0 w-full' : 'shrink-0',
    className,
  ].join(' ')
}

export function CusButton(props: CusButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', size = 'md', icon, fullWidth = false, className, children, ...rest } =
      props
    return (
      <a {...rest} className={buttonClass(variant, size, fullWidth, className)}>
        {icon}
        {children}
      </a>
    )
  }

  const {
    variant = 'primary',
    size = 'md',
    icon,
    fullWidth = false,
    className,
    children,
    type = 'button',
    ...rest
  } = props
  return (
    <button type={type} {...rest} className={buttonClass(variant, size, fullWidth, className)}>
      {icon}
      {children}
    </button>
  )
}
