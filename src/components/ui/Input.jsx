import './Input.css';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          className="input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input;
