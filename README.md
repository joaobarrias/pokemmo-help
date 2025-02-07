# PokeMMO Help

Welcome to **PokeMMO Help**! 🎮✨ This project provides essential tools for Pokémon trainers in **PokeMMO**, helping them calculate capture chances, search for Pokémon, and analyze type effectiveness.

## 🚀 Features

### **Capture Chance**

- Allows users to calculate the probability of catching a Pokémon in **PokeMMO** using the official Pokémon formula.
- Fetches Pokémon data (Gen 1-5) from **PokéAPI**, excluding specific Pokémon listed in a custom JSON file.
- Live search with an autocomplete suggestion box that filters Pokémon names as the user types.
- Fetches essential data such as **HP, Speed, Weight, Catch Rate, Type, and Image** when a Pokémon is selected.
- Adjusts catch rates for **PokeMMO-specific Pokémon** using a separate JSON file.
- Supports **Alpha Pokémon**, applying their unique catch rates and a red aura animation.
- Includes input fields for **Level and HP, along with a Status Condition selector** that applies visual indicators for different effects.
- Dynamically updates a **health bar** matching the in-game design based on user input.
- Provides a **Poké Ball selector** with built-in conditions (e.g., fishing checks, type-based multipliers).
- The capture chance updates **dynamically in real time**, ensuring a smooth user experience without the need for manual refreshes
- **Theme selector** for background customization, allowing users to submit custom themes via Discord.
- **Language selection** (Currently only English, with more planned).

### **Coming Soon**

- **Pokémon Search:** A tool that will allow users to filter Pokémon by **abilities, moves, base stats, egg groups, and types**.
- **Type Chart:** A calculator to evaluate type effectiveness in battles, including an **inverse type mode**.

## ⚙️ How It Works

### **Capture Chance**

1. The app fetches **Pokémon data** from **PokéAPI**, filtering out ineligible Pokémon using a JSON file.
2. Users select a Pokémon through a **live search suggestion box**.
3. Upon selection, the app retrieves **stats, image, and catch rate**, checking a separate JSON file for PokeMMO-specific rates.
4. If the Pokémon has an **Alpha** variant, a checkbox allows switching to its custom catch rate with a red aura effect.
5. Users enter **Level, HP percentage, or 1 HP mode**, which affects the calculation.
6. A **Status Condition** selector applies the respective multiplier.
7. A **Poké Ball selector** determines the ball's capture multiplier, considering conditions like fishing or Pokémon type.
8. The capture chance is calculated using Pokémon's **total HP, current HP, catch rate, status multiplier, and ball multiplier**.
9. **Live updates** ensure the capture chance adjusts immediately upon any user input change.
10. A **theme selector** allows users to pick from different background images, with community submissions accepted via Discord.

### **Coming Soon**

- **Pokémon Search**: A powerful Pokémon lookup tool with detailed filters.
- **Type Chart**: A dynamic type calculator with an optional **inverse type mode**.

## 🧑‍💻 Tech Stack

- **React:** Front-end framework for a dynamic user experience.
- **Vite:** Lightning-fast development environment.
- **TypeScript:** Ensures strong typing and better code maintainability.
- **CSS:** Custom styles with a dark theme and responsive design.
- **PokéAPI:** Provides Pokémon data (Gen 1-5) for calculations.
- **JSON:** Stores custom game-specific data (catch rates, evolutions, Poké Ball multipliers, etc.).

## 💻 Installation

To get started with this project, follow the steps below:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pokemmo-help.git
    ```

2. **Navigate into the project folder:**
    ```bash
    cd pokemmo-help
    ```

3. **Install dependencies:**
    If you are using **npm**:
    ```bash
    npm install
    ```

4. **Run the project locally:**
    After installing the dependencies, you can run the app with:
    ```bash
    npm run dev
    ```

    This will open the project in your default web browser.

## 🎨 Customization

- **Theme Selector:** Users can select different background images.
- **Custom Submissions:** Users can submit their own background images via our **Discord server**.

## 📢 Community & Support

- Join our **[Discord server](https://discord.com/invite/syryMAF4Kr)** for:
  - **Announcements** on updates and new tools.
  - **Suggestions** on new features.
  - **Bug reporting** to help improve the app.
  - **Art submissions** for background themes.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).