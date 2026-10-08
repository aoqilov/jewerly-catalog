// body/html scroll qilmaydi (style/index.css) — butun ilova #root konteyneri ichida suriladi.
// window/document.documentElement o'rniga shu funksiya orqali olinadigan element ishlatiladi
export function appScrollElement(): HTMLElement {
  return document.getElementById('root') as HTMLElement
}
