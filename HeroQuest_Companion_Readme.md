# HeroQuest Companion App

A local web-based HeroQuest companion app designed for family game nights. This app runs from a local Node.js server and is accessed via a browser on an iPad or MacBook, which can be mirrored to a TV using AirPlay. The interface is optimized for touch and displays all four party members simultaneously in a 4-up layout.

---

## ✅ Purpose

- Show all 4 party members on screen at once in a **4-up layout** (each occupying 1/4 of a 16:9 screen, horizontally)
- Controlled via **touch** on an iPad or MacBook, **displayed on a TV**

---

## 🔧 Technical Requirements

### 🛠 Backend

- **Node.js + Express**
- Store party data in **JSON files on disk** under `/data/`
- Serve frontend from `/public/`
- API Routes:
  - `GET /api/parties` — return list of saved party names
  - `GET /api/party/:name` — load specific party JSON
  - `POST /api/party/:name` — save updated party JSON
  - `GET /api/items` — list all available items and their modifiers

---

## 🧠 Data Models

### Party JSON
```json
{
  "name": "family_party",
  "heroes": [
    {
      "id": "barbarian",
      "name": "Barbarian",
      "hp": 7,
      "maxHp": 8,
      "mp": 2,
      "maxMp": 2,
      "gold": 250,
      "weapon": "Broadsword",
      "armor": "Chainmail",
      "helmet": null,
      "shield": "Shield",
      "items": ["Potion of Healing"],
      "portrait": "barbarian.png"
    }
  ]
}
```

### Items JSON
```json
{
  "name": "Shield",
  "type": "shield",
  "modifiers": {
    "defendDice": 1
  }
}
```

---

## 🎨 Frontend Requirements

- Built with **React**, optimized for mobile/touch interaction
- On load: show list of parties from `GET /api/parties`
- Selecting a party loads a 4-up dashboard showing all heroes
- Each panel shows:
  - HP / MP with +/− controls
  - Gold with +/− controls
  - Equipment (weapon, armor, helmet, shield)
  - Item inventory
  - Derived stats (attack and defend dice)
- Auto-save or Save button supported
- Use icons where possible to conserve space

---

## 🧾 Nice-to-Haves

- Highlight updated hero panels
- Autosave timestamp
- Clean visual style (e.g., parchment/board game theme)

---

## 🚀 Getting Started

```bash
npm install
npm start
```

- Open your browser on iPad or MacBook to view the app
- Mirror screen to TV using AirPlay

---

## License

This project is for personal/family use and is designed to enhance tabletop game experiences.
