import { create } from 'zustand'
import { SharedTestDataItem, TestDataScope } from '@/types/common.types'

interface TestDataState {
  sharedData: SharedTestDataItem[]
  
  // Actions
  getSharedData: (key: string) => SharedTestDataItem | undefined
  getSharedDataBySource: (sourceTestId: string) => SharedTestDataItem[]
  setSharedData: (
    key: string, 
    value: any, 
    description?: string, 
    sourceTestId?: string
  ) => string
  updateSharedData: (id: string, value: any) => void
  deleteSharedData: (id: string) => void
  clearSharedData: (sourceTestId?: string) => void
  
  // Data access for dependent tests
  getValueByKey: (key: string) => any
  getAllDataAsObject: () => Record<string, any>
}

export const useTestDataStore = create<TestDataState>((set, get) => ({
  sharedData: [],
  
  getSharedData: (key: string) => {
    const { sharedData } = get()
    return sharedData.find(item => item.key === key)
  },
  
  getSharedDataBySource: (sourceTestId: string) => {
    const { sharedData } = get()
    return sharedData.filter(item => item.sourceTestId === sourceTestId)
  },
  
  setSharedData: (key: string, value: any, description?: string, sourceTestId?: string) => {
    const { sharedData } = get()
    const now = new Date().toISOString()
    const id = `data-${Date.now()}`
    
    // Check if data with this key already exists
    const existingIndex = sharedData.findIndex(item => item.key === key)
    
    if (existingIndex >= 0) {
      // Update existing data
      const updatedData = [...sharedData]
      updatedData[existingIndex] = {
        ...updatedData[existingIndex],
        value,
        description: description || updatedData[existingIndex].description,
        sourceTestId: sourceTestId || updatedData[existingIndex].sourceTestId,
        updatedAt: now
      }
      
      set({ sharedData: updatedData })
      return updatedData[existingIndex].id
    } else {
      // Create new data
      const newDataItem: SharedTestDataItem = {
        id,
        key,
        value,
        description,
        sourceTestId,
        createdAt: now,
        updatedAt: now
      }
      
      set({ sharedData: [...sharedData, newDataItem] })
      return id
    }
  },
  
  updateSharedData: (id: string, value: any) => {
    const { sharedData } = get()
    const now = new Date().toISOString()
    
    const updatedData = sharedData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          value,
          updatedAt: now
        }
      }
      return item
    })
    
    set({ sharedData: updatedData })
  },
  
  deleteSharedData: (id: string) => {
    const { sharedData } = get()
    set({ sharedData: sharedData.filter(item => item.id !== id) })
  },
  
  clearSharedData: (sourceTestId?: string) => {
    const { sharedData } = get()
    
    if (sourceTestId) {
      // Clear only data from a specific test
      set({ 
        sharedData: sharedData.filter(item => item.sourceTestId !== sourceTestId) 
      })
    } else {
      // Clear all data
      set({ sharedData: [] })
    }
  },
  
  getValueByKey: (key: string) => {
    const item = get().getSharedData(key)
    return item?.value
  },
  
  getAllDataAsObject: () => {
    const { sharedData } = get()
    return sharedData.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, any>)
  }
}))
