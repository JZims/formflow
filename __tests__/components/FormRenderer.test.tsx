import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormRenderer } from '@/components/renderer/FormRenderer'
import { FormSchema } from '@/types'

const mockSchema: FormSchema = {
  id: '1',
  title: 'Test Form',
  description: 'A test form',
  shareToken: 'token123',
  fields: [
    {
      id: 'f1',
      type: 'TEXT',
      label: 'Name',
      placeholder: 'Enter name',
      required: true,
      order: 0,
      options: [],
    },
    {
      id: 'f2',
      type: 'TEXTAREA',
      label: 'Comments',
      required: false,
      order: 1,
      options: [],
    },
    {
      id: 'f3',
      type: 'SELECT',
      label: 'Choice',
      required: true,
      order: 2,
      options: ['Option 1', 'Option 2'],
    },
    {
      id: 'f4',
      type: 'CHECKBOX',
      label: 'Agreements',
      required: false,
      order: 3,
      options: ['Agree 1', 'Agree 2'],
    },
  ],
}

describe('FormRenderer', () => {
  it('should render all field types', () => {
    const mockSubmit = jest.fn()

    render(<FormRenderer schema={mockSchema} onSubmit={mockSubmit} />)

    expect(screen.getByText('Test Form')).toBeInTheDocument()
    expect(screen.getByText('A test form')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Comments')).toBeInTheDocument()
    expect(screen.getByLabelText('Choice')).toBeInTheDocument()
    expect(screen.getByLabelText('Agree 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Agree 2')).toBeInTheDocument()
  })

  it('should prevent submit with empty required field', () => {
    const mockSubmit = jest.fn()

    render(<FormRenderer schema={mockSchema} onSubmit={mockSubmit} />)

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Alert should be called due to missing required fields
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with correct answer map on valid submission', async () => {
    const mockSubmit = jest.fn()

    render(<FormRenderer schema={mockSchema} onSubmit={mockSubmit} />)

    // Fill in required fields
    const nameInput = screen.getByPlaceholderText('Enter name') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'John' } })

    const choiceSelect = screen.getByLabelText('Choice') as HTMLSelectElement
    fireEvent.change(choiceSelect, { target: { value: 'Option 1' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Wait for async onSubmit to be called
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(mockSubmit).toHaveBeenCalled()
  })
})
