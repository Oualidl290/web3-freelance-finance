
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

// Generic type for data to export
export type ExportData = Record<string, any>[];

/**
 * Export data to CSV format
 * @param data Array of objects to export
 * @param filename Name of the file to save
 */
export const exportToCSV = (data: ExportData, filename: string): void => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV rows
    const csvRows = [
      // Headers row
      headers.join(','),
      
      // Data rows
      ...data.map(row => {
        return headers.map(header => {
          // Handle special cases like objects, nulls, dates, etc.
          const cell = row[header];
          
          if (cell === null || cell === undefined) {
            return '';
          }
          
          if (typeof cell === 'object') {
            // If it's a date, format it
            if (cell instanceof Date) {
              return format(cell, 'yyyy-MM-dd HH:mm:ss');
            }
            // For other objects, stringify (and escape quotes)
            return JSON.stringify(cell).replace(/"/g, '""');
          }
          
          // Convert to string and escape quotes
          const cellStr = String(cell).replace(/"/g, '""');
          
          // Enclose in quotes if it contains commas, quotes or newlines
          return /[,"\n\r]/.test(cellStr) ? `"${cellStr}"` : cellStr;
        }).join(',');
      })
    ].join('\n');
    
    // Create a blob and save the file
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

/**
 * Export data to JSON format
 * @param data Array of objects to export
 * @param filename Name of the file to save
 */
export const exportToJSON = (data: ExportData, filename: string): void => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
  }
};
