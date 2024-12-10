import React from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';

const DropdownMenus = ({
  screenOptions,
  mountOptions,
  mediaPlayerOptions,
  receptacleBoxOptions,
  onScreenChange,
  setMountType,
  setMediaPlayer,
  setReceptacleBox,
  orientation,
  setOrientation,
  installationType,
  setInstallationType,
  floorDistance,
  setFloorDistance,
  nicheDepth,
  setNicheDepth
}) => {
  return (
    <div className="dropdown-menus">
      <div className="input-row">
        <label>Screen Model:</label>
        <select onChange={(e) => onScreenChange(screenOptions[e.target.value])}>
          <option value="">Select a Screen Model</option>
          {screenOptions.map((screen, index) => (
            <option key={index} value={index}>
              {screen["Screen MFR"]}
            </option>
          ))}
        </select>
      </div>
      <div className="input-row">
        <label>Mount Type:</label>
        <select onChange={(e) => setMountType(e.target.value)}>
          <option value="">Select a Mount Type</option>
          {mountOptions.map((mount, index) => (
            <option key={index} value={index}>
              {mount["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>
      <div className="input-row">
        <label>Media Player:</label>
        <select onChange={(e) => setMediaPlayer(e.target.value)}>
          <option value="">Select a Media Player</option>
          {mediaPlayerOptions.map((player, index) => (
            <option key={index} value={index}>
              {player["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>
      <div className="input-row">
        <label>Receptacle Box:</label>
        <select onChange={(e) => setReceptacleBox(e.target.value)}>
          <option value="">Select a Receptacle Box</option>
          {receptacleBoxOptions.map((box, index) => (
            <option key={index} value={index}>
              {box["MFG. PART"]}
            </option>
          ))}
        </select>
      </div>
      <ToggleButtonGroup
        options={["Horizontal", "Vertical"]}
        selectedOption={orientation}
        onOptionChange={setOrientation}
      />
      <ToggleButtonGroup
        options={["Flat Wall", "Niche"]}
        selectedOption={installationType}
        onOptionChange={setInstallationType}
      />
      <div className="input-row">
        <label>Floor Distance (inches):</label>
        <input
          type="number"
          value={floorDistance}
          onChange={(e) => setFloorDistance(Number(e.target.value))}
        />
      </div>
      <div className="input-row">
        <label>Niche Depth Variance (inches):</label>
        <input
          type="number"
          value={nicheDepth}
          onChange={(e) => setNicheDepth(Number(e.target.value))}
          step="0.1"
          min="0"
        />
      </div>
    </div>
  );
};

export default DropdownMenus;

