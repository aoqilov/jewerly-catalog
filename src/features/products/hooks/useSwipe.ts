import { useRef } from 'react'
import type { PointerEvent } from 'react'

const SWIPE_DISTANCE = 60
// Shundan kam siljigan bosish "tegish" hisoblanadi; ikki tegish orasidagi vaqt va masofa chegarasi
const TAP_SLOP = 10
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_DISTANCE = 40

type SwipeOptions = {
  // Kattalashtirilgan rasmda surish rasmni siljitadi, sahifani almashtirmaydi (ikki tegish ishlayveradi)
  disabled: boolean
  onLeft: () => void
  onRight: () => void
  onDown: () => void
  onDoubleTap: (clientX: number, clientY: number) => void
}

type Point = { x: number; y: number }

// Bir barmoq bilan surish (chapga/o'ngga yoki pastga) va ikki marta tegish. Ikki barmoqli ishora (pinch) hisobga olinmaydi.
// Capture bosqichida tinglanadi: ichidagi zoom kutubxonasi hodisalarni to'xtatsa ham yetib keladi
export function useSwipe({ disabled, onLeft, onRight, onDown, onDoubleTap }: SwipeOptions) {
  const start = useRef<Point | null>(null)
  const lastTap = useRef<(Point & { time: number }) | null>(null)
  const activePointers = useRef(0)
  const isMultiTouch = useRef(false)

  const onPointerDownCapture = (event: PointerEvent<HTMLElement>) => {
    // isPrimary: birinchi barmoq yoki sichqoncha — hisoblagich har safar shu yerdan boshlanadi
    if (event.isPrimary) {
      activePointers.current = 1
      start.current = { x: event.clientX, y: event.clientY }
      isMultiTouch.current = false
    } else {
      activePointers.current += 1
      isMultiTouch.current = true
    }
  }

  const handleTap = (event: PointerEvent<HTMLElement>) => {
    const previous = lastTap.current
    const isDoubleTap =
      previous &&
      event.timeStamp - previous.time < DOUBLE_TAP_MS &&
      Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < DOUBLE_TAP_DISTANCE

    if (isDoubleTap) {
      // Juftlik ishlatildi: uchinchi tez tegish yangi ketma-ketlikni boshlaydi
      lastTap.current = null
      onDoubleTap(event.clientX, event.clientY)
    } else {
      lastTap.current = { x: event.clientX, y: event.clientY, time: event.timeStamp }
    }
  }

  const onPointerUpCapture = (event: PointerEvent<HTMLElement>) => {
    activePointers.current = Math.max(0, activePointers.current - 1)
    if (activePointers.current > 0 || !start.current) return

    const dx = event.clientX - start.current.x
    const dy = event.clientY - start.current.y
    start.current = null
    if (isMultiTouch.current) {
      lastTap.current = null
      return
    }

    if (Math.hypot(dx, dy) < TAP_SLOP) {
      handleTap(event)
      return
    }

    lastTap.current = null
    if (disabled) return

    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onLeft()
      else onRight()
    } else if (dy > SWIPE_DISTANCE && dy > Math.abs(dx)) {
      onDown()
    }
  }

  const onPointerCancelCapture = () => {
    activePointers.current = Math.max(0, activePointers.current - 1)
    isMultiTouch.current = true
  }

  return { onPointerDownCapture, onPointerUpCapture, onPointerCancelCapture }
}
