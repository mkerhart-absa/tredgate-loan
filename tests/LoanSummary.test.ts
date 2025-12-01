import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanSummary from '../src/components/LoanSummary.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanSummary', () => {
  const mockLoans: LoanApplication[] = [
    {
      id: '1',
      applicantName: 'John Doe',
      amount: 50000,
      termMonths: 24,
      interestRate: 0.08,
      status: 'pending',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      applicantName: 'Jane Smith',
      amount: 100000,
      termMonths: 60,
      interestRate: 0.06,
      status: 'approved',
      createdAt: '2024-02-15T00:00:00.000Z'
    },
    {
      id: '3',
      applicantName: 'Bob Johnson',
      amount: 75000,
      termMonths: 36,
      interestRate: 0.10,
      status: 'approved',
      createdAt: '2024-03-20T00:00:00.000Z'
    },
    {
      id: '4',
      applicantName: 'Alice Brown',
      amount: 150000,
      termMonths: 72,
      interestRate: 0.12,
      status: 'rejected',
      createdAt: '2024-04-10T00:00:00.000Z'
    }
  ]

  it('renders summary cards', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const cards = wrapper.findAll('.stat-card')
    expect(cards).toHaveLength(5) // total, pending, approved, rejected, total approved amount
  })

  it('displays correct total count', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const totalCard = wrapper.find('[data-testid="total-card"]')
    expect(totalCard.find('.stat-value').text()).toBe('4')
    expect(totalCard.find('.stat-label').text()).toBe('Total Applications')
  })

  it('displays correct pending count', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const pendingCard = wrapper.find('[data-testid="pending-card"]')
    expect(pendingCard.find('.stat-value').text()).toBe('1')
    expect(pendingCard.find('.stat-label').text()).toBe('Pending')
  })

  it('displays correct approved count', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const approvedCard = wrapper.find('[data-testid="approved-card"]')
    expect(approvedCard.find('.stat-value').text()).toBe('2')
    expect(approvedCard.find('.stat-label').text()).toBe('Approved')
  })

  it('displays correct rejected count', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const rejectedCard = wrapper.find('[data-testid="rejected-card"]')
    expect(rejectedCard.find('.stat-value').text()).toBe('1')
    expect(rejectedCard.find('.stat-label').text()).toBe('Rejected')
  })

  it('displays correct total approved amount', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const amountCard = wrapper.find('[data-testid="amount-card"]')
    // approved loans: 100000 + 75000 = 175000
    expect(amountCard.find('.stat-value').text()).toBe('$175,000')
    expect(amountCard.find('.stat-label').text()).toBe('Total Approved')
  })

  it('displays zero values for empty loan list', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [] }
    })
    
    const cards = wrapper.findAll('.stat-card')
    expect(cards[0]!.find('.stat-value').text()).toBe('0')
    expect(cards[1]!.find('.stat-value').text()).toBe('0')
    expect(cards[2]!.find('.stat-value').text()).toBe('0')
    expect(cards[3]!.find('.stat-value').text()).toBe('0')
    expect(cards[4]!.find('.stat-value').text()).toBe('$0')
  })

  it('applies correct CSS classes to status cards', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    expect(wrapper.find('[data-testid="pending-card"]').classes()).toContain('pending')
    expect(wrapper.find('[data-testid="approved-card"]').classes()).toContain('approved')
    expect(wrapper.find('[data-testid="rejected-card"]').classes()).toContain('rejected')
    expect(wrapper.find('[data-testid="amount-card"]').classes()).toContain('amount')
  })

  it('formats currency without decimals', () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: mockLoans }
    })
    
    const amountCard = wrapper.find('[data-testid="amount-card"]')
    const amountText = amountCard.find('.stat-value').text()
    // Should be formatted as $175,000 (no decimal places)
    expect(amountText).toBe('$175,000')
    expect(amountText).not.toContain('.00')
  })

  it('updates statistics reactively when loans prop changes', async () => {
    const wrapper = mount(LoanSummary, {
      props: { loans: [mockLoans[0]!] }
    })
    
    // Initial state: 1 pending loan
    expect(wrapper.find('[data-testid="total-card"]').find('.stat-value').text()).toBe('1')
    expect(wrapper.find('[data-testid="pending-card"]').find('.stat-value').text()).toBe('1')
    
    // Update props
    await wrapper.setProps({ loans: mockLoans })
    
    // Updated state: 4 total, 1 pending, 2 approved, 1 rejected
    expect(wrapper.find('[data-testid="total-card"]').find('.stat-value').text()).toBe('4')
    expect(wrapper.find('[data-testid="pending-card"]').find('.stat-value').text()).toBe('1')
    expect(wrapper.find('[data-testid="approved-card"]').find('.stat-value').text()).toBe('2')
    expect(wrapper.find('[data-testid="rejected-card"]').find('.stat-value').text()).toBe('1')
  })

  it('calculates total approved amount correctly with multiple approved loans', () => {
    const approvedLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 25000,
        termMonths: 12,
        interestRate: 0.05,
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        applicantName: 'User 2',
        amount: 50000,
        termMonths: 24,
        interestRate: 0.06,
        status: 'approved',
        createdAt: '2024-02-01T00:00:00.000Z'
      },
      {
        id: '3',
        applicantName: 'User 3',
        amount: 25000,
        termMonths: 18,
        interestRate: 0.07,
        status: 'approved',
        createdAt: '2024-03-01T00:00:00.000Z'
      }
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans: approvedLoans }
    })
    
    const amountCard = wrapper.find('[data-testid="amount-card"]')
    // 25000 + 50000 + 25000 = 100000
    expect(amountCard.find('.stat-value').text()).toBe('$100,000')
  })

  it('does not include pending or rejected loans in total approved amount', () => {
    const mixedLoans: LoanApplication[] = [
      {
        id: '1',
        applicantName: 'User 1',
        amount: 50000,
        termMonths: 12,
        interestRate: 0.05,
        status: 'approved',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        applicantName: 'User 2',
        amount: 100000,
        termMonths: 24,
        interestRate: 0.06,
        status: 'pending',
        createdAt: '2024-02-01T00:00:00.000Z'
      },
      {
        id: '3',
        applicantName: 'User 3',
        amount: 75000,
        termMonths: 18,
        interestRate: 0.07,
        status: 'rejected',
        createdAt: '2024-03-01T00:00:00.000Z'
      }
    ]
    
    const wrapper = mount(LoanSummary, {
      props: { loans: mixedLoans }
    })
    
    const amountCard = wrapper.find('[data-testid="amount-card"]')
    // Only approved loan: 50000
    expect(amountCard.find('.stat-value').text()).toBe('$50,000')
  })
})
