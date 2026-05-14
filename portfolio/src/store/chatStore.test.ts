/**
 * Tests for chatStore section state management.
 * 
 * NOTE: This project needs Vitest setup. To run these tests:
 * 1. pnpm add -D vitest @testing-library/react jsdom
 * 2. Add "test": "vitest" to package.json scripts
 * 3. Create vitest.config.ts with jsdom environment
 * 
 * Tests cover spec scenarios:
 * - Initial state is null
 * - Section state updates on navigation
 * - Section state persists during conversation
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useChatStore } from './chatStore'
import type { SidebarSectionId } from '../types'

describe('chatStore - currentSection state', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useChatStore.setState({
      messages: [],
      isTyping: false,
      sidebarOpen: true,
      contactFlowStep: null,
      contactData: { name: undefined, email: undefined, consulta: undefined },
      currentSection: null,
    })
  })

  describe('Initial state', () => {
    it('should have currentSection as null on initialization', () => {
      // Spec scenario: Initial state is null
      const state = useChatStore.getState()
      expect(state.currentSection).toBeNull()
    })
  })

  describe('setCurrentSection action', () => {
    it('should update currentSection to "about"', () => {
      // Spec scenario: Section state updates on navigation
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('about')
      
      const state = useChatStore.getState()
      expect(state.currentSection).toBe('about')
    })

    it('should update currentSection to "projects"', () => {
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('projects')
      
      const state = useChatStore.getState()
      expect(state.currentSection).toBe('projects')
    })

    it('should update currentSection to "experience"', () => {
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('experience')
      
      const state = useChatStore.getState()
      expect(state.currentSection).toBe('experience')
    })

    it('should update currentSection to "contact"', () => {
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('contact')
      
      const state = useChatStore.getState()
      expect(state.currentSection).toBe('contact')
    })

    it('should allow resetting currentSection to null', () => {
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('about')
      expect(useChatStore.getState().currentSection).toBe('about')
      
      setCurrentSection(null)
      expect(useChatStore.getState().currentSection).toBeNull()
    })
  })

  describe('Section state persistence', () => {
    it('should persist section state across multiple messages', () => {
      // Spec scenario: Section state persists during conversation
      const { setCurrentSection, addMessage } = useChatStore.getState()
      
      setCurrentSection('projects')
      
      addMessage({ role: 'user', content: 'Message 1' })
      expect(useChatStore.getState().currentSection).toBe('projects')
      
      addMessage({ role: 'assistant', content: 'Response 1' })
      expect(useChatStore.getState().currentSection).toBe('projects')
      
      addMessage({ role: 'user', content: 'Message 2' })
      expect(useChatStore.getState().currentSection).toBe('projects')
    })

    it('should update section independent of other state changes', () => {
      const { setCurrentSection, setTyping, toggleSidebar } = useChatStore.getState()
      
      setCurrentSection('experience')
      
      setTyping(true)
      expect(useChatStore.getState().currentSection).toBe('experience')
      
      toggleSidebar()
      expect(useChatStore.getState().currentSection).toBe('experience')
      
      setTyping(false)
      expect(useChatStore.getState().currentSection).toBe('experience')
    })
  })

  describe('Section transitions', () => {
    it('should correctly transition between sections', () => {
      const { setCurrentSection } = useChatStore.getState()
      const sections: SidebarSectionId[] = ['about', 'projects', 'experience', 'contact']
      
      for (const section of sections) {
        setCurrentSection(section)
        expect(useChatStore.getState().currentSection).toBe(section)
      }
    })

    it('should handle rapid section switching', () => {
      // Edge case: Rapid Section Switching
      const { setCurrentSection } = useChatStore.getState()
      
      setCurrentSection('about')
      setCurrentSection('projects')
      setCurrentSection('experience')
      setCurrentSection('contact')
      setCurrentSection('about')
      
      // Final state should be the last set value
      expect(useChatStore.getState().currentSection).toBe('about')
    })
  })
})
