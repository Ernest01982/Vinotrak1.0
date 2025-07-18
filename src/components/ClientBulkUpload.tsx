import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Client } from '../lib/supabase';

type NewClient = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

interface ClientBulkUploadProps {
  onClientsUploaded: (clients: NewClient[]) => void;
  availableReps: { id: string; displayName: string }[];
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  data: unknown;
}

const ClientBulkUpload: React.FC<ClientBulkUploadProps> = ({ onClientsUploaded, availableReps }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    errors: ValidationError[];
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const headers = ['name', 'store_type', 'location', 'contact_person', 'phone', 'email'];
    const sampleData = [
      'ABC Wine & Spirits,Liquor Store,"New York, NY",John Martinez,(555) 123-4567,john@abcwine.com',
      'TechStart Restaurant,Restaurant,"San Francisco, CA",Sarah Kim,(555) 234-5678,sarah@techstart.com',
      'GreenTech Bar & Grill,Bar,"Austin, TX",Mike Thompson,(555) 345-6789,mike@greentech.com'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'client_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    const result: string[][] = [];
    
    for (const line of lines) {
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current.trim());
      result.push(row);
    }
    
    return result;
  };

  const processCSV = async (file: File) => {
    setIsUploading(true);
    setUploadResults(null);
    setShowResults(false);

    if (availableReps.length === 0) {
      alert("No sales reps found. Please add reps before uploading clients.");
      setIsUploading(false);
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      if (rows.length < 2) {
        throw new Error('CSV file must contain a header and at least one data row.');
      }

      const dataRows = rows.slice(1);
      const validClients: NewClient[] = [];
      const errors: ValidationError[] = [];

      dataRows.forEach((row, index) => {
        const rowNumber = index + 2;
        const [name, store_type, location, contact_person, phone, email] = row;

        if (!name?.trim()) errors.push({ row: rowNumber, field: 'name', message: 'Name is required', data: row });
        if (!email?.trim()) errors.push({ row: rowNumber, field: 'email', message: 'Email is required', data: row });
        else if (!validateEmail(email.trim())) errors.push({ row: rowNumber, field: 'email', message: 'Invalid email format', data: row });
        if (!store_type?.trim()) errors.push({ row: rowNumber, field: 'store_type', message: 'Store type is required', data: row });
        if (!location?.trim()) errors.push({ row: rowNumber, field: 'location', message: 'Location is required', data: row });
        if (!contact_person?.trim()) errors.push({ row: rowNumber, field: 'contact_person', message: 'Contact person is required', data: row });
        if (phone?.trim() && !validatePhone(phone.trim())) errors.push({ row: rowNumber, field: 'phone', message: 'Invalid phone format', data: row });

        const rowErrors = errors.filter(e => e.row === rowNumber);
        if (rowErrors.length === 0) {
          const randomRep = availableReps[Math.floor(Math.random() * availableReps.length)];
          
          validClients.push({
            name: name.trim(),
            store_type: store_type.trim(),
            location: location.trim(),
            contact_person: contact_person.trim(),
            phone: phone?.trim() || null,
            email: email.trim(),
            rep_id: randomRep.id
          });
        }
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadResults({
        success: validClients.length,
        errors
      });

      if (validClients.length > 0) {
        onClientsUploaded(validClients);
      }

      setShowResults(true);
    } catch (error) {
      console.error('Error processing CSV:', error);
      setUploadResults({
        success: 0,
        errors: [{
          row: 0,
          field: 'file',
          message: error instanceof Error ? error.message : 'Failed to process file',
          data: null
        }]
      });
      setShowResults(true);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      processCSV(file);
    }
  };

  return (
    <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
      <div className="flex items-center space-x-3 mb-6">
        <Upload className="w-6 h-6 text-sky-400" />
        <h2 className="text-xl font-semibold text-white">Bulk Client Upload</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-3">Upload Instructions</h3>
          <div className="space-y-2 text-gray-300">
            <p>Upload a CSV file with the following headers:</p>
            <div className="bg-gray-900 rounded p-3 font-mono text-sm overflow-x-auto">
              <span className="text-sky-400">name,store_type,location,contact_person,phone,email</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm pt-2">
              <li>All fields are required except for <strong>phone</strong>.</li>
              <li>Use quotes around fields containing commas (e.g., "New York, NY").</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Need a template?</h4>
            <p className="text-gray-400 text-sm">Download a sample CSV file with the correct format</p>
          </div>
          <button
            onClick={downloadTemplate}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors duration-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-white font-medium">Choose CSV file to upload</p>
            <p className="text-gray-400 text-sm">Select your client data file</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Select CSV File</span>
              </>
            )}
          </button>
        </div>

        {showResults && uploadResults && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Upload Results</h3>
              <button
                onClick={() => setShowResults(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {uploadResults.success > 0 && (
                <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">
                    Successfully validated {uploadResults.success} client{uploadResults.success !== 1 ? 's' : ''} for upload.
                  </span>
                </div>
              )}

              {uploadResults.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">
                      {uploadResults.errors.length} error{uploadResults.errors.length !== 1 ? 's' : ''} found
                    </span>
                  </div>
                  
                  <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-900 rounded p-2">
                    {uploadResults.errors.map((error, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        <span className="font-semibold text-red-400">Row {error.row}:</span> {error.message}
                        <span className="text-gray-500"> (field: {error.field})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBulkUpload;