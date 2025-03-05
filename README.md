# PokeMMO Help

Welcome to **PokeMMO Help**! 🎮✨ This project provides essential tools for Pokémon trainers in **PokeMMO**, helping them calculate capture chances, search for Pokémon, and analyze type effectiveness. Available now at **https://www.pokemmo.help/**.

## 🚀 Features

### **Capture Chance**

- Allows users to calculate the probability of catching a Pokémon in **PokeMMO** using the official Pokémon formula.
- Fetches **Pokémon data** from **local JSON files**, which store the essential Pokémon information (Gen 1-5) and specific PokeMMO mechanics.
- Live search with an autocomplete suggestion box that filters Pokémon names as the user types.
- Fetches essential data such as **HP, Speed, Weight, Catch Rate, Type, and Image** when a Pokémon is selected.
- Adjusts catch rates for **PokeMMO-specific Pokémon** using a separate JSON file.
- Supports **Alpha Pokémon**, applying their unique catch rates and a red aura animation.
- Includes input fields for **Level and HP, along with a Status Condition selector** that applies visual indicators for different effects.
- Dynamically updates a **health bar** matching the in-game design based on user input.
- Provides a **Poké Ball selector** with built-in conditions (e.g., fishing checks, type-based multipliers).
- The capture chance updates **dynamically in real time**, ensuring a smooth user experience without the need for manual refreshes

### **Pokémon Search** 

- Add up to 4 **moves** with **live search** and color-coded suggestions by type.
- Filter **base stats** (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) with "More than," "Equal to," or "Less than" conditions (0-300).
- Search by **ability** via text input and toggle **Alpha** variants with a checkbox.
- Select **types** with a visual picker and "At least one," "Exactly," or "Only" options.
- Generate a sortable **table** of matches—icons, names, abilities, types, and stats—with a reset button.

### **Type Coverage**

- Input a Pokémon name just like in the Capture Chance page, but with a larger selection of Pokémon. Once selected, it grabs their types and displays them beneath the Pokémon image in a type selector menu.
- Users can manually change the types to match a different Pokémon or even one that doesn't exist.
- Users can view the attacking and defending type coverage damage:
  - **Attacking Component**: Shows how a selected type (e.g., Water) interacts with other types when used as an attack.
  - **Defending Component**: Shows how other types' moves affect the selected type(s) when defending.
- Supports **dual typing**, where both types are combined and the defending coverage is calculated accordingly.
- A **type chart** is displayed with the first row showing defender types and the first column showing attacker types, with the corresponding damage rate for each interaction.
- **Hover and Click Interactions**: Hover over or click any table cell to highlight the row and column.
- **Flip Typing Button**: This button inverts type damage coverage, flipping the attack and defense interactions.
- The type coverage flip is also reflected in the attacking and defending components and the type chart.

## ⚙️ How It Works

### **Capture Chance**

1. The app fetches **Pokémon data** from **local JSON files**, filtering out ineligible Pokémon based on custom game-specific conditions.
2. Users select a Pokémon through a **live search suggestion box**.
3. Upon selection, the app retrieves **stats, image, and catch rate**, checking a separate JSON file for PokeMMO-specific rates.
4. If the Pokémon has an **Alpha** variant, a checkbox allows switching to its custom catch rate with a red aura effect.
5. Users enter **Level, HP percentage, or 1 HP mode**, which affects the calculation.
6. A **Status Condition** selector applies the respective multiplier.
7. A **Poké Ball selector** determines the ball's capture multiplier, considering conditions like fishing or Pokémon type.
8. The capture chance is calculated using Pokémon's **total HP, current HP, catch rate, status multiplier, and ball multiplier**.
9. **Live updates** ensure the capture chance adjusts immediately upon any user input change.
10. A **how it works** section to explain how the calculations are done.

### **Pokémon Search**

1. Users input up to 4 **moves** via a **live search box** with color-coded suggestions based on move type (e.g., "High Jump Kick").
2. Users filter **base stats** (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) by selecting "More than," "Equal to," or "Less than" and entering values (0-300) in a dropdown-input combo.
3. An **ability** is entered through a text input (e.g., "Levitate"), and an **Alpha checkbox** toggles inclusion of **Alpha** variants.
4. Users selects **types** from a visual picker, choosing "At least one," "Exactly," or "Only" to filter results.
5. Clicking "Search" fetches data from **local JSON files** and displays a **table** of matching Pokémon, including icons, names, abilities, types, and stats.
6. The **table** supports **sorting** by clicking column headers (ID, name, stats) for ascending or descending order, with a reset button to clear all inputs and results.

### **Type Coverage**

1. Users can input a Pokémon's name, and the app will provide suggestions.
2. Alternatively, users can click on type images from a type menu (up to 2 types). When a Pokémon is selected, the corresponding types are highlighted in the menu.
3. Users can also manually change the types in the menu to any desired combination, whether it's an existing Pokémon or a custom combination.
4. The attacking and defending type coverage damage calculations are displayed dynamically based on the selected types.
5. The type damage rates are shown in both the attacking and defending components, with the type chart also displaying the interactions.
6. Hover and click interactions allow users to highlight specific cells for quick reference.
7. The **Flip Typing Button** inverts type interactions (e.g., Water -> Fire becomes Fire -> Water).
8. Dual typing is supported, and both types are factored into the damage calculations.

## 🧑‍💻 Tech Stack

- **React:** Front-end framework for a dynamic user experience.
- **Vite:** Lightning-fast development environment.
- **TypeScript:** Ensures strong typing and better code maintainability.
- **CSS:** Custom styles with a dark theme and responsive design.
- **JSON:** Stores all Pokémon and game-specific data, including catch rates, evolutions, Poké Ball multipliers, etc.

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
- **Language selection** (Currently only English, with more planned in the future).

## 📢 Community & Support

- Join our **[Discord server](https://discord.com/invite/syryMAF4Kr)** for:
  - **Announcements** on updates and new tools.
  - **Suggestions** on new features.
  - **Bug reporting** to help improve the app.
  - **Art submissions** for background themes.

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).