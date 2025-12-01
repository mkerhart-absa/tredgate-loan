import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoanList from '../src/components/LoanList.vue'
import type { LoanApplication } from '../src/types/loan'

describe('LoanList', () => {
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
      amount: 150000,
      termMonths: 72,
      interestRate: 0.10,
      status: 'rejected',
      createdAt: '2024-03-20T00:00:00.000Z'
    }
  ]

  it('renders the component with header', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [] }
    })
    
    expect(wrapper.find('h2').text()).toBe('Loan Applications')
  })

  it('displays empty state when no loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [] }
    })
    
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.find('.empty-state p').text()).toContain('No loan applications yet')
  })

  it('displays table with loans when loans exist', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    expect(wrapper.find('.empty-state').exists()).toBe(false)
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('displays correct loan information in table', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const row = wrapper.find('tbody tr')
    expect(row.text()).toContain('John Doe')
    expect(row.text()).toContain('$50,000.00')
    expect(row.text()).toContain('24 mo')
    expect(row.text()).toContain('8.0%')
  })

  it('formats currency correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.text()).toContain('$50,000.00')
    expect(rows[1]!.text()).toContain('$100,000.00')
    expect(rows[2]!.text()).toContain('$150,000.00')
  })

  it('formats percentage correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    expect(wrapper.text()).toContain('8.0%')
  })

  it('calculates and displays monthly payment', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    // amount: 50000, rate: 0.08, term: 24
    // total = 50000 * 1.08 = 54000
    // monthly = 54000 / 24 = 2250
    expect(wrapper.text()).toContain('$2,250.00')
  })

  it('displays correct status badges', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const statusBadges = wrapper.findAll('.status-badge')
    expect(statusBadges[0]!.text()).toBe('pending')
    expect(statusBadges[0]!.classes()).toContain('status-pending')
    expect(statusBadges[1]!.text()).toBe('approved')
    expect(statusBadges[1]!.classes()).toContain('status-approved')
    expect(statusBadges[2]!.text()).toBe('rejected')
    expect(statusBadges[2]!.classes()).toContain('status-rejected')
  })

  it('shows action buttons for pending loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const buttons = wrapper.findAll('.action-btn')
    expect(buttons).toHaveLength(3) // approve, reject, auto-decide
    expect(buttons[0]!.classes()).toContain('success')
    expect(buttons[1]!.classes()).toContain('danger')
    expect(buttons[2]!.classes()).toContain('secondary')
  })

  it('does not show action buttons for approved/rejected loans', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[1]!] } // approved loan
    })
    
    expect(wrapper.findAll('.action-btn')).toHaveLength(0)
    expect(wrapper.find('.no-actions').exists()).toBe(true)
  })

  it('emits approve event when approve button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const approveButton = wrapper.findAll('.action-btn')[0]!
    await approveButton.trigger('click')
    
    expect(wrapper.emitted('approve')).toBeTruthy()
    expect(wrapper.emitted('approve')?.[0]).toEqual(['1'])
  })

  it('emits reject event when reject button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const rejectButton = wrapper.findAll('.action-btn')[1]!
    await rejectButton.trigger('click')
    
    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')?.[0]).toEqual(['1'])
  })

  it('emits autoDecide event when auto-decide button clicked', async () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    const autoDecideButton = wrapper.findAll('.action-btn')[2]!
    await autoDecideButton.trigger('click')
    
    expect(wrapper.emitted('autoDecide')).toBeTruthy()
    expect(wrapper.emitted('autoDecide')?.[0]).toEqual(['1'])
  })

  it('formats date correctly', () => {
    const wrapper = mount(LoanList, {
      props: { loans: [mockLoans[0]!] }
    })
    
    // Date should be formatted as "Jan 1, 2024"
    expect(wrapper.text()).toMatch(/Jan\s+1,\s+2024/)
  })

  it('displays all table headers', () => {
    const wrapper = mount(LoanList, {
      props: { loans: mockLoans }
    })
    
    const headers = wrapper.findAll('th')
    expect(headers[0]!.text()).toBe('Applicant')
    expect(headers[1]!.text()).toBe('Amount')
    expect(headers[2]!.text()).toBe('Term')
    expect(headers[3]!.text()).toBe('Rate')
    expect(headers[4]!.text()).toBe('Monthly Payment')
    expect(headers[5]!.text()).toBe('Status')
    expect(headers[6]!.text()).toBe('Created')
    expect(headers[7]!.text()).toBe('Actions')
  })
})
