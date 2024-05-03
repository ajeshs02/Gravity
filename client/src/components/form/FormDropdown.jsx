import { Controller } from 'react-hook-form'
import Select from 'react-dropdown-select'
import { useEffect, useState } from 'react'
import { createCategory, getCategory } from '../../api/store'

// Your custom dropdown component
const FormDropdown = ({ control, name, label, error, setError }) => {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchCategories = async (type) => {
      const data = await getCategory(type)
      if (data.success) {
        let formattedCategories = data.categories.map((category) => ({
          value: category.name.toLowerCase(),
          label: category.name.toLowerCase(),
        }))
        setOptions(formattedCategories)
      } else {
        alert('Error fetching categories')
      }
    }

    fetchCategories(name)
  }, [])

  const handleAddCategory = async (category, name) => {
    const categoryRegex = /^[a-zA-Z]{3,10}$/
    if (!categoryRegex.test(category)) {
      setError(name, {
        type: 'manual',
        message: 'Enter a valid category',
      })
      return
    }
    const data = await createCategory(category, name)

    if (data.success) {
      const { name } = data.newCategories
      setOptions([
        ...options,
        {
          value: name.toLowerCase().trim(),
          label: name.toLowerCase().trim(),
        },
      ])
    } else {
      alert('Error adding categories')
    }
  }

  return (
    <div className="mb-3">
      <label>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            options={options}
            values={
              field.value ? [{ value: field.value, label: field.value }] : []
            }
            onChange={(value) => {
              if (Array.isArray(value) && value.length > 0) {
                field.onChange(value[0].value)
              }
            }}
            style={{
              borderRadius: '5px',
              borderColor: '#ee6d4d60',
              colors: {
                controlColor: '#ee6d4d60',
                textColor: '#000000',
                dropdownHoverColor: '#ee6d4d60',
                optionFocusedColor: '#ee6d4d60',
              },
            }}
            className="w-full  border  outline-gray-500 border-gray-500/20 my-1 py-[10px] px-3 rounded-xl  bg-gray-100 text-sm text-black font-semibold focus:outline  outline-2 placeholder:text-gray-400 focus:outline-sAccent border-sAccent ring-sAccent"
            required={true}
            placeholder={'search...'}
            create={true}
            onCreateNew={(item) => {
              handleAddCategory(item.value, name)
            }}
          />
        )}
      />
      {error && (
        <span className="text-sm font-medium text-red-500 leading-1 italic ">
          {error.message}
        </span>
      )}
    </div>
  )
}

export default FormDropdown
