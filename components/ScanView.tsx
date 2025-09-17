
import React, { useEffect } from 'react';
import { ScanState, Threat, ScanType } from '../types';
import { ShieldCheckIcon, ShieldExclamationIcon, DocumentSearchIcon, BanIcon } from './Icons';

// Mock data and functions
const MOCK_FILES = [
  'C:\\Windows\\System32\\kernel32.dll',
  'C:\\Program Files\\app\\main.exe',
  'C:\\Users\\user\\Documents\\report.docx',
  'C:\\Users\\user\\Downloads\\installer.msi',
  'C:\\Windows\\SysWOW64\\gdi32.dll',
  'C:\\Temp\\log.txt',
  'C:\\Windows\\explorer.exe',
  'C:\\ProgramData\\cache\\data.bin'
];
const MOCK_THREATS: Omit<Threat, 'id' | 'filePath'>[] = [
    { threatName: 'Trojan.Generic.12345', severity: 'High' },
    { threatName: 'Adware.Win32.InstallCore', severity: 'Medium' },
    { threatName: 'RiskWare.Tool.KMS', severity: 'Low' },
];

interface ScanViewProps {
  scanState: ScanState;
  setScanState: React.Dispatch<React.SetStateAction<ScanState>>;
  onScanComplete: (results: Threat[]) => void;
}

const ScanView: React.FC<ScanViewProps> = ({ scanState, setScanState, onScanComplete }) => {
  useEffect(() => {
    if (scanState.status !== 'scanning') return;

    const totalDuration = scanState.scanType === ScanType.Quick ? 10000 : 30000; // 10s for quick, 30s for full
    const tickRate = 100; // ms
    const totalTicks = totalDuration / tickRate;
    let currentTick = (scanState.progress / 100) * totalTicks;
    let threats: Threat[] = [];

    const interval = setInterval(() => {
      currentTick++;
      const progress = Math.min((currentTick / totalTicks) * 100, 100);
      const filesScanned = Math.floor(progress * 500);
      const currentFile = MOCK_FILES[Math.floor(Math.random() * MOCK_FILES.length)];
      
      // Randomly find a threat
      if (Math.random() < 0.05 && threats.length < MOCK_THREATS.length) {
        const threatBase = MOCK_THREATS[threats.length];
        const newThreat: Threat = {
          ...threatBase,
          id: `threat-${Date.now()}`,
          filePath: MOCK_FILES[Math.floor(Math.random() * MOCK_FILES.length)],
        };
        threats = [...threats, newThreat];
      }

      setScanState(prevState => ({
        ...prevState,
        progress,
        filesScanned,
        currentFile,
        threatsFound: threats.length,
        elapsedTime: prevState.elapsedTime + (tickRate / 1000)
      }));

      if (progress >= 100) {
        clearInterval(interval);
        setScanState(prevState => ({
          ...prevState,
          status: 'complete',
          currentFile: 'Scan finished.',
          results: threats,
        }));
        onScanComplete(threats);
      }
    }, tickRate);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState.status, scanState.scanType]);

  if (scanState.status === 'idle') {
    return <div className="text-center text-gray-400">Select a scan type from the Dashboard to begin.</div>
  }
  
  if (scanState.status === 'scanning') {
    return <ScanningProgressView scanState={scanState} />;
  }

  if (scanState.status === 'complete') {
    return <ScanResultsView scanState={scanState} />;
  }

  return null;
};

const ScanningProgressView: React.FC<{scanState: ScanState}> = ({ scanState }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-white">
            <h2 className="text-3xl font-bold mb-2">{scanState.scanType} in Progress...</h2>
            <div className="w-full max-w-2xl bg-brand-secondary rounded-lg p-8 shadow-lg">
                <div className="w-full bg-brand-light rounded-full h-4 mb-4 overflow-hidden">
                    <div className="bg-brand-accent h-4 rounded-full" style={{ width: `${scanState.progress}%` }}></div>
                </div>
                <div className="text-center text-2xl font-semibold mb-6">{Math.round(scanState.progress)}%</div>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                        <p className="text-2xl font-bold">{Math.floor(scanState.elapsedTime)}s</p>
                        <p className="text-sm text-gray-400">Elapsed Time</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{scanState.filesScanned.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Files Scanned</p>
                    </div>
                    <div>
                        <p className={`text-2xl font-bold ${scanState.threatsFound > 0 ? 'text-brand-danger' : 'text-brand-accent'}`}>{scanState.threatsFound}</p>
                        <p className="text-sm text-gray-400">Threats Found</p>
                    </div>
                </div>

                <div className="text-sm text-gray-400 truncate text-center bg-brand-dark p-3 rounded-md">
                    <p className="font-mono">{scanState.currentFile}</p>
                </div>
            </div>
        </div>
    );
};

const ScanResultsView: React.FC<{scanState: ScanState}> = ({ scanState }) => {
    const threatsFound = scanState.results.length > 0;
    const severityColor = (severity: Threat['severity']) => {
        switch (severity) {
            case 'Critical': return 'bg-red-800 text-red-200';
            case 'High': return 'bg-red-600 text-red-100';
            case 'Medium': return 'bg-yellow-600 text-yellow-100';
            case 'Low': return 'bg-gray-600 text-gray-200';
        }
    }
    
    return (
        <div>
            <div className={`flex items-center p-6 rounded-lg mb-8 ${threatsFound ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                {threatsFound ? <ShieldExclamationIcon className="h-12 w-12 text-brand-danger mr-4" /> : <ShieldCheckIcon className="h-12 w-12 text-brand-accent mr-4" />}
                <div>
                    <h2 className="text-2xl font-bold">{scanState.scanType} Complete</h2>
                    <p className={threatsFound ? 'text-red-300' : 'text-green-300'}>
                        {threatsFound ? `${scanState.results.length} threat(s) found.` : 'No threats found. Your system is clean.'}
                    </p>
                </div>
            </div>
            
            {threatsFound && (
                <div className="bg-brand-secondary rounded-lg shadow-lg">
                    <div className="p-4 border-b border-brand-light">
                        <h3 className="text-lg font-semibold">Detected Threats</h3>
                    </div>
                    <div className="divide-y divide-brand-light">
                        {scanState.results.map(threat => (
                            <div key={threat.id} className="p-4 flex items-center justify-between hover:bg-brand-light">
                                <div className="flex-1">
                                    <p className="font-semibold text-white">{threat.threatName}</p>
                                    <p className="text-sm text-gray-400 font-mono">{threat.filePath}</p>
                                </div>
                                <div className="flex items-center ml-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${severityColor(threat.severity)}`}>{threat.severity}</span>
                                    <button className="ml-4 p-2 text-gray-400 hover:text-white hover:bg-brand-danger rounded-full transition-colors">
                                        <BanIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!threatsFound && (
                 <div className="text-center p-12 bg-brand-secondary rounded-lg">
                    <DocumentSearchIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold">Scan Summary</h3>
                    <p className="text-gray-400">A total of {scanState.filesScanned.toLocaleString()} files were scanned in {Math.floor(scanState.elapsedTime)} seconds.</p>
                </div>
            )}
        </div>
    );
};


export default ScanView;
