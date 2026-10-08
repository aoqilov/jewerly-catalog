import { useState } from 'react'
import type { FormEvent } from 'react'
import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'
import { CusButton } from '@/shared/ui/CusButton'
import { CusInput } from '@/shared/ui/CusInput'
import { useLogin } from '../api-hooks/useLogin'

type LoginSheetProps = {
  isOpen: boolean
  onClose: () => void
}

type FieldErrors = {
  login?: string
  password?: string
}

// Backend'da faqat login + parol bilan kirish bor (ro'yxatdan o'tish endpoint'i yo'q)
export function LoginSheet({ isOpen, onClose }: LoginSheetProps) {
  const login = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = username.trim()
    const nextErrors: FieldErrors = {
      login: value ? undefined : 'Loginni kiriting',
      password: password ? undefined : 'Parolni kiriting',
    }
    setErrors(nextErrors)
    if (!value || !password) return

    login.mutate(
      { login: value, password },
      {
        onSuccess: () => {
          setPassword('')
          onClose()
        },
      },
    )
  }

  return (
    <CusBottomSheet isOpen={isOpen} onClose={onClose} title="Hisobga kirish">
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
        <CusInput
          label="Login"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          error={errors.login}
        />
        <CusInput
          label="Parol"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          error={errors.password}
        />

        {login.isError && (
          <p role="alert" className="text-sm font-semibold text-accent">
            Kirib bo'lmadi. Login va parolni tekshirib, qayta urinib ko'ring
          </p>
        )}

        <CusButton type="submit" fullWidth disabled={login.isPending}>
          {login.isPending ? 'Tekshirilmoqda…' : 'Kirish'}
        </CusButton>
      </form>
    </CusBottomSheet>
  )
}
