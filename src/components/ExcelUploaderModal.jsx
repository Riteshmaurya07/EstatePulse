import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, X, FileSpreadsheet, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';

export default function ExcelUploaderModal({ isOpen, onClose, onDataLoaded, onResetData }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (file) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          throw new Error('The uploaded Excel file contains no data rows.');
        }

        // Standardize & Map columns
        const mappedRecords = rawJson.map((row, idx) => {
          // Helper to find column regardless of key whitespace or casing
          const getVal = (possibleKeys) => {
            for (let key of Object.keys(row)) {
              const cleanedKey = key.replace(/\s+/g, ' ').trim().toLowerCase();
              for (let p of possibleKeys) {
                if (cleanedKey.includes(p.toLowerCase())) {
                  return row[key];
                }
              }
            }
            return '';
          };

          const developer = String(getVal(['developer name', 'developer']) || 'Developer').trim();
          const project = String(getVal(['project name', 'project']) || `Project #${idx+1}`).trim();
          const micromarket = String(getVal(['micromarkets', 'micromarket', 'location']) || 'Lucknow').trim();
          const launchedSqft = parseInt(getVal(['launched sqft', 'sqft'])) || 0;
          const launchedUnits = parseInt(getVal(['launched unit', 'launched units', 'units'])) || 0;
          const unitsAbsorbed = parseInt(getVal(['units absorbed', 'absorbed'])) || 0;
          const percentSold = parseFloat(getVal(['% sold', 'percent sold', 'sold %'])) || (launchedUnits > 0 ? Math.round((unitsAbsorbed/launchedUnits)*100) : 0);
          const bsp = String(getVal(['current bsp', 'bsp', 'price']) || '5000').trim();

          return {
            id: `CUSTOM-${String(idx + 1).padStart(3, '0')}`,
            pmid: String(getVal(['pmid']) || `PM-${idx + 1}`).trim(),
            developerName: developer,
            projectName: project,
            phase: 1,
            city: 'Lucknow',
            micromarket: micromarket,
            projectType: String(getVal(['project type']) || 'Apartment Complex').trim(),
            status: String(getVal(['current status', 'status']) || 'Available').trim(),
            launchedSqft: launchedSqft,
            launchedUnits: launchedUnits,
            unitsAbsorbed: unitsAbsorbed,
            percentSold: percentSold,
            segment: String(getVal(['property segment', 'segment']) || 'Mid').trim(),
            latitude: parseFloat(getVal(['latitude', 'lat'])) || 26.85,
            longitude: parseFloat(getVal(['longitude', 'lng', 'lon'])) || 81.00,
            unitSizeRangeSqft: String(getVal(['unit size']) || '1200-1800').trim(),
            bedroomRange: String(getVal(['bedroom']) || '2,3 BHK').trim(),
            bspInrSqftRange: bsp,
            launchDate: String(getVal(['launch date']) || 'Dec-23').trim(),
            completionDate: String(getVal(['completion date']) || 'Nov-26').trim(),
            flatType: 'Non-Furnished',
            sampleFlat: 'Yes',
            sampleFlatStatus: 'Ready',
            buildingStructure: String(getVal(['building structure', 'structure']) || 'S+14').trim(),
            constructionStatus: String(getVal(['project construction status', 'construction status']) || 'Under Construction').trim(),
            modularKitchen: String(getVal(['modular kitchen']) || 'Non-Modular').trim(),
            sanitaryBrands: String(getVal(['sanitary fittings', 'sanitary']) || 'Jaquar, Kohler').trim(),
            showerCubicle: 'No',
            siteAddress: String(getVal(['site address', 'landmark']) || 'Lucknow').trim(),
            pincode: '226010',
            website: '',
            builderAddress: '',
            builderEmail: String(getVal(['email']) || '').trim(),
            builderContactDetails: String(getVal(['builder contact']) || '').trim(),
            siteManagerName: String(getVal(['site manager name']) || '').trim(),
            siteManagerContact: String(getVal(['site manager contact']) || '').trim(),
            procurementInfo: String(getVal(['procurement name', 'procurement']) || '').trim(),
            procurementContact: String(getVal(['procurement contact']) || '').trim(),
            mepConsultant: String(getVal(['mep consultant', 'mep']) || '').trim(),
            mepContact: String(getVal(['mep consultant contact']) || '').trim(),
            architectDetails: String(getVal(['architect']) || '').trim(),
            reraNo: String(getVal(['rera certificate', 'rera']) || 'UPRERAPRJ0000').trim()
          };
        });

        onDataLoaded(mappedRecords);
        setSuccessMessage(`Successfully loaded ${mappedRecords.length} records from ${file.name}`);
        setLoading(false);
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err) {
        console.error(err);
        setError(`Failed to parse file: ${err.message}`);
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-glow relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Custom B2B Excel Dataset</h3>
            <p className="text-xs text-slate-400">Import your client dataset (.xlsx / .csv)</p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-emerald-500 bg-emerald-500/10' 
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.xlsx, .xls, .csv';
            input.onchange = (e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            };
            input.click();
          }}
        >
          <Upload className="w-10 h-10 mx-auto text-emerald-400 mb-3 animate-bounce" />
          <p className="text-xs font-bold text-slate-200">
            Click to browse or drag & drop Excel workbook (.xlsx)
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Supports RERA exports, developer lead lists, and inventory master sheets.
          </p>
        </div>

        {/* Loading / Status alerts */}
        {loading && (
          <div className="mt-4 p-3 rounded-xl bg-brand-500/10 text-brand-300 text-xs flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
            Parsing workbook and mapping intelligence columns...
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onResetData();
              setSuccessMessage('Reset to sample dataset.');
              setTimeout(onClose, 1000);
            }}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to Original Sample Excel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
