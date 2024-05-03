import { z } from 'zod'
// user/store registration schema
export const RegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Name must be at least 3 characters long')
      .regex(/^[a-zA-Z\s]+$/, 'Name must only contain letters'),
    email: z.string().email().trim(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .regex(
        /^(?=.*\d)[a-zA-Z\d]+$/,
        'Password must contain at least one digit'
      ),
    confirmPassword: z.string(),
    mobile: z
      .string()
      .regex(
        /^[6-9][0-9]{9}$/,
        'Mobile should be 10 digits long and should start with a digit from 6 to 9'
      )
      .trim(),
    description: z
      .string()
      .max(300, 'Description must be less than 300 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// user/store login schema
export const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(12, 'enter a valid password')
    .trim(),
})

// store product schema
export const productSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  category: z
    .string()
    .regex(/^[a-zA-Z]*$/, 'Category must only contain letters'),
  brand: z
    .string()
    .regex(/^[a-zA-Z]*$/, 'Brand must only contain letters')
    .optional(),
  description: z.string().min(1, 'Product description required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid product price'),
  discount: z
    .string()
    .regex(
      /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
      'Valid discount required (0 to 100)'
    )
    .default('0'),
  stock: z
    .string()
    .regex(
      /^[1-9]\d{0,3}$/,
      "Stock should be positive and shouldn't exceed 4 digits"
    )
    .default('1'),
})

export const AddressSchema = z.object({
  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters long')
    .regex(
      /^[A-Za-z0-9\s,.]+$/,
      'Address must only contain alphanumeric characters, spaces, commas, and periods'
    ),
  street: z
    .string()
    .trim()
    .min(3, 'Street must be at least 3 characters long')
    .regex(
      /^[A-Za-z0-9\s]+$/,
      'Street must only contain alphanumeric characters and spaces'
    ),
  city: z
    .string()
    .trim()
    .min(3, 'City must be at least 3 characters long')
    .regex(/^[A-Za-z\s]+$/, 'City must only contain letters and spaces'),
  state: z
    .string()
    .trim()
    .min(3, 'State must be at least 3 characters long')
    .regex(/^[A-Za-z\s]+$/, 'State must only contain letters and spaces'),
  pin: z
    .string()
    .regex(
      /^(?=.*[1-9])[0-9]{6}$/,
      'PIN Code must be a 6-digit number starting with a non-zero digit'
    )
    .trim(),
})
