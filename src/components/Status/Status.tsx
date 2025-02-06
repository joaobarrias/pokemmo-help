// Component: Status.tsx
import React, { useEffect } from 'react';
import "./Status.css"; // Import CSS
import Select from 'react-select'; // Import react-select
import { status } from "../../data/status"; // Import status conditions

interface StatusProps {
  selectedStatus: any;
  setSelectedStatus: React.Dispatch<React.SetStateAction<any>>;
}

const Status: React.FC<StatusProps> = ({selectedStatus, setSelectedStatus}) => {

  // Set default status if not selected
  useEffect(() => {
    if (!selectedStatus) {
      setSelectedStatus(status[0]);  // Default to first status object
    }
  }, [selectedStatus, setSelectedStatus]);

  const handleStatusChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const statusObj = status.find((s) => s.name === selectedOption.value);
      setSelectedStatus(statusObj || status[0]);  // Default to first status if not found
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };
  
  return (
    <div className="status-section">
      <label htmlFor="status-select" className="status-label">Status</label>
      <Select
        id="status"
        value={{
          value: selectedStatus?.name || '', // The name from the object
          label: selectedStatus?.name || 'Status', // Label is the name as well
        }}
        onChange={handleStatusChange}
        options={status.map((s) => ({
          value: s.name,
          label: s.name,
        }))}
        className="status-select"
        classNamePrefix="react-select"
        isSearchable={false}
      />
      <p className="status-value">
        Multiplier: {selectedStatus?.multiplier || 1}x
      </p>
      <div className="status-icon">
        {selectedStatus?.icon && (
          <img
            src={selectedStatus.icon}
            alt={`${selectedStatus.name} icon`}
            className="status-image"
          />
        )}
      </div>
    </div>
  );
};

export default Status;
