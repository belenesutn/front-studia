import React from 'react';
import Select from 'react-select';


export default ({options, onChange}) => (
  <Select
    isMulti
    name="selector"
    onChange={(e) => onChange(e)}
    options={options} 
    className="basic-multi-select"
    classNamePrefix="select"
  />
);