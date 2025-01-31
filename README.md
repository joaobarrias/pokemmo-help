# PokeMMO Tools

Welcome to **PokeMMO Tools**! 🎮✨ This project provides various tools designed to help you calculate important in-game statistics for **PokeMMO**, an online multiplayer Pokémon game. Currently, the tool includes a **Capture Chance**, along with future features like the **Stats Preview** and **Type Effectiveness** (coming soon!).

## 🚀 Features

### **Capture Chance**
- **Real-time Data Fetching:** The calculator fetches essential Pokémon data from the [PokeAPI](https://pokeapi.co), ensuring up-to-date and accurate statistics.
- **Custom Catch Rates:** Some Pokémon in PokeMMO have unique catch rates compared to the official Pokémon games. This tool uses a custom **JSON file** to handle these specific rates.
- **Alpha Pokémon Support:** Includes functionality for calculating the capture chances for **Alpha Pokémon**, which have distinct catch rates in PokeMMO.
- **Suggestions & Autocomplete:** As you type in the name of a Pokémon, the tool will suggest possible matches to choose from.
- **HP & Catch Rate Modifiers:** You can toggle between exact HP values and percentage HP values to get a more precise calculation for your capture chances.

### **Coming Soon**
- **Stats Preview:** A tool that will allow you to calculate the stats of your Pokémon, based on their IVs, EVs and Level.
- **Type Effectiveness:** A calculator to evaluate the effectiveness of different Pokémon types against each other in battle.

## ⚙️ How It Works

### **Capture Chance**
- **Pokémon Input:** The tool allows users to input a Pokémon name, and it fetches the relevant data for the capture chance calculations. This includes data from the **PokeAPI** to retrieve the Pokémon's species information, such as catch rate and base stats, which are used in the calculation. Custom catch rates specific to PokeMMO are also incorporated, overriding official values where necessary.
- **Alpha Pokémon:** The **Alpha Pokémon** checkbox adjusts the catch rate with a different formula and adds a dynamic visual effect, including red smoke and a glowing background, mimicking the actual Alpha appearance in the game.
- **Status Condition Multiplier:** The selected status condition (e.g., paralysis or sleep) modifies the catch rate. A corresponding status icon is displayed on the Pokémon image, making it easier to track the Pokémon's current condition.
- **HP Input & Display:** You can input a percentage or fixed HP value (e.g., 1 HP for False Swipe). The health bar visually reflects the Pokémon's health with an in-game styled design, dynamically adjusting based on their current HP and total HP calculated from base HP and level, providing an immersive representation during capture.
- **Pokéball Selector:** The Pokéball multiplier is applied to the calculation of the capture chances based on your selection of Pokéball.

### **Coming Soon**
- **Stats Preview** 
- **Type Effectiveness** 

## 🧑‍💻 Tech Stack

- **React:** For building the UI.
- **TypeScript:** Ensures type safety across the application.
- **CSS:** For styling, including custom effects for Alpha Pokémon.
- **PokéAPI:** Fetches basic Pokémon data.
- **JSON:** For storing and adjusting custom catch rates specific to PokeMMO.

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
