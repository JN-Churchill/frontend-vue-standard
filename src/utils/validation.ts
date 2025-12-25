import { configure, defineRule } from 'vee-validate'

/**
 * Configure VeeValidate
 */
export function setupValidation() {
  // Set default configuration
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  })

  // Define required rule
  defineRule('required', (value: any) => {
    if (!value || !value.length) {
      return 'This field is required'
    }
    return true
  })

  // Define email rule
  defineRule('email', (value: string) => {
    if (!value || !value.length) {
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return true
  })

  // Define phone rule
  defineRule('phone', (value: string) => {
    if (!value || !value.length) {
      return true
    }
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      return 'Please enter a valid phone number'
    }
    return true
  })

  // Define min length rule
  defineRule('minLength', (value: string, [min]: [number]) => {
    if (!value || !value.length) {
      return true
    }
    if (value.length < min) {
      return `Length cannot be less than ${min} characters`
    }
    return true
  })

  // Define max length rule
  defineRule('maxLength', (value: string, [max]: [number]) => {
    if (!value || !value.length) {
      return true
    }
    if (value.length > max) {
      return `Length cannot exceed ${max} characters`
    }
    return true
  })

  // Define pattern rule
  defineRule('pattern', (value: string, [pattern]: [string | RegExp]) => {
    if (!value || !value.length) {
      return true
    }
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    if (!regex.test(value)) {
      return 'Format is invalid'
    }
    return true
  })

  // Define confirmed rule (for password confirmation)
  defineRule('confirmed', (value: string, [target]: [string]) => {
    if (value === target) {
      return true
    }
    return 'The confirmation does not match'
  })
}
