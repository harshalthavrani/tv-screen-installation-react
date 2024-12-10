import React from "react";
import "../ToggleButtonGroup.css"; // Add a CSS file for styling

const ToggleButtonGroup = ({ options, selectedOption, onOptionChange }) => {
  return (
    <div className="toggle-button-group">
      {options.map((option) => (
        <button
          key={option}
          className={`toggle-button ${selectedOption === option ? "selected" : ""}`}
          onClick={() => onOptionChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtonGroup;
