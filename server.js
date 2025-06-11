const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// API Routes

// GET /api/parties - return list of saved party names
app.get('/api/parties', (req, res) => {
  try {
    const files = fs.readdirSync(dataDir);
    const partyNames = files
      .filter(file => file.endsWith('.json'))
      .map(file => path.basename(file, '.json'));
    res.json(partyNames);
  } catch (error) {
    console.error('Error reading parties:', error);
    res.status(500).json({ error: 'Failed to read parties' });
  }
});

// GET /api/party/:name - load specific party JSON
app.get('/api/party/:name', (req, res) => {
  try {
    const partyName = req.params.name;
    const filePath = path.join(dataDir, `${partyName}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Party not found' });
    }
    
    const partyData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(partyData);
  } catch (error) {
    console.error('Error reading party:', error);
    res.status(500).json({ error: 'Failed to read party data' });
  }
});

// POST /api/party/:name - save updated party JSON
app.post('/api/party/:name', (req, res) => {
  try {
    const partyName = req.params.name;
    const partyData = req.body;
    const filePath = path.join(dataDir, `${partyName}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(partyData, null, 2));
    res.json({ message: 'Party saved successfully' });
  } catch (error) {
    console.error('Error saving party:', error);
    res.status(500).json({ error: 'Failed to save party data' });
  }
});

// GET /api/items - list all available items and their modifiers
app.get('/api/items', (req, res) => {
  try {
    const itemsPath = path.join(__dirname, 'data', 'items.json');
    if (!fs.existsSync(itemsPath)) {
      // Return default items if file doesn't exist
      const defaultItems = {
        weapons: [
          { name: "Dagger", type: "weapon", modifiers: { attackDice: 1 } },
          { name: "Shortsword", type: "weapon", modifiers: { attackDice: 2 } },
          { name: "Broadsword", type: "weapon", modifiers: { attackDice: 3 } },
          { name: "Longsword", type: "weapon", modifiers: { attackDice: 3 } }
        ],
        armor: [
          { name: "Cloth", type: "armor", modifiers: { defendDice: 1 } },
          { name: "Leather", type: "armor", modifiers: { defendDice: 1 } },
          { name: "Chainmail", type: "armor", modifiers: { defendDice: 2 } },
          { name: "Plate", type: "armor", modifiers: { defendDice: 3 } }
        ],
        shields: [
          { name: "Shield", type: "shield", modifiers: { defendDice: 1 } },
          { name: "Large Shield", type: "shield", modifiers: { defendDice: 2 } }
        ],
        helmets: [
          { name: "Helmet", type: "helmet", modifiers: { defendDice: 1 } }
        ],
        items: [
          { name: "Potion of Healing", type: "consumable", modifiers: { healing: 6 } },
          { name: "Holy Water", type: "consumable", modifiers: { undead_damage: 3 } },
          { name: "Rope", type: "utility", modifiers: {} },
          { name: "Torch", type: "utility", modifiers: {} }
        ]
      };
      return res.json(defaultItems);
    }
    
    const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
    res.json(itemsData);
  } catch (error) {
    console.error('Error reading items:', error);
    res.status(500).json({ error: 'Failed to read items data' });
  }
});

// Serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HeroQuest Companion server running on http://localhost:${PORT}`);
});
