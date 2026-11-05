# Rumi 💜

<p align="center">
  <img src="./assets/logo.png" alt="Rumi HUNTR/X Logo" width="160" />
</p>

Edukacyjna gra mobilna dla pięcioletniej Laury w stylistyce **HUNTR/X** (*KPop Demon Hunters* — Rumi) do nauki polskiego alfabetu oraz angielskich nazw kolorów i zwierząt poprzez zabawę głosową.

---

## 🎯 Tematy nauki (`Topic`)

1. **🔤 Alfabet (`Alphabet`)** — 32 litery polskiego alfabetu (`A a` – `Ż ż`):
   - Wielka litera (`DUŻA`) po lewej i mała (`MAŁA`) po prawej stronie.
   - Polska **wymowa fonetyczna** głosek (*a, ą, by, cy, ci, dy, e, ę, fy, gy, hy, i, jy, ky, ly, ły, my, ny, ni, o, u, py, ry, sy, si, ty, u, wy, y, zy, zi, ży*).
   - Do każdej litery przypisana jest kolorowa ilustracja i przykładowe słowo (np. `A` → *Anakonda*, `C` → *Cytryna*, `D` → *Dinozaur*).
2. **🎨 Kolory (`Colors`)** — 11 podstawowych kolorów po angielsku (*Red, Blue, Green, Yellow, Orange, Purple, Pink, Black, White, Brown, Gray*):
   - Duża próbka koloru w kontrastowej białej ramce (`border-[10px] border-white`).
   - Angielska wymowa (`en-US`) oraz podpis po angielsku i po polsku odkrywany po sprawdzeniu wymowy.
3. **🦁 Zwierzęta (`Animals`)** — 12 zwierząt po angielsku (*Dog, Cat, Lion, Elephant, Monkey, Frog, Tiger, Horse, Pig, Cow, Rabbit, Bear*):
   - Duża ilustracja zwierzęcia na karcie wyzwania.
   - Angielska wymowa (`en-US`) oraz angielska i polska nazwa odkrywana po sprawdzeniu wymowy.

---

## 🎮 Tryby rozgrywki (`Play Mode`)

1. **🏆 Na punkty (`Scored Mode`)**:
   - **Alfabet**: runda 10 losowych liter bez powtórzeń (wygrana od **8/10** pkt, brak podpowiedzi obrazkowych).
   - **Kolory**: runda 5 losowych kolorów bez powtórzeń (wygrana od **4/5** pkt).
   - **Zwierzęta**: runda 5 losowych zwierząt bez powtórzeń (wygrana od **4/5** pkt).
   - Najpierw widoczny jest wyłącznie przycisk **`🔊 Sprawdź wymowę`** — dopiero po pierwszym odsłuchaniu pojawiają się przyciski samooceny **`+` (Dobrze!)** oraz **`−` (Jeszcze nie)**.
   - Ekran podsumowania z wybuchem konfetti, komunikatem głosowym oraz dużymi przyciskami obrazkowymi **`🔄` (Zagraj ponownie)** i **`🏠` (Dom)**.
2. **📖 Bez punktów (`Practice Mode`)**:
   - Swobodna nauka bez licznika punktów i bez limitu kart.
   - W trybie **Alfabet** dostępny jest przycisk **`💡 Podpowiedź`**, który odsłania obrazek i słowo zaczynające się na daną literę.
   - Po odsłuchaniu wymowy (`🔊`) pojawia się przycisk **`Dalej ➔`**.
3. **🔊 Słownik (`Catalog Mode`)**:
   - Pełna przewijana lista wszystkich elementów w wybranym temacie (32 litery, 11 kolorów lub 12 zwierząt).
   - Kliknięcie dowolnego wiersza podświetla go i natychmiast odtwarza nagranie wymowy, po czym podświetlenie automatycznie gaśnie.

---

## 🗂️ Struktura projektu (`Expo Router`)

```text
src/
├── app/
│   ├── _layout.tsx          # Główne drzewo nawigacji Stack (Expo Router)
│   ├── index.tsx            # Ekran główny (wybór trybu i tematu + logo Rumi)
│   ├── alphabet.tsx         # Ekran wyzwań i słownika dla Alfabetu (/alphabet)
│   ├── colors.tsx           # Ekran wyzwań i słownika dla Kolorów (/colors)
│   ├── animals.tsx          # Ekran wyzwań i słownika dla Zwierząt (/animals)
│   └── summary.tsx          # Ekran podsumowania rundy punktowanej (/summary)
├── components/
│   ├── challenge-shell.tsx  # Wspólny układ rozgrywki dla trybów Na punkty / Bez punktów
│   ├── catalog-shell.tsx    # Wspólny układ przewijanej listy dla trybu Słownik
│   ├── confetti-burst.tsx   # Animowany wybuch konfetti (Reanimated)
│   └── juicy-button.tsx     # Sprężysty przycisk z animacją skali na wątku UI
├── data/
│   └── challenges.ts        # Dane 32 liter, 11 kolorów, 12 zwierząt i reguły rund
└── utils/
    └── audio.ts             # Odtwarzacz nagrań offline (.wav) + fallback TTS i haptyka
```

---

## 🛠️ Stos technologiczny

- **React Native 0.83** + **Expo SDK 58** (TypeScript)
- **Expo Router** (file-based routing w `src/app/`)
- **NativeWind v4** (Tailwind CSS)
- **React Native Reanimated 4** (płynne animacje na wątku UI + obsługa `Reduced Motion`)
- **Expo Audio**, **Expo Speech** & **Expo Haptics** (wbudowane nagrania `.wav` działające w 100% offline dla języka polskiego i angielskiego + wibracje haptyczne)

---

## 🚀 Uruchomienie (Emulator / Fizyczny telefon przez USB)

```bash
# 1. Instalacja zależności
npm install

# 2. Sprawdzenie typów TypeScript
npx tsc --noEmit

# 3. Uruchomienie serwera deweloperskiego (przez tunel ADB localhost)
npx expo start --localhost --clear --android
```

Dla fizycznego telefonu podpiętego przez USB z włączonym debugowaniem USB (np. **Samsung Galaxy A71**):
```bash
adb -s <DEVICE_ID> reverse tcp:8081 tcp:8081
adb -s <DEVICE_ID> shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081" host.exp.exponent
```

Słownik pojęć domenowych znajduje się w pliku [GLOSSARY.md](./GLOSSARY.md).
