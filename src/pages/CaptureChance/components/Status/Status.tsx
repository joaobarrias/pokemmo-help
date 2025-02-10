// Component: Status.tsx
import React, { useEffect } from 'react';
import "./Status.css"; // Import CSS
import Select from 'react-select'; // Import react-select
import statusData from "../../../../data/status-condition.json"; // Import status conditions

interface StatusProps {
  selectedStatus: any;
  setSelectedStatus: React.Dispatch<React.SetStateAction<any>>;
}

const Status: React.FC<StatusProps> = ({ selectedStatus, setSelectedStatus }) => {
  // Set default status if not selected
  useEffect(() => {
    if (!selectedStatus) {
      setSelectedStatus(statusData["None"]);  // Default to first status object
    }
  }, [selectedStatus, setSelectedStatus]);

  const handleStatusChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      const statusObj = statusData[selectedOption.value as keyof typeof statusData];
      setSelectedStatus(statusObj || statusData["None"]);  // Default to "None" if not found
    }
  };

  // Get the current status name to pass to the Select component
  const currentStatusName = selectedStatus 
    ? (Object.keys(statusData).find((status) => statusData[status as keyof typeof statusData] === selectedStatus) || 'None') 
    : 'None';

  return (
    <div className="status-section">
      <label htmlFor="status-select" className="status-label">Status</label>
      <Select
        id="status"
        value={{
          value: currentStatusName,  // Set the selected status name
          label: currentStatusName,  // Set the label to the status name
        }}
        onChange={handleStatusChange}
        options={Object.keys(statusData).map((statusName) => ({
          value: statusName,
          label: statusName,
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
            alt={`${selectedStatus} icon`}
            className="status-image"
          />
        )}
      </div>
    </div>
  );
};

export default Status;
