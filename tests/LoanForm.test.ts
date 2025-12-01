import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanForm from '../src/components/LoanForm.vue'
import * as loanService from '../src/services/loanService'
import { setupLocalStorageMock } from './utils/mockLocalStorage'

// Mock localStorage
const localStorageMock = setupLocalStorageMock()

describe('LoanForm', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('renders the form with all input fields', () => {
    const wrapper = mount(LoanForm)
    
    expect(wrapper.find('h2').text()).toBe('New Loan Application')
    expect(wrapper.find('#applicantName').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('#termMonths').exists()).toBe(true)
    expect(wrapper.find('#interestRate').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('validates empty applicant name', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').text()).toBe('Applicant name is required')
  })

  it('validates amount must be greater than 0', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(0)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').text()).toBe('Amount must be greater than 0')
  })

  it('validates term months must be greater than 0', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(0)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').text()).toBe('Term months must be greater than 0')
  })

  it('validates interest rate cannot be negative', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('John Doe')
    await wrapper.find('#amount').setValue(10000)
    await wrapper.find('#termMonths').setValue(12)
    await wrapper.find('#interestRate').setValue(-0.05)
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').text()).toBe('Interest rate is required and cannot be negative')
  })

  it('creates loan application with valid data', async () => {
    const createLoanSpy = vi.spyOn(loanService, 'createLoanApplication')
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(createLoanSpy).toHaveBeenCalledWith({
      applicantName: 'Jane Smith',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08
    })
  })

  it('emits created event after successful submission', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.emitted('created')).toBeTruthy()
    expect(wrapper.emitted('created')?.length).toBe(1)
  })

  it('resets form fields after successful submission', async () => {
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    const applicantInput = wrapper.find('#applicantName')
    expect((applicantInput.element as HTMLInputElement).value).toBe('')
  })

  it('displays error message from service exception', async () => {
    vi.spyOn(loanService, 'createLoanApplication').mockImplementation(() => {
      throw new Error('Database connection failed')
    })
    
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('Jane Smith')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.find('.error-message').text()).toBe('Database connection failed')
  })

  it('trims whitespace from applicant name', async () => {
    const createLoanSpy = vi.spyOn(loanService, 'createLoanApplication')
    const wrapper = mount(LoanForm)
    
    await wrapper.find('#applicantName').setValue('  Jane Smith  ')
    await wrapper.find('#amount').setValue(50000)
    await wrapper.find('#termMonths').setValue(24)
    await wrapper.find('#interestRate').setValue(0.08)
    
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(createLoanSpy).toHaveBeenCalledWith({
      applicantName: 'Jane Smith',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08
    })
  })
})
