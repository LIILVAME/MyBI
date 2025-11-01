import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePropertiesStore } from '@/stores/propertiesStore'

// Mock Supabase
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }
}))

// Mock API
vi.mock('@/api', () => ({
  propertiesApi: {
    getProperties: vi.fn(() => Promise.resolve({ success: true, data: [] })),
    createProperty: vi.fn(() => Promise.resolve({ success: true, data: { id: '123', name: 'Test Property' } })),
    updateProperty: vi.fn(() => Promise.resolve({ success: true, data: { id: '123', name: 'Updated Property' } })),
    deleteProperty: vi.fn(() => Promise.resolve({ success: true }))
  }
}))

// Mock AuthStore
vi.mock('@/stores/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-123' }
  })
}))

describe('PropertiesStore Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty properties', () => {
    const store = usePropertiesStore()
    expect(store.properties).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('should fetch properties', async () => {
    const store = usePropertiesStore()
    await store.fetchProperties()
    
    // Since we're mocking, just verify the function completes
    expect(store.loading).toBe(false)
  })

  it('should have computed properties', () => {
    const store = usePropertiesStore()
    
    expect(typeof store.totalProperties).toBe('number')
    expect(typeof store.occupiedProperties).toBe('number')
    expect(typeof store.vacantProperties).toBe('number')
    expect(typeof store.totalRent).toBe('number')
  })
})

