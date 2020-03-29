import React from "react";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const Input = ({
  id,
  defaultValue = null,
  value,
  select,
  options,
  required = false,
  labelText,
  helperText = "Bitte ausfüllen",
  handleChange,
  errors,
  size = "small",
  fullWidth = false,
  multiline = false,
  rows = null
}) => {
  let error = false;
  if (errors.includes(id)) {
    error = true;
  }

  let valueOrDefault = {};
  if (value) {
    valueOrDefault.value = value;
  } else if (defaultValue) {
    valueOrDefault.defaultValue = defaultValue;
  }

  return (
    <TextField
      id={id}
      select={select}
      {...valueOrDefault}
      required={required}
      label={labelText}
      helperText={error ? helperText : null}
      onChange={handleChange}
      error={error}
      fullWidth={fullWidth}
      size={size}
      multiline={multiline}
      rows={rows}
      inputProps={{
        name: id
      }}
    >
      {select && options && options.length
        ? options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))
        : null}
    </TextField>
  );
};

export default Input;