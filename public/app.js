const { useState, useEffect, useCallback } = React;

const API_BASE = '/api';

// Default hero template
const defaultHero = {
  id: '',
  name: '',
  hp: 8,
  maxHp: 8,
  mp: 2,
  maxMp: 2,
  gold: 100,
  weapons: ['Dagger'],
  equippedWeapon: 'Dagger',
  armor: null,
  helmet: null,
  shield: null,
  items: [],
  portrait: 'default.png'
};

// Default heroes for new parties
const defaultHeroes = [
  {
    ...defaultHero,
    id: 'barbarian',
    name: 'Barbarian',
    hp: 8,
    maxHp: 8,
    mp: 2,
    maxMp: 2,
    weapons: ['Dagger'],
    equippedWeapon: 'Dagger',
    armor: null,
    shield: null,
    items: []
  },
  {
    ...defaultHero,
    id: 'dwarf',
    name: 'Dwarf',
    hp: 7,
    maxHp: 7,
    mp: 3,
    maxMp: 3,
    weapons: ['Dagger'],
    equippedWeapon: 'Dagger',
    armor: null,
    shield: null,
    items: []
  },
  {
    ...defaultHero,
    id: 'elf',
    name: 'Elf',
    hp: 6,
    maxHp: 6,
    mp: 4,
    maxMp: 4,
    weapons: ['Dagger'],
    equippedWeapon: 'Dagger',
    armor: null,
    items: []
  },
  {
    ...defaultHero,
    id: 'wizard',
    name: 'Wizard',
    hp: 4,
    maxHp: 4,
    mp: 6,
    maxMp: 6,
    weapons: ['Dagger'],
    equippedWeapon: 'Dagger',
    armor: null,
    items: []
  }
];

// Utility function to calculate derived stats
const calculateDerivedStats = (hero, items = {}) => {
  let attackDice = 1; // Base attack
  let defendDice = 2; // Base defend (fixed to 2)
  
  // Add equipped weapon modifiers
  if (hero.equippedWeapon && items.weapons) {
    const weapon = items.weapons.find(w => w.name === hero.equippedWeapon);
    if (weapon && weapon.modifiers.attackDice) {
      attackDice += weapon.modifiers.attackDice;
    }
  }
  
  // Add armor modifiers
  if (hero.armor && items.armor) {
    const armor = items.armor.find(a => a.name === hero.armor);
    if (armor && armor.modifiers.defendDice) {
      defendDice += armor.modifiers.defendDice;
    }
  }
  
  // Add shield modifiers
  if (hero.shield && items.shields) {
    const shield = items.shields.find(s => s.name === hero.shield);
    if (shield && shield.modifiers.defendDice) {
      defendDice += shield.modifiers.defendDice;
    }
  }
  
  // Add helmet modifiers
  if (hero.helmet && items.helmets) {
    const helmet = items.helmets.find(h => h.name === hero.helmet);
    if (helmet && helmet.modifiers.defendDice) {
      defendDice += helmet.modifiers.defendDice;
    }
  }
  
  return { attackDice, defendDice };
};

// Tooltip Component
const Tooltip = ({ children, content, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseEnter = (e) => {
    setIsVisible(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <div 
      className={`tooltip-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {isVisible && content && (
        <div 
          className="tooltip"
          style={{
            position: 'fixed',
            left: Math.min(position.x + 10, window.innerWidth - 300),
            top: Math.max(position.y - 10, 10),
            zIndex: 3000
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Equipment Selector Component
const EquipmentSelector = ({ type, items, onSelectItem, onClose, allowEmpty = true }) => {
  const getItemsByType = () => {
    if (!items[type]) return [];
    return items[type];
  };

  return (
    <div className="item-selector-overlay">
      <div className="item-selector">
        <div className="item-selector-header">
          <h3>Select {type.charAt(0).toUpperCase() + type.slice(0, -1)}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="item-selector-list">
          {allowEmpty && (
            <button
              className="item-selector-button empty-option"
              onClick={() => onSelectItem(null)}
            >
              Remove {type.slice(0, -1)}
            </button>
          )}
          {getItemsByType().map(item => (
            <Tooltip key={item.name} content={item.description}>
              <button
                className="item-selector-button"
                onClick={() => onSelectItem(item.name)}
              >
                {item.name}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

// Weapon Selector Component
const WeaponSelector = ({ items, onSelectItem, onClose }) => {
  const getWeapons = () => {
    if (!items.weapons) return [];
    return items.weapons;
  };

  return (
    <div className="item-selector-overlay">
      <div className="item-selector">
        <div className="item-selector-header">
          <h3>Select Weapon</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="item-selector-list">
          {getWeapons().map(weapon => (
            <Tooltip key={weapon.name} content={weapon.description}>
              <button
                className="item-selector-button"
                onClick={() => onSelectItem(weapon.name)}
              >
                {weapon.name}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

// Item Selector Component (only for consumable items)
const ItemSelector = ({ items, onSelectItem, onClose }) => {
  const getConsumableItems = () => {
    if (!items.items) return [];
    return items.items;
  };

  return (
    <div className="item-selector-overlay">
      <div className="item-selector">
        <div className="item-selector-header">
          <h3>Select Item</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="item-selector-list">
          {getConsumableItems().map(item => (
            <Tooltip key={item.name} content={item.description}>
              <button
                className="item-selector-button"
                onClick={() => onSelectItem(item.name)}
              >
                {item.name}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero Card Component
const HeroCard = ({ hero, onUpdate, items, isUpdated, partyName }) => {
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [showWeaponSelector, setShowWeaponSelector] = useState(false);
  const [showEquipmentSelector, setShowEquipmentSelector] = useState(null);
  const [imageError, setImageError] = useState(false);
  const derivedStats = calculateDerivedStats(hero, items);
  
  // Generate character image path using partyname_charactertype.jpg format
  const getCharacterImagePath = () => {
    return `/images/characters/${partyName}_${hero.id}.jpg`;
  };
  
  const updateStat = (stat, delta) => {
    const newValue = Math.max(0, hero[stat] + delta);
    if (stat === 'hp') {
      onUpdate({ ...hero, [stat]: Math.min(newValue, hero.maxHp) });
    } else if (stat === 'mp') {
      onUpdate({ ...hero, [stat]: Math.min(newValue, hero.maxMp) });
    } else {
      onUpdate({ ...hero, [stat]: newValue });
    }
  };
  
  const updateMaxStat = (stat, delta) => {
    const newValue = Math.max(1, hero[stat] + delta);
    const currentStat = stat.replace('max', '').toLowerCase();
    onUpdate({ 
      ...hero, 
      [stat]: newValue,
      [currentStat]: Math.min(hero[currentStat], newValue)
    });
  };

  const removeItem = (itemIndex) => {
    const newItems = hero.items.filter((_, index) => index !== itemIndex);
    onUpdate({ ...hero, items: newItems });
  };

  const addItem = (itemName) => {
    if (!hero.items.includes(itemName)) {
      onUpdate({ ...hero, items: [...hero.items, itemName] });
    }
    setShowItemSelector(false);
  };

  const removeWeapon = (weaponIndex) => {
    const weaponToRemove = hero.weapons[weaponIndex];
    const newWeapons = hero.weapons.filter((_, index) => index !== weaponIndex);
    
    // If removing the equipped weapon, equip the first remaining weapon or default to Dagger
    let newEquippedWeapon = hero.equippedWeapon;
    if (weaponToRemove === hero.equippedWeapon) {
      newEquippedWeapon = newWeapons.length > 0 ? newWeapons[0] : 'Dagger';
      if (newWeapons.length === 0) {
        newWeapons.push('Dagger');
      }
    }
    
    onUpdate({ ...hero, weapons: newWeapons, equippedWeapon: newEquippedWeapon });
  };

  const addWeapon = (weaponName) => {
    if (!hero.weapons.includes(weaponName)) {
      onUpdate({ ...hero, weapons: [...hero.weapons, weaponName] });
    }
    setShowWeaponSelector(false);
  };

  const equipWeapon = (weaponName) => {
    onUpdate({ ...hero, equippedWeapon: weaponName });
  };

  const updateEquipment = (type, itemName) => {
    onUpdate({ ...hero, [type]: itemName });
    setShowEquipmentSelector(null);
  };

  const throwWeapon = (weaponName) => {
    if (items.weapons) {
      const weapon = items.weapons.find(w => w.name === weaponName);
      if (weapon && weapon.throwable) {
        // Add to items and remove from weapons
        const newItems = [...hero.items];
        if (!newItems.includes(weaponName)) {
          newItems.push(weaponName);
        }
        
        const newWeapons = hero.weapons.filter(w => w !== weaponName);
        let newEquippedWeapon = hero.equippedWeapon;
        
        // If throwing the equipped weapon, equip another one
        if (weaponName === hero.equippedWeapon) {
          newEquippedWeapon = newWeapons.length > 0 ? newWeapons[0] : 'Dagger';
          if (newWeapons.length === 0) {
            newWeapons.push('Dagger');
          }
        }
        
        onUpdate({ 
          ...hero, 
          weapons: newWeapons, 
          equippedWeapon: newEquippedWeapon,
          items: newItems 
        });
      }
    }
  };

  const getItemDescription = (itemName) => {
    if (items.items) {
      const item = items.items.find(i => i.name === itemName);
      return item ? item.description : '';
    }
    return '';
  };

  const getWeaponDescription = (weaponName) => {
    if (items.weapons) {
      const weapon = items.weapons.find(w => w.name === weaponName);
      return weapon ? weapon.description : '';
    }
    return '';
  };
  
  return (
    <div className={`hero-card ${isUpdated ? 'updated' : ''}`}>
      <div className="hero-header">
        <div className="hero-portrait-container">
          {!imageError ? (
            <img 
              src={getCharacterImagePath()}
              alt={`${hero.name} portrait`}
              className="hero-portrait"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="hero-portrait-placeholder">
              <span className="portrait-icon">👤</span>
            </div>
          )}
        </div>
        <div className="hero-info">
          <div className="hero-name">{hero.name}</div>
          <div className="hero-class">{hero.id}</div>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <div className="stat-controls">
            <button className="stat-button" onClick={() => updateStat('hp', -1)}>−</button>
            <span className="stat-value">{hero.hp}/{hero.maxHp}</span>
            <button className="stat-button" onClick={() => updateStat('hp', 1)}>+</button>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">MP</span>
          <div className="stat-controls">
            <button className="stat-button" onClick={() => updateStat('mp', -1)}>−</button>
            <span className="stat-value">{hero.mp}/{hero.maxMp}</span>
            <button className="stat-button" onClick={() => updateStat('mp', 1)}>+</button>
          </div>
        </div>
        
        <div className="stat-row">
          <span className="stat-label">Gold</span>
          <div className="stat-controls">
            <button className="stat-button" onClick={() => updateStat('gold', -10)}>−</button>
            <span className="stat-value">{hero.gold}</span>
            <button className="stat-button" onClick={() => updateStat('gold', 10)}>+</button>
          </div>
        </div>
      </div>
      
      <div className="equipment-section">
        <div className="section-title">Equipment</div>
        <div className="equipment-grid">
          <Tooltip content={getWeaponDescription(hero.equippedWeapon)}>
            <div className="equipment-item">
              🗡️ {hero.equippedWeapon || 'No Weapon'} (Equipped)
            </div>
          </Tooltip>
          <div 
            className={`equipment-item ${!hero.armor ? 'empty' : ''} clickable`}
            onClick={() => setShowEquipmentSelector('armor')}
          >
            🛡️ {hero.armor || 'No Armor'}
          </div>
          <div 
            className={`equipment-item ${!hero.helmet ? 'empty' : ''} clickable`}
            onClick={() => setShowEquipmentSelector('helmets')}
          >
            ⛑️ {hero.helmet || 'No Helmet'}
          </div>
          <div 
            className={`equipment-item ${!hero.shield ? 'empty' : ''} clickable`}
            onClick={() => setShowEquipmentSelector('shields')}
          >
            🛡️ {hero.shield || 'No Shield'}
          </div>
        </div>
      </div>

      <div className="weapons-section">
        <div className="section-title">
          Weapons
          <button className="add-item-button" onClick={() => setShowWeaponSelector(true)}>+</button>
        </div>
        <div className="weapons-list">
          {hero.weapons.length === 0 ? (
            <span style={{ color: '#888', fontStyle: 'italic' }}>No weapons</span>
          ) : (
            hero.weapons.map((weapon, index) => (
              <div key={index} className="weapon-with-controls">
                <button className="remove-item-button" onClick={() => removeWeapon(index)}>−</button>
                <Tooltip content={getWeaponDescription(weapon)}>
                  <span 
                    className={`weapon-tag ${weapon === hero.equippedWeapon ? 'equipped' : ''}`}
                    onClick={() => equipWeapon(weapon)}
                  >
                    {weapon}
                    {weapon === hero.equippedWeapon && ' (E)'}
                  </span>
                </Tooltip>
                {items.weapons && items.weapons.find(w => w.name === weapon)?.throwable ? (
                  <button 
                    className="throw-weapon-button" 
                    onClick={() => throwWeapon(weapon)}
                    title="Throw weapon"
                  >
                    ↗
                  </button>
                ) : (
                  <button className="item-spacer">+</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="items-section">
        <div className="section-title">
          Items
          <button className="add-item-button" onClick={() => setShowItemSelector(true)}>+</button>
        </div>
        <div className="items-list">
          {hero.items.length === 0 ? (
            <span style={{ color: '#888', fontStyle: 'italic' }}>No items</span>
          ) : (
            hero.items.map((item, index) => (
              <div key={index} className="item-with-controls">
                <button className="remove-item-button" onClick={() => removeItem(index)}>−</button>
                <Tooltip content={getItemDescription(item)}>
                  <span className="item-tag">{item}</span>
                </Tooltip>
                <button className="item-spacer">+</button>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="derived-stats">
        <div className="derived-stat">
          <div className="derived-stat-label">Attack</div>
          <div className="derived-stat-value">{derivedStats.attackDice}🎲</div>
        </div>
        <div className="derived-stat">
          <div className="derived-stat-label">Defend</div>
          <div className="derived-stat-value">{derivedStats.defendDice}🎲</div>
        </div>
      </div>

      {showItemSelector && (
        <ItemSelector
          items={items}
          onSelectItem={addItem}
          onClose={() => setShowItemSelector(false)}
        />
      )}

      {showWeaponSelector && (
        <WeaponSelector
          items={items}
          onSelectItem={addWeapon}
          onClose={() => setShowWeaponSelector(false)}
        />
      )}

      {showEquipmentSelector && (
        <EquipmentSelector
          type={showEquipmentSelector}
          items={items}
          onSelectItem={(itemName) => updateEquipment(showEquipmentSelector.slice(0, -1), itemName)}
          onClose={() => setShowEquipmentSelector(null)}
          allowEmpty={true}
        />
      )}
    </div>
  );
};

// Character Naming Component
const CharacterNaming = ({ partyName, onCreateParty, onCancel }) => {
  const [heroNames, setHeroNames] = useState({
    barbarian: 'Barbarian',
    dwarf: 'Dwarf', 
    elf: 'Elf',
    wizard: 'Wizard'
  });
  
  const updateHeroName = (heroId, name) => {
    setHeroNames(prev => ({
      ...prev,
      [heroId]: name
    }));
  };
  
  const handleCreateParty = () => {
    const customHeroes = defaultHeroes.map(hero => ({
      ...hero,
      name: heroNames[hero.id] || hero.name
    }));
    onCreateParty(partyName, customHeroes);
  };
  
  return (
    <div className="character-naming">
      <h2>Name Your Heroes</h2>
      <p>Party: {partyName}</p>
      
      <div className="heroes-naming-grid">
        {defaultHeroes.map(hero => (
          <div key={hero.id} className="hero-naming-card">
            <div className="hero-class-title">{hero.id.charAt(0).toUpperCase() + hero.id.slice(1)}</div>
            <input
              type="text"
              value={heroNames[hero.id]}
              onChange={(e) => updateHeroName(hero.id, e.target.value)}
              className="hero-name-input"
              placeholder={`Enter ${hero.id} name...`}
            />
          </div>
        ))}
      </div>
      
      <div className="naming-buttons">
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="create-party-button" onClick={handleCreateParty}>
          Create Party
        </button>
      </div>
    </div>
  );
};

// Party Selection Component
const PartySelection = ({ parties, onSelectParty, onStartCreateParty }) => {
  const [newPartyName, setNewPartyName] = useState('');
  
  const handleStartCreateParty = (e) => {
    e.preventDefault();
    if (newPartyName.trim()) {
      onStartCreateParty(newPartyName.trim());
      setNewPartyName('');
    }
  };
  
  return (
    <div className="party-selection">
      <h2>Select a Party</h2>
      <div className="party-list">
        {parties.map(partyName => (
          <button
            key={partyName}
            className="party-button"
            onClick={() => onSelectParty(partyName)}
          >
            {partyName}
          </button>
        ))}
      </div>
      
      <form className="new-party-form" onSubmit={handleStartCreateParty}>
        <input
          type="text"
          placeholder="New party name..."
          value={newPartyName}
          onChange={(e) => setNewPartyName(e.target.value)}
          className="new-party-input"
        />
        <button type="submit" className="create-party-button">
          Create Party
        </button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  const [parties, setParties] = useState([]);
  const [currentParty, setCurrentParty] = useState(null);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedHeroes, setUpdatedHeroes] = useState(new Set());
  const [saveStatus, setSaveStatus] = useState('');
  const [namingParty, setNamingParty] = useState(null);
  
  // Load parties and items on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [partiesResponse, itemsResponse] = await Promise.all([
          fetch(`${API_BASE}/parties`),
          fetch(`${API_BASE}/items`)
        ]);
        
        if (!partiesResponse.ok || !itemsResponse.ok) {
          throw new Error('Failed to load initial data');
        }
        
        const partiesData = await partiesResponse.json();
        const itemsData = await itemsResponse.json();
        
        setParties(partiesData);
        setItems(itemsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Load party data
  const loadParty = async (partyName) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/party/${partyName}`);
      
      if (!response.ok) {
        throw new Error('Failed to load party');
      }
      
      const partyData = await response.json();
      
      // Migrate old party data to new weapons system
      const migratedHeroes = partyData.heroes.map(hero => {
        if (hero.weapon && !hero.weapons) {
          return {
            ...hero,
            weapons: [hero.weapon],
            equippedWeapon: hero.weapon
          };
        }
        return hero;
      });
      
      setCurrentParty({ ...partyData, heroes: migratedHeroes });
      setUpdatedHeroes(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Start create party (go to naming screen)
  const startCreateParty = (partyName) => {
    setNamingParty(partyName);
  };

  // Create new party with custom heroes
  const createParty = async (partyName, customHeroes = defaultHeroes) => {
    try {
      const newParty = {
        name: partyName,
        heroes: customHeroes
      };
      
      const response = await fetch(`${API_BASE}/party/${partyName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newParty)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create party');
      }
      
      setParties([...parties, partyName]);
      setCurrentParty(newParty);
      setUpdatedHeroes(new Set());
      setNamingParty(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Cancel party creation
  const cancelPartyCreation = () => {
    setNamingParty(null);
  };
  
  // Update hero
  const updateHero = (updatedHero) => {
    if (!currentParty) return;
    
    const updatedHeroes = currentParty.heroes.map(hero =>
      hero.id === updatedHero.id ? updatedHero : hero
    );
    
    setCurrentParty({
      ...currentParty,
      heroes: updatedHeroes
    });
    
    setUpdatedHeroes(prev => new Set([...prev, updatedHero.id]));
    
    // Auto-save after 2 seconds of inactivity
    setTimeout(() => {
      saveParty();
    }, 2000);
  };
  
  // Save party
  const saveParty = async () => {
    if (!currentParty) return;
    
    try {
      setSaveStatus('Saving...');
      const response = await fetch(`${API_BASE}/party/${currentParty.name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentParty)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save party');
      }
      
      setSaveStatus('Saved!');
      setUpdatedHeroes(new Set());
      
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('Save failed!');
      setError(err.message);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };
  
  // Back to party selection
  const backToPartySelection = () => {
    setCurrentParty(null);
    setUpdatedHeroes(new Set());
  };
  
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading HeroQuest Companion...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
        <button 
          className="party-button" 
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="container">
      {!currentParty && (
        <div className="header">
          <h1>HeroQuest Companion</h1>
        </div>
      )}
      
      {saveStatus && (
        <div className={`autosave-indicator ${!saveStatus ? 'hidden' : ''}`}>
          {saveStatus}
        </div>
      )}
      
      {namingParty ? (
        <CharacterNaming
          partyName={namingParty}
          onCreateParty={createParty}
          onCancel={cancelPartyCreation}
        />
      ) : !currentParty ? (
        <PartySelection
          parties={parties}
          onSelectParty={loadParty}
          onStartCreateParty={startCreateParty}
        />
      ) : (
        <>
          <button className="floating-back-button" onClick={backToPartySelection}>
            ←
          </button>
          
          <div className="heroes-grid">
            {currentParty.heroes.map(hero => (
              <HeroCard
                key={hero.id}
                hero={hero}
                onUpdate={updateHero}
                items={items}
                isUpdated={updatedHeroes.has(hero.id)}
                partyName={currentParty.name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
