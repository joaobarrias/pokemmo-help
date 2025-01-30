// Status.tsx
import React from 'react';
import "./Status.css";
import Select from 'react-select'; // Import react-select
import { status } from "../../data/status"; // Import status conditions

interface StatusProps {
    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
}

const Status: React.FC<StatusProps> = ({selectedStatus, setSelectedStatus}) => {
    
const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    };

const selectedIcon = status.find((s) => s.name === selectedStatus)?.icon || "";
  

  return (
    <div className="status-section">
        <label className="status-label">
            Status
        </label>
        <Select
            id="status"
            value={{
            value: selectedStatus,
            label: selectedStatus,
            }}
            onChange={(option) => {
            if (option) setSelectedStatus(option.value);
            }}
            options={status.map((s) => ({
            value: s.name,
            label: s.name,
            }))}
            className="status-select"
            classNamePrefix="react-select"
            isSearchable={false}
        />
        <p className="status-value">
            Multiplier: {status.find((s) => s.name === selectedStatus)?.multiplier || 1}x
        </p>
        <div className="status-icon">
            {selectedStatus && status.find((s) => s.name === selectedStatus)?.icon && (
            <img
                src={status.find((s) => s.name === selectedStatus)?.icon || ""}
                alt={`${selectedStatus} icon`}
                className="status-image"
            />
            )}
        </div>
    </div>
  );
};

export default Status;
