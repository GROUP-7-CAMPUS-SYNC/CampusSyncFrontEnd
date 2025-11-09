import { useState, useEffect } from "react"
import type { TextFieldProps } from "../types/stringTextFiled"

export default function StringTextField({
  inputContainerDesign = "flex flex-col gap-1",
  inputDesign = "border border-gray-400 rounded-[5px] px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400",
  label,
  labelDesing = "text-sm text-gray-700",
  value,
  placeholder = "",
  onChange,
  type = "text",
  errorMessage = "",
  errorMessageDesign = "text-sm",
  name,
  disabled = false,
  required = false,
  maxLength,
  minLength,
  autoFocus = false,
  autoComplete = "off",
  iconLeft,
  iconLeftDesign = "flex items-center gap-2",
  iconRight,
  iconRightDesign = "",
  inputRef,
  showError: externalShowError = false, // from parent (optional)
}: TextFieldProps) {

  // 🔹 Local states for managing input and validation
  const [inputValue, setInputValue] = useState<string>(value)
  const [internalError, setInternalError] = useState<boolean>(false)

  // 🔹 Combined error state — internal + external
  const showError = internalError || externalShowError

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    onChange(e)

    // Hide error if user starts typing something valid
    if (required && val.trim() !== "") {
      setInternalError(false)
    }
  }

  // 🔹 Handle when input loses focus (onBlur)
  const handleBlur = () => {
    if (required && inputValue.trim() === "") {
      setInternalError(true)
    }
  }

  // 🔹 Keep value updated when parent changes it
  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className={inputContainerDesign}>
      {/* Label */}
      {label && (
        <label className={labelDesing} htmlFor={name}>
          {label}
        </label>
      )}

      {/* Input wrapper (icons + input field) */}
      <div className={iconLeftDesign}>
        {iconLeft && <span>{iconLeft}</span>}

        <input
          ref={inputRef}
          id={name}
          name={name}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className={`${inputDesign} ${
            showError ? "border-red-500 focus:ring-red-400" : ""
          }`}
          placeholder={placeholder}
          type={type}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        {iconRight && <span className={iconRightDesign}>{iconRight}</span>}
      </div>

      {/* Error message */}
      {/* {showError && (
        <p className={errorMessageDesign}>{errorMessage}</p>
      )} */}
      <p className={`${errorMessageDesign} ${showError ? "text-red-500" : "text-white"}` }>{errorMessage}</p>

    </div>
  )
}
