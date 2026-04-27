import { CreateFieldSchema, UpdateFieldSchema } from '@/lib/validators/field'

describe('Field Validators', () => {
  describe('CreateFieldSchema', () => {
    it('should validate a valid field', () => {
      const data = {
        type: 'TEXT' as const,
        label: 'Name',
        placeholder: 'Enter your name',
        required: true,
        order: 0,
        options: [],
      }

      const result = CreateFieldSchema.parse(data)
      expect(result).toEqual(data)
    })

    it('should reject an empty label', () => {
      const data = {
        type: 'TEXT' as const,
        label: '',
        required: false,
        order: 0,
      }

      expect(() => CreateFieldSchema.parse(data)).toThrow()
    })

    it('should default options to an empty array', () => {
      const data = {
        type: 'TEXT' as const,
        label: 'Name',
        required: false,
        order: 0,
      }

      const result = CreateFieldSchema.parse(data)
      expect(result.options).toEqual([])
    })

    it('should default required to false', () => {
      const data = {
        type: 'TEXT' as const,
        label: 'Name',
        order: 0,
      }

      const result = CreateFieldSchema.parse(data)
      expect(result.required).toBe(false)
    })
  })

  describe('UpdateFieldSchema', () => {
    it('should accept partial input', () => {
      const data = {
        label: 'Updated Name',
      }

      const result = UpdateFieldSchema.parse(data)
      expect(result).toEqual(data)
    })

    it('should accept empty object', () => {
      const data = {}

      const result = UpdateFieldSchema.parse(data)
      expect(result).toEqual({})
    })
  })
})
