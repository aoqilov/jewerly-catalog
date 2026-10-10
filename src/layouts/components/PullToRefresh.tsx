import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { LuRefreshCw } from 'react-icons/lu'
import { PULL_THRESHOLD, usePullToRefresh } from '@/hooks/usePullToRefresh'

// Instagram kabi: sahifa tepasidan pastga tortilsa, ekrandagi (faol) so'rovlar qayta olinadi.
// Sahifa qayta yuklanmaydi: holat, scroll va URL joyida qoladi
export function PullToRefresh() {
  const queryClient = useQueryClient()
  const refresh = useCallback(() => queryClient.refetchQueries({ type: 'active' }), [queryClient])
  const { pull, isDragging, isRefreshing } = usePullToRefresh(refresh)

  const progress = Math.min(pull / PULL_THRESHOLD, 1)

  return (
    <div
      role={isRefreshing ? 'status' : undefined}
      aria-label={isRefreshing ? 'Yangilanmoqda' : undefined}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center pt-[env(safe-area-inset-top)] md:hidden"
    >
      {/* Yashirin paytida -48px: ekrandan tepada. Tortilganda pastga tushadi, qo'yib yuborilganda silliq qaytadi */}
      <div
        style={{ transform: `translateY(${pull - 48}px)`, opacity: progress }}
        className={`glass flex size-10 items-center justify-center rounded-full text-accent ${
          isDragging ? '' : 'transition-[transform,opacity] duration-200 ease-out'
        }`}
      >
        <LuRefreshCw
          aria-hidden
          style={isRefreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
          className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`}
        />
      </div>
    </div>
  )
}
