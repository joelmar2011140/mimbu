import React from 'react';
import { UseFormRegister } from 'react-hook-form'

interface InputProps {
  label: string
  placeholder: string
  type: string
  required?: boolean
  register: UseFormRegister<any>
  name: string
}

function Input({ label, placeholder, type, register, required, name }: InputProps) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={label} className="mb-2 text-lg font-medium">
        {label}
      </label>
      {
        type === 'file' ? (
          <input accept='image/*' type="file" {...register(name, { required })} id="image" className="appearance-none text-gray-700 leading-tight focus:shadow-outline border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
        ) : (
          <input
            type={type}
            id={label}
            placeholder={placeholder}
            className="border-2 border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            {...register(name, { required })}
          />
        )
      }

    </div>
  );
}


export default Input