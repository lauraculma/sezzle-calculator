import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import App from './App'

describe('Calculator', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the calculator interface', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Calculadora' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /calcular resultado/i })).toBeInTheDocument()
  })

  it('sends numbers to the API and displays the result', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 15 }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Primer número' }), {
      target: { value: '10' },
    })

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Segundo número' }), {
      target: { value: '5' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/calculate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ operation: 'add', a: 10, b: 5 }),
      }),
    )

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  it('shows an error when the API rejects the operation', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'division by zero is not allowed' }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Primer número' }), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Segundo número' }), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Operación' }), {
      target: { value: 'divide' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(screen.getByText(/division by zero/i)).toBeInTheDocument()
    })
  })

  it('shows an error when the API cannot be reached', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    render(<App />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Primer número' }), {
      target: { value: '10' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Segundo número' }), {
      target: { value: '5' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(screen.getByText(/network error|error/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when fields are empty', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('calculates power correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 8 }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Primer número' }), {
      target: { value: '2' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Segundo número' }), {
      target: { value: '3' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Operación' }), {
      target: { value: 'power' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(screen.getByText('8')).toBeInTheDocument()
    })
  })

  it('calculates square root correctly with one input', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 3 }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByRole('combobox', { name: 'Operación' }), {
      target: { value: 'sqrt' },
    })

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Número' }), {
      target: { value: '9' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:8080/api/calculate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ operation: 'sqrt', a: 9, b: 0 }),
      }),
    )

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('calculates percentage correctly', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 25 }),
    } as Response)

    render(<App />)

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Primer número' }), {
      target: { value: '25' },
    })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Segundo número' }), {
      target: { value: '100' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Operación' }), {
      target: { value: 'percentage' },
    })

    fireEvent.click(screen.getByRole('button', { name: /calcular resultado/i }))

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })
})
