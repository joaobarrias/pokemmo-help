# PokeMMO Capture Chance Calculator

Welcome to the **PokeMMO Capture Chance Calculator**! 🎮✨ This tool helps you calculate the capture chances of Pokémon in **PokeMMO**, an online multiplayer Pokémon game. The calculator uses real-time data fetched from the **PokeAPI** and includes custom catch rates specifically for PokeMMO, as some Pokémon have different catch rates than their official counterparts.

## 🚀 Features

- **Real-time Data Fetching:** The calculator fetches essential Pokémon data from the [PokeAPI](https://pokeapi.co), ensuring up-to-date and accurate statistics.
- **Custom Catch Rates:** Some Pokémon in PokeMMO have unique catch rates compared to the official Pokémon games. This tool uses a custom **JSON file** to handle these specific rates.
- **Alpha Pokémon Support:** Includes functionality for calculating the capture chances for **Alpha Pokémon**, which have distinct catch rates in PokeMMO.
- **Suggestions & Autocomplete:** As you type in the name of a Pokémon, the tool will suggest possible matches to choose from.
- **HP & Catch Rate Modifiers:** You can toggle between exact HP values and percentage HP values to get a more precise calculation for your capture chances.

## ⚙️ How It Works

- **PokeAPI Integration:** The tool fetches Pokémon species data to get the basic stats, including the standard catch rate. This is complemented by custom catch rates stored in a separate **JSON file** that overrides the official values where necessary.
- **Alpha Pokémon:** The **Alpha Pokémon** checkbox adjusts the catch rate calculation for these special Pokémon, applying a different formula for their capture chances.
- **HP Input:** You can either input a percentage of HP remaining or use a fixed value (e.g., exactly 1 HP for False Swipe) to calculate the catch probability more accurately.

## 🧑‍💻 Tech Stack

- **React:** For the UI.
- **PokeAPI:** For fetching Pokémon species and data.
- **TypeScript:** To ensure type safety.
- **JSON:** For custom catch rates specific to PokeMMO.

## 💻 Installation

To get started with this project, follow the steps below:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pokemmo-capture-chance-calculator.git
    ```

2. **Navigate into the project folder:**
    ```bash
    cd pokemmo-capture-chance-calculator
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

Feel free to modify the **custom-rates.json** file to adjust the catch rates for other Pokémon in PokeMMO as needed.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
