// Backend tozalagan HTML'dan (yangilik tavsifi) oddiy matn: paragraflar orasida bo'sh qator, <br> va ro'yxat bandlari
// yangi qatorda. Teglar chizilmaydi, matn whitespace-pre-line bilan ko'rsatiladi. DOMParser skriptlarni ishga tushirmaydi
export function htmlToText(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('br').forEach((element) => element.replaceWith('\n'))
  doc.querySelectorAll('li').forEach((element) => {
    element.prepend('• ')
    element.append('\n')
  })
  doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol').forEach((element) => element.append('\n\n'))
  return (doc.body.textContent ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}
