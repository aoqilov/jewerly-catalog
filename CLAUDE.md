# bridal-org

Foydalanuvchi bilan o'zbek tilida (lotin yozuvida) yoziladi. Kod, fayl nomlari va texnik atamalar ingliz tilida qoladi.

## Stack

React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · axios · TanStack Query 5 · React Router 7 · react-icons · react-zoom-pan-pinch (mahsulot rasmini kattalashtirish) · vite-plugin-pwa · oxlint

## Buyruqlar

```bash
npm run dev      # dev server
npm run build    # tsc + production build
npm run lint     # oxlint
npm run pwa:icons  # PWA ikonkalari va favicon'ni NICHE rangidan qayta yasash (public/ ga)
```

Har bir o'zgarishdan keyin `npm run build` va `npm run lint` xato va ogohlantirishsiz o'tishi shart.

## Backend

Sayt real backend'ga ulangan: `https://birid.silently.watch/api/v1` (hujjat: `/api/v1/docs/`, schema: `/api/v1/schema/`), do'kon id'si `lib/selectedStore`dan olinadi: foydalanuvchi birinchi kirishda `/stores` sahifasida (`POST /public/stores/get-all/`, nom bo'yicha qidiruv) tanlaydi, tanlov `localStorage`ning `store-id` kalitida turadi va Profil → "Do'konni almashtirish" bilan o'zgaradi. `VITE_STORE_ID` ixtiyoriy standart qiymat (berilsa tanlash sahifasi o'tkazib yuboriladi, foydalanuvchi tanlovi undan ustun). `MainLayout` do'kon bo'lmasa `/stores`ga yo'naltiradi. `/stores/store` admin endpoint'i, xaridor saytida ishlatilmaydi.
- `.env`da `VITE_USE_MOCK=false` turadi. Mock rejim (`true`) backend'siz ishlash uchun saqlanadi, foydalanuvchi aytmaguncha almashtirilmaydi.
- Backend shartnomasi: ildizdagi `api.yaml` (live `/api/v1/schema/` bilan bir xil bo'lishi kerak). Endpoint, so'rov va javob shakllari faqat shundan olinadi.
- Har bir yangi so'rov uchun `<resurs>.mockdata.ts`da ham mock ma'lumot yoziladi. U backend javobi shaklida (`<resurs>.types.ts`dagi `*Dto` tiplariga to'liq mos) bo'ladi.
- Mock rejimda api funksiyasi mock ma'lumotni real javob bilan bir xil mapper'dan o'tkazib qaytaradi. Mutatsiyalar (create / update / delete) xotiradagi mock massivni o'zgartiradi va natijani qaytaradi, sahifa yangilanganda ma'lumot asl holiga qaytadi.
- Backend'da tekshirilgan xatti-harakatlar: get-all javoblari eng yangisidan (`created_at` kamayish tartibida); `filters` maydonlari VA bilan birlashadi (shuning uchun katalogdagi aralash tanlov `products.api`da ikki so'rovga bo'linadi); yaroqsiz token bilan public endpoint ham 401 qaytaradi; CORS hamma origin uchun ochiq.
- Faqat sotuv narxi (`price_sale`) ishlatiladi, ijara va tikish yo'q. Chegirma mahsulotning `discounts` maydonidan hisoblanadi (`lib/productDisplay.productPrice`: eng arzon narx beradigan chegirma, qo'shilmaydi), ko'rinishi `shared/components/ProductPrice`.
- api.yaml'da aniq bo'lmagan joylar (`product_snapshot` shakli, `in_customers_saved` ma'nosi) kodda "Taxminiy" izohi bilan belgilanadi.

## Tuzilma

```
src/
├── main.tsx
├── App.tsx                        # global provider'lar (QueryClientProvider) + RouterProvider
├── style/                         # barcha .css fayllar
│   ├── index.css                  # Tailwind, glass.css importi, @theme tokenlari
│   ├── glass.css                  # glass dizayn-tizimi: tokenlar va recipe klasslar
│   └── motion.css                 # animatsiya keyframe'lari (animate-* klasslari)
├── vite-env.d.ts                  # env o'zgaruvchilarining tiplari
├── api/
│   ├── api-config/
│   │   ├── axios.ts               # axios instance, token qo'shish va 401'da refresh
│   │   ├── backend.ts             # umumiy shakllar (Paginated, GetAllRequest) va yordamchilar (paginate, fetchAllPages)
│   │   └── tanstack.ts            # QueryClient sozlamalari
│   └── routes/                    # har bir backend resursi uchun alohida papka
│       └── products/
│           ├── products.api.ts        # so'rov funksiyalari + query key'lar + Dto → ilova tipi mapper'lari
│           ├── products.types.ts      # backend tiplari (*Dto) va ilova tiplari
│           └── products.mockdata.ts   # mock ma'lumotlar (backend javobi shaklida)
├── router/index.tsx               # route'lar ro'yxati
├── layouts/
│   ├── MainLayout.tsx             # Header + sahifa + BottomNav
│   └── components/                # Header, BottomNav, Logo, Footer (hozircha ishlatilmaydi)
├── pages/                         # har bir route uchun sahifa
│   ├── home/HomePage.tsx
│   └── catalog/
│       ├── CatalogPage.tsx
│       └── product/ProductPage.tsx
├── features/                      # biznes-modullar, har biri mustaqil
│   └── products/
│       ├── api-hooks/             # TanStack Query hook'lari (useGetProduct)
│       ├── components/            # faqat shu feature'ning komponentlari
│       ├── hooks/                 # faqat shu feature'ning mantiqi
│       ├── types.ts               # (kerak bo'lsa) faqat shu feature'ning UI tiplari
│       └── FeatureProduct.tsx     # yagona kirish nuqtasi
├── shared/
│   ├── ui/                        # oddiy UI elementlar: Button, Input, Modal
│   └── components/                # bir nechta feature ishlatadigan komponentlar
├── assets/                        # rasm, shrift, ikonkalar
├── config/                        # app.ts (nom, tavsif, mavzu fon ranglari), env.ts, routes.ts, navigation.ts, site.ts, niche.ts, ui.ts (umumiy klass konstantalari), konstantalar
├── types/                         # API'dan tashqari umumiy tiplar
├── hooks/                         # hamma joyda ishlatiladigan hook'lar
└── lib/                           # applyNiche.ts, yordamchi funksiyalar
```

## Qoidalar

### Qatlamlar va importlar
- Import yo'nalishi: `router → layouts, pages → features → api → shared, lib, config, types, hooks, assets`. Teskari yo'nalishda import qilinmaydi.
- Pastki qatlamdagi papkalar (`shared`, `lib`, `config`, `types`, `hooks`, `assets`) bir-birini import qila oladi, lekin `api`, `features`, `pages`, `layouts`ni import qilmaydi.
- Istisno: `api/routes/<resurs>/<resurs>.types.ts` fayllaridagi tiplarni istalgan qatlam `import type` bilan olishi mumkin.
- Feature'lar bir-birini import qilmaydi. Ikki feature'ga kerak bo'lgan narsa `shared/`, `types/` yoki `hooks/`ga ko'chiriladi.
- Feature'dan tashqariga faqat `Feature<Nom>.tsx` import qilinadi. Uning ichki papkalariga (`api-hooks`, `components` va boshqalar) tashqaridan murojaat qilinmaydi.
- Qatlamlar orasida `@/` alias ishlatiladi (`@/api/routes/products/products.api`), bitta qatlam ichida esa nisbiy import (`./components/...`, `../../api-config/axios`).

### Sahifalar
- Sahifa `pages/<route>/<Nom>Page.tsx` faylida turadi. U faqat Feature komponentlarini yig'adi va URL parametrlarini (`useParams`) props orqali uzatadi. Sahifada API so'rovi va biznes-mantiq bo'lmaydi.
- Istisno: holati URL query'da turadigan feature (masalan, katalogdagi tanlov va ko'rinish) uni o'zining `hooks/` ichida `useSearchParams` bilan o'qiydi va yozadi (`features/catalog/hooks/useCatalogParams`). Bunday sahifa feature'ga props bermaydi. Boshqa joyda shu formatdagi URL kerak bo'lsa, `ROUTES`ga yordamchi funksiya qo'shiladi (`ROUTES.catalogByCategory`).
- Yangi sahifa uchun URL `config/routes.ts`dagi `ROUTES`ga, route esa `router/index.tsx`ga qo'shiladi. Kodda URL qo'lda yozilmaydi, faqat `ROUTES` orqali olinadi.
- Sahifa menyuda ko'rinishi kerak bo'lsa, `config/navigation.ts`dagi `NAV_LINKS`ga `label`, `to` va `icon` bilan qo'shiladi. Header (desktop) va pastki navbar havolalarni shu ro'yxatdan oladi.

### Layout
- `layouts/MainLayout.tsx` Header, sahifa (`Outlet`) va BottomNav'ni yig'adi. Ularning qismlari `layouts/components/`da turadi.
- Sayt nomi, telefon, email va ijtimoiy tarmoqlar faqat `config/site.ts`dagi `SITE`dan olinadi (hozircha vaqtinchalik qiymatlar). Nom, qisqa nom va tavsifning manbasi `config/app.ts`dagi `APP` (`SITE` uni yoyib oladi): uni `vite.config.ts` ham o'qiydi, shuning uchun `app.ts`da import bo'lmaydi.

### PWA
- `vite-plugin-pwa` (`vite.config.ts`): manifest (`APP`dan nom/tavsif, `THEME_COLORS`dan ranglar) va service worker. SW faqat build'da yaratiladi (`npm run build && npm run preview` bilan tekshiriladi), dev'da yo'q. Yangi versiya o'zi o'rnatiladi (`autoUpdate`).
- SW ilova fayllari, rasmlar (`CacheFirst`) va Google Fonts'ni keshlaydi. API so'rovlari keshlanmaydi.
- Ikonkalar (`public/favicon.svg`, `pwa-*.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`) `scripts/generate-pwa-icons.ts` bilan `NICHE` ranglaridan yasaladi. Nisha almashtirilganda `npm run pwa:icons` ishga tushiriladi, PNG'lar qo'lda tahrirlanmaydi.
- O'rnatish (Profil → "Ilova"): `lib/pwaInstall` `beforeinstallprompt`ni `main.tsx`da render'dan oldin ushlab qoladi, komponentlar `hooks/usePwaInstall` orqali o'qiydi. Brauzer oynasi bo'lsa (Android Chrome) shu ochiladi, bo'lmasa (iOS, Firefox) Android / iPhone yo'riqnomasi (`InstallGuideSheet`). Bosh ekrandan ochilganda "Ilova o'rnatilgan" ko'rinadi.
- `index.html`dagi `%APP_NAME%` kabi o'rinbosarlarni `vite.config.ts`dagi `appMetaPlugin` to'ldiradi. `theme-color` meta'lari mavzu bilan birga almashadi (`index.html` skripti va `useTheme`).
- Header: chapda logo, o'ngda mavzu tugmasi va sevimlilar (❤). Mobilda menyu tugmasi yo'q, navigatsiya faqat BottomNav orqali. `md`dan kattada Header ichida `NAV_LINKS` ko'rinadi.
- Mobilda sahifa tepasidan pastga tortilsa (Instagram kabi) `layouts/components/PullToRefresh` (`hooks/usePullToRefresh`) faol so'rovlarni `refetchQueries({ type: 'active' })` bilan qayta oladi, sahifa reload bo'lmaydi. Touch hodisalari `#root`ga ulanadi, shuning uchun portal'dagi modal oynalarga ta'sir qilmaydi.
- Modal oynalar `shared/ui/CusBottomSheet` orqali: fon yoki Escape bosilganda yopiladi, ochiq paytda sahifa scroll'i bloklanadi (`hooks/useLockBodyScroll`).
- Sahifaning o'z sticky toolbar'i bo'lsa, route'ga `handle: { hideHeaderOnMobile: true }` qo'shiladi (tip: `types/router.ts`), `MainLayout` mobilda Header'ni yashiradi. Toolbar mobilda `top-0`, `md`dan kattada Header ostida (`md:top-[65px]`) turadi.
- Pastda qotib turadigan harakatlar paneli `shared/ui/CusStickyActionBar` orqali: mobilda BottomNav ustida (`bottom-(--bottom-nav-h)`), BottomNav yashirilgan sahifada ekran pastida turadi. Sahifa oxiridagi bo'sh joyni panel o'zi qo'yadi (balandligini o'lchab), sahifalarda qo'lda spacer yozilmaydi. O'lchangan balandlik `:root`dagi `--action-bar-h`da turadi: panelgacha cho'zilishi kerak bo'lgan blok (katalog tasmasi) balandligini `100dvh`dan shu va `--bottom-nav-h`ni ayirib hisoblaydi.
- Mobilda (`md`dan kichik) ekran pastida `BottomNav` turadi: `NAV_LINKS`dagi har bir havola ikonka va nom bilan. Uning egallagan joyi `MainLayout`da `--bottom-nav-h` CSS o'zgaruvchisiga yoziladi (`calc(4rem+env(safe-area-inset-bottom))`, `md`dan kattada va yashirilganda `0px`), `pb-(--bottom-nav-h)` kontentni uning ostidan chiqaradi. Pastki navbar balandligi o'zgarsa, faqat shu qiymat o'zgartiriladi. Faol band: `aria-current`, qalinroq ikonka va oltin nuqta.
- Mobilda BottomNav kerak bo'lmagan sahifa (masalan, o'z harakatlar paneli bor mahsulot sahifasi) route'ga `handle: { hideBottomNavOnMobile: true }` oladi.
- `MainLayout` ildizida `.app-bg` turadi: glass sirtlar ortidagi dog'lar har bir sahifada shu yerdan keladi, sahifalarga qayta qo'yilmaydi.
- Ikonkalar `react-icons`dan kerakli faylning o'zida to'g'ridan-to'g'ri import qilinadi (`import { LuHeart } from 'react-icons/lu'`), oraliq `Icons` fayli yo'q. Avval Lucide (`react-icons/lu`), unda yo'q bo'lsa Tabler (`react-icons/tb`) ishlatiladi: ikkalasi chiziqli va `strokeWidth`ni qo'llab-quvvatlaydi. To'ldirilgan (fill) to'plamlar ishlatilmaydi. O'lcham `className` bilan (`size-5`, `size-6`) beriladi, bezak ikonkasiga `aria-hidden` qo'yiladi.

### Feature'lar
- Nomlash: `features/<nom>/Feature<Nom>.tsx` (masalan, `features/cart/FeatureCart.tsx`).
- Feature o'z ma'lumotini o'zi yuklaydi va loading / error holatlarini o'zi ko'rsatadi.
- Namuna sifatida `features/products`ga qarang.

### API
- Har bir backend resursi uchun `api/routes/<resurs>/` papkasida 3 ta fayl bo'ladi:
  - `<resurs>.api.ts`: so'rov funksiyalari (`<resurs>Api` obyekti) va query key'lar (`<resurs>Keys`);
  - `<resurs>.types.ts`: backend tiplari (`*Dto`, api.yaml'dagidek snake_case, narxlar decimal satr) va ilova tiplari (camelCase, raqamlar);
  - `<resurs>.mockdata.ts`: mock ma'lumotlar, `*Dto` shaklida.
- Backend javobi ilovaga to'g'ridan-to'g'ri berilmaydi: `<resurs>.api.ts`dagi `map<Nom>` funksiyasi `*Dto`ni ilova tipiga o'giradi. Komponentlar faqat ilova tiplarini ishlatadi.
- Ro'yxatlar `POST .../get-all/` (`{ page, pageSize ≤ 100, filters }`) bilan olinadi, javob `Paginated<T>` (`{ items, page, totalPages, total }`). Ro'yxat to'liq kerak bo'lsa `fetchAllPages`. Mahsulot, kategoriya va yangilik so'rovlari `requireStoreId()` (`lib/selectedStore`) bilan filtrlanadi; `env.storeId` yo'q. Do'kon almashganda `useSelectStore` query keshini tozalaydi.
- Xaridor tokenlari faqat `lib/authTokens` orqali saqlanadi. `api` instance ularni o'zi qo'shadi va 401'da yangilaydi, api funksiyalarida token bilan ishlanmaydi (`authApi.login` / `logout` bundan mustasno).
- axios faqat `<resurs>.api.ts` fayllarida, `api-config/axios.ts`dagi `api` instance orqali ishlatiladi.
- `.env`da `VITE_USE_MOCK=true` bo'lsa, api funksiyalari backend'ga so'rov yubormaydi va mock ma'lumot qaytaradi. Har bir yangi api funksiyasi mock rejimni ham qo'llab-quvvatlashi shart (namuna: `api/routes/products/products.api.ts`).
- Feature'ning `api-hooks/` papkasida faqat TanStack Query hook'lari turadi: `useGet<Nom>` uchun `useQuery`, `useCreate<Nom>`, `useUpdate<Nom>`, `useDelete<Nom>` uchun `useMutation`. Ular `api/routes` funksiyalarini chaqiradi.
- Komponent ichida axios ham, `api/routes` funksiyalari ham to'g'ridan-to'g'ri chaqirilmaydi, faqat `api-hooks` orqali.
- Query key'lar qo'lda yozilmaydi, faqat `<resurs>Keys` orqali olinadi. Mutatsiyadan keyin tegishli ma'lumot `queryClient.invalidateQueries({ queryKey: <resurs>Keys.all })` bilan yangilanadi.
- QueryClient'ning umumiy sozlamalari `api-config/tanstack.ts`da.

### Hook'lar
- `features/<nom>/api-hooks/`: TanStack Query hook'lari.
- `features/<nom>/hooks/`: faqat shu feature'ning mantiqi.
- `src/hooks/`: hamma joyda ishlatiladigan hook'lar (`useDebounce`, `useMediaQuery`).

### Tiplar va komponentlar
- Backend tiplari `api/routes/<resurs>/<resurs>.types.ts`da, faqat bitta feature'ga tegishli UI tiplari o'sha feature'ning `types.ts` faylida, boshqa umumiy tiplar `src/types/`da turadi.
- `shared/ui/`: biznes-mantiqdan xabarsiz oddiy elementlar (`CusButton`, `CusInput`, `CusTextarea`, `CusSegment` va h.k.) — nomlanish qoidasi pastda, "Kod uslubi"da.
- `shared/components/`: bir nechta feature ishlatadigan murakkabroq komponentlar (masalan, ProductCard).
- Faqat bitta feature'ga kerak komponent `features/<nom>/components/`da turadi.

### Env
- Yangi env o'zgaruvchisi `.env` va `.env.example` fayllariga `VITE_` prefiksi bilan qo'shiladi, tipi `src/vite-env.d.ts`ga yoziladi va `config/env.ts` orqali o'qiladi.
- `.env` git'ga qo'shilmaydi. Yangi dasturchi `.env.example`dan nusxa olib `.env` yaratadi.

### Stil va animatsiya
- Stil faqat Tailwind klasslari bilan yoziladi, global stillar `src/style/index.css`da.
- Barcha `.css` fayllar faqat `src/style/` papkasida turadi. Yangi `.css` fayl ham shu yerga qo'shiladi va `style/index.css` ichidan `@import` qilinadi.

### Glass dizayn-tizimi
- Tokenlar (rang, radius, shrift) faqat `style/glass.css`da. `style/index.css`dagi `@theme inline` ularni Tailwind klasslariga ulaydi: `bg-bg`, `bg-fill`, `bg-tile`, `text-text`, `text-muted`, `text-accent`, `border-line`, `bg-brand`, `text-brand-ink`, `bg-placeholder`, `rounded-tile` (4px), `rounded-sm` (9px), `rounded-md` (12px), `rounded-pill` (20px), `font-logo` (faqat logo: Sora, `font-semibold` — faqat 600 vazn yuklanadi).
- Komponentlarda hex rang, `rose-*` / `gray-*` kabi Tailwind palitrasi va yangi ranglar ishlatilmaydi. Yagona aksent: nishaning `brand` rangi.
- Glass sirtlar faqat recipe klasslari bilan: `.glass` (ikkinchi darajali tugma, trek, chip), `.glass-brand` (asosiy CTA va har qanday tanlangan holat), `.glass-on-image` (surat ustidagi tugma/badge), `.glass-bar` (navbar, sticky panel), `.gline` (ajratuvchi chiziq), `.badge-new` (solid). Ular Tailwind utility'lari bilan qayta yozilmaydi. Ichida bosiladigan elementlar bor konteyner (karta, accordion, ro'yxat) `.glass` olmaydi: uning `:active` (scale) va `:hover` (filter) holatlari butun kartaga tushadi. Bunday konteyner `rounded-md border border-line bg-tile` bilan yoziladi.
- Bitta ekranda bitta primary (`.glass-brand`) tugma. `.glass-brand` matni faqat `--brand-ink`, boshqa rang berilmaydi.
- Blur ichida blur bo'lmaydi: `.glass-bar` ichidagi element shaffof + `border-line` bilan yoziladi. Uzun ro'yxat elementlariga `backdrop-filter` qo'yilmaydi, ular `bg-tile` oladi.
- Tugmalar `shared/ui/CusButton` (`primary` / `secondary` / `icon` / `onImage`), segmentlar `shared/ui/CusSegment` orqali. Faqat ikonkali tugmada `aria-label` shart. Bosiladigan maydon kamida 44×44px.
- Mavzu: `<html data-theme="light|dark">`, tanlov `localStorage`ning `theme` kalitida. O'qish/yozish faqat `hooks/useTheme` orqali, tugma `shared/components/ThemeToggle`. `index.html`dagi inline skript mavzuni React'dan oldin qo'yadi.
- Yangi dizayn-tizim komponenti avval `/playground` sahifasida (`features/playground`) ko'rsatiladi. Bu route menyuda yo'q.

### Nisha (rang palitrasi)
- Saytning ranglari `config/niche.ts`dagi `NICHE`dan olinadi. Nishani almashtirish uchun faqat `export const NICHE = NICHES.<id>` qatori o'zgartiriladi.
- Nisha 6 ta xom rang, `tone`, `lightTint` va `darkTint` beradi: `brand`, `brandInk`, `textLight`, `textDark`, `blobA`, `blobB`. `tone: 'light'` och brand uchun (oltin, ustida to'q matn), `'dark'` to'q brand uchun (yashil, qizil, ustida och matn): glass-brand zichroq bo'ladi.
- Foydalanuvchi Profil → "Rang"da nishani almashtira oladi: tanlov `localStorage`ning `niche` kalitida (`lib/activeNiche`, o'qish `hooks/useNiche`), yo'q bo'lsa `NICHE`. PWA ikonkalari va manifest ranglari esa `NICHE`da qoladi.
- `main.tsx`da render'dan oldin `lib/applyNiche` ranglarni `:root`ga `--brand*` / `--blob-*` sifatida yozadi va `data-niche`, `data-brand-tone` atributlarini qo'yadi.
- `textLight`, `textDark` va `blobA` / `blobB` brand rangi bilan bir xil tusda tanlanadi (bir rangli nisha): qorong'i mavzuda chegara, chiziq, nuqta va aksent matni `textDark`dan keladi, boshqa tusda bo'lsa tugma (`brand`) bilan qolgan UI turli rangda chiqadi. Istisno: `bridal` (yashil va pushti dog'lar ataylab).
- Chiziqlar, glass gradient, soyalar, badge va fon dog'lari `glass.css`da `color-mix()` bilan shu ranglardan hisoblanadi. Mavzuga bog'liq tokenlar (`--primary-text`, `--brand-mark`, `--line`) `textLight` yoki `textDark`ni tanlaydi. Bu qiymatlar qo'lda qayta yozilmaydi.
- Yorug' mavzuda `bg`, `fill`, `tile` neytral krem/oqqa nishaning `lightTint` foizicha brand rangini aralashtirib hisoblanadi (`--light-tint`, 0 bo'lsa sof neytral), `muted` shunga qarab to'qlashadi; `text` nishaga bog'liq emas. Qorong'i mavzuda esa `bg`, `fill`, `tile` va `muted` neytral qoraga `darkTint` foizicha brand rangini aralashtirib hisoblanadi (`--dark-tint`).
- Yangi nisha qo'shishda kontrast tekshiriladi: `brandInk` glass-brand ustida va `textLight` / `textDark` fon ustida kamida 4.5:1, ikkala mavzuda.
- Mobile-first: avval mobil uchun klasslar yoziladi, katta ekranlar uchun `sm:` / `md:` / `lg:` qo'shiladi. Har bir komponent 360px kenglikda ham to'g'ri ko'rinishi shart.
- Animatsiya kutubxonasi yo'q, hammasi CSS bilan. Keyframe'lar `style/motion.css`dagi `@theme`da turadi va `animate-<nom>` klasslari sifatida ishlatiladi: `fade-in` / `fade-out`, `slide-in-up` / `slide-out-down`, `slide-in-right` / `slide-out-right`, `slide-in-left` / `slide-out-left`, `slide-switch`, `fade-swap`.
- Ochilib-yopiladigan oyna (sheet, viewer) `hooks/usePresence(isOpen, exitMs)` bilan: u yopilgandan keyin `exitMs` davomida elementni `data-state="closed"` bilan DOM'da ushlab turadi, chiqish animatsiyasi `data-[state=closed]:animate-*` (ichki elementlarga `group-data-[state=closed]:`) bilan beriladi. `exitMs` `motion.css`dagi chiqish davomiyligiga teng bo'ladi.
- Balandligi `auto` bo'lgan blokni ochish-yopish (accordion, qidiruv paneli): `grid` + `grid-rows-[0fr]` ↔ `grid-rows-[1fr]` transition, ichida `overflow-hidden` o'rovchi. Yopiq blokka `inert` qo'yiladi.
- Ichkariga kirish / orqaga qaytish uchun `animate-slide-switch` (`[--switch-dir:1]` yoki `[--switch-dir:-1]`), bir joyda kontent almashishi uchun `animate-fade-swap` ishlatiladi. Ikkalasi faqat kirish animatsiyasi: element `key` o'zgarganda qayta mount bo'lib o'ynaydi. Sahifaga birinchi kirishda o'ynamasligi uchun klass faqat birinchi almashishdan keyin qo'yiladi (`hasSwitched` / `hasSwapped` state).
- `motion.css`dagi `prefers-reduced-motion` qoidasi barcha animatsiya va transition'larni o'chiradi, har bir komponentda alohida tekshirish shart emas.

### Kod uslubi
- Faqat named export (`export function HomePage`), default export ishlatilmaydi.
- Komponent fayllari `PascalCase.tsx`, hook'lar `useSomething.ts`, API fayllari `<resurs>.api.ts` / `.types.ts` / `.mockdata.ts`, qolganlari `camelCase.ts`.
- Props tipi `<Komponent>Props` deb nomlanadi va `type` bilan yoziladi.
- `shared/ui/`dagi har bir komponent `Cus` prefiksi bilan nomlanadi: `CusButton`, `CusInput`, `CusTextarea`, `CusSegment` va h.k. (fayl nomi ham komponent nomi bilan bir xil, masalan `CusButton.tsx`). Bu faqat `shared/ui/`ga tegishli — `features/`, `layouts/components/`, `shared/components/`dagi komponentlarda prefiks ishlatilmaydi.

## Yangi feature qo'shish tartibi

1. Resurs hali yo'q bo'lsa, `api/routes/<resurs>/` papkasida `<resurs>.types.ts`, `<resurs>.mockdata.ts` va `<resurs>.api.ts` yaratiladi.
2. `features/<nom>/api-hooks/`: TanStack Query hook'lari.
3. `features/<nom>/components/`: komponentlar.
4. `features/<nom>/Feature<Nom>.tsx`: hammasini yig'adigan kirish nuqtasi.
5. Sahifada `<Feature<Nom> />` chaqiriladi. Yangi sahifa bo'lsa, `ROUTES` va `router/index.tsx` yangilanadi.
6. `npm run build` va `npm run lint` tekshiriladi.

## Hali hal qilinmagan

Quyidagilar foydalanuvchi bilan kelishilmaguncha qo'shilmaydi:
- Global state (Zustand yoki Redux Toolkit).
- Ko'p tillilik (uz / ru / en) va admin panel.
