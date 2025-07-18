import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  type = "input", 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error,
  placeholder,
  required = false,
  ...props 
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  if (type === "select") {
    return (
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        {...props}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  if (type === "textarea") {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
        )}
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex min-h-[80px] w-full rounded-lg border border-gray-600 bg-surface px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }

  return (
    <Input
      type={type}
      label={label}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      {...props}
    />
  );
};

export default FormField;