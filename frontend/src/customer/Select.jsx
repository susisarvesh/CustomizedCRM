import React from 'react';

export const Select = ({ value, onChange, children, ...props }) => {
  return (
    <select value={value} onChange={onChange} {...props}>
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }) => {
  return <div className="select-trigger">{children}</div>;
};

export const SelectContent = ({ children }) => {
  return <div className="select-content">{children}</div>;
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export const SelectValue = ({ placeholder }) => {
  return <option disabled value="">{placeholder}</option>;
};
