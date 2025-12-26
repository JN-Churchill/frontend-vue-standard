/**
 * Table utility functions
 */

/**
 * Format table index for pagination
 * @param index - Row index
 * @param page - Current page
 * @param pageSize - Page size
 * @returns Formatted index
 */
export function formatTableIndex(index: number, page: number, pageSize: number): number {
  return (page - 1) * pageSize + index + 1
}

/**
 * Handle table selection change
 * @param selection - Selected rows
 * @returns Array of selected ids
 */
export function getSelectedIds<T extends { id: number | string }>(selection: T[]): (number | string)[] {
  return selection.map(item => item.id)
}

/**
 * Sort array by field
 * @param arr - Array to sort
 * @param field - Field name to sort by
 * @param order - Sort order (asc or desc)
 * @returns Sorted array
 */
export function sortByField<T>(arr: T[], field: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...arr].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]
    
    if (aVal === bVal) return 0
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

/**
 * Filter table data
 * @param data - Table data
 * @param keyword - Search keyword
 * @param fields - Fields to search in
 * @returns Filtered data
 */
export function filterTableData<T extends Record<string, any>>(
  data: T[],
  keyword: string,
  fields: (keyof T)[]
): T[] {
  if (!keyword) return data
  
  const lowerKeyword = keyword.toLowerCase()
  
  return data.filter(item =>
    fields.some(field => {
      const value = item[field]
      if (value == null) return false
      return String(value).toLowerCase().includes(lowerKeyword)
    })
  )
}

/**
 * Export table data to CSV
 * @param data - Table data
 * @param columns - Column definitions
 * @param filename - File name
 */
export function exportTableToCSV<T extends Record<string, any>>(
  data: T[],
  columns: { prop: keyof T; label: string }[],
  filename: string = 'export.csv'
): void {
  // Create CSV header
  const header = columns.map(col => col.label).join(',')
  
  // Create CSV rows
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.prop]
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value ?? ''
    }).join(',')
  )
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n')
  
  // Create blob and download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
