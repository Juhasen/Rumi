# Rumi 💜

Edukacyjna gra mobilna dla pięcioletniej Laury w stylistyce **HUNTR/X** (*KPop Demon Hunters*) do nauki:
- **Polskiego alfabetu (A–Ż, 32 litery)** – wielka litera po lewej, mała po prawej, polska wymowa nazw liter (`pl-PL`).
- **Angielskich kolorów (11 podstawowych kolorów)** – próbka koloru w kontrastowej białej ramce, angielska wymowa (`en-US`).

## Tryby rozgrywki
1. **🏆 Gra na punkty (`Scored Mode`)**:
   - **Alfabet**: runda 10 losowych liter bez powtórzeń (wygrana od **8/10**).
   - **Kolory**: runda 5 losowych kolorów bez powtórzeń (wygrana od **4/5**).
   - Przyciski oceny `+` (zielony) i `−` (czerwony) odblokowują się po odsłuchaniu wymowy przyciskiem głośnika `🔊`.
   - Konfetti i fanfary głosowe przy wygranej rundzie.
2. **📖 Swobodna nauka (`Practice Mode`)**:
   - Nauka bez limitu kart i bez presji punktów (przycisk `Dalej ➔` po odsłuchaniu wymowy).

## Stos technologiczny
- **React Native** + **Expo SDK 58** (TypeScript)
- **NativeWind v4** (Tailwind CSS)
- **React Native Reanimated 4** (animacje na wątku UI + obsługa `Reduced Motion`)
- **Expo Speech** & **Expo Haptics** (wymowa TTS `pl-PL` / `en-US` + wibracje haptyczne)

## Uruchomienie lokalne
```bash
npm install
npx expo start --android
```
Słownik pojęć domenowych znajduje się w [GLOSSARY.md](./GLOSSARY.md).
