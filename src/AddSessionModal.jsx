import React, { useState, useRef } from 'react';
import { X, UploadCloud, Plus, FileImage, Loader2 } from 'lucide-react';
import { parsePokerScreenshots } from './lib/gemini';
import { getKnownWPLBuyin } from './lib/wplTournaments';
import './Modal.css';

export default function AddSessionModal({ isOpen, onClose, onAdd }) {
    const [activeTab, setActiveTab] = useState('manual');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const fileInputRef = useRef(null);
    const [parsedSessions, setParsedSessions] = useState([]); // Store array of results
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        platform: 'WPL',
        format: '미드나잇 350억 GTD (or Cash)',
        stakes: '2.7억 (or $1/$2)',
        result: ''
    });

    if (!isOpen) return null;

    // Helper to format abstract WPL numbers to human readable (1.2 -> 1억 2000만)
    const formatWPLCurrency = (numStr) => {
        const num = Number(numStr);
        if (isNaN(num) || num === 0) return '0원';

        const isNegative = num < 0;
        const absNum = Math.abs(num);

        if (absNum >= 1) {
            const eok = Math.floor(absNum);
            const man = Math.round((absNum - eok) * 10000); // 0.2 억 = 2000 만
            let result = `${eok}억`;
            if (man > 0) result += ` ${man}만`;
            return isNegative ? `-${result}` : result;
        } else {
            const man = Math.round(absNum * 10000);
            return isNegative ? `-${man}만` : `${man}만`;
        }
    };

    // Helper to calculate actual result (handling tournament 0 logic)
    const calculateActualResult = (session) => {
        let res = Number(session.result) || 0;
        if (session.platform === 'WPL' && res === 0 && (session.format.includes('토너먼트') || session.format.includes('AoF'))) {
            // First check if we have a known dictionary value attached in processImage
            if (session._dictionaryBuyinValue !== undefined) {
                res = -session._dictionaryBuyinValue;
            } else {
                // Fallback to naive parse
                const stakeNums = session.stakes.match(/[\d.]+/g);
                if (stakeNums && stakeNums.length > 0) {
                    let parsedStake = parseFloat(stakeNums[0]); // e.g. 400
                    if (session.stakes.includes('만') && !session.stakes.includes('억')) {
                        parsedStake = parsedStake / 10000; // convert Man to Eok baseline
                    }
                    res = -Math.abs(parsedStake);
                }
            }
        }
        return res;
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (!files || files.length === 0) return;
        processImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (!files || files.length === 0) return;
        processImages(files);
    };

    const processImages = async (files) => {
        if (files.length > 5) {
            setErrorMsg("Maximum of 5 images can be uploaded at once to ensure AI stability.");
            return;
        }

        setIsAnalyzing(true);
        setErrorMsg('');
        try {
            // Read all files as Base64 concurrently
            const filesData = await Promise.all(files.filter(f => f.type.startsWith('image/')).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve({ file, base64Data: reader.result });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }));

            if (filesData.length === 0) {
                setErrorMsg("No valid image files detected.");
                setIsAnalyzing(false);
                return;
            }

            const parsedData = await parsePokerScreenshots(filesData);

            // Enhance parsed data with WPL dictionary
            let enhancedData = Array.isArray(parsedData) ? parsedData : [parsedData];

            enhancedData = enhancedData.map(session => {
                if (session.platform === 'WPL' && session.format) {
                    const known = getKnownWPLBuyin(session.format);
                    if (known) {
                        session.stakes = known.str; // Overwrite guessed GTD with actual buy-in string
                        session._dictionaryBuyinValue = known.val; // Store numeric value for loss calculation
                    }
                }
                return session;
            });

            if (enhancedData.length > 0) {
                setParsedSessions(enhancedData);
                setActiveTab('review');
            } else {
                throw new Error("No data found in images.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg(err.message || "Failed to parse images with AI.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            id: Date.now(),
            date: formData.date,
            format: `[${formData.platform}] ${formData.format}`,
            stakes: formData.stakes,
            result: Number(formData.result),
            status: Number(formData.result) > 0 ? 'win' : 'loss'
        });
        onClose();
    };

    const handleBulkSubmit = () => {
        const bulkSessions = parsedSessions.map((session, index) => {
            const actualResult = calculateActualResult(session);
            return {
                id: Date.now() + index,
                date: session.date || new Date().toISOString().split('T')[0],
                format: `[${session.platform}] ${session.format}`,
                stakes: session.stakes || "Unknown stakes",
                result: actualResult,
                status: actualResult > 0 ? 'win' : 'loss'
            };
        });

        onAdd(bulkSessions);
        onClose();
        // Reset state for next open
        setParsedSessions([]);
        setActiveTab('manual');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2 className="modal-title">Record Session</h2>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
                        onClick={() => setActiveTab('manual')}
                    >
                        Manual Entry
                    </button>
                    <button
                        className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <UploadCloud size={16} /> Auto-Analyze Image
                    </button>
                </div>

                {activeTab === 'manual' ? (
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Platform</label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                >
                                    <option value="WPL">WPL (억/만)</option>
                                    <option value="WPT">WPT Global (USD)</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Game / Tournament Name</label>
                                <input
                                    type="text"
                                    value={formData.format}
                                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                    placeholder="e.g. 바운티 헌터 6-MAX 120억 GTD"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stakes / Buy-in</label>
                                <input
                                    type="text"
                                    value={formData.stakes}
                                    onChange={(e) => setFormData({ ...formData, stakes: e.target.value })}
                                    placeholder="e.g. 1억 or $55"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Result / Prize ({formData.platform === 'WPL' ? '억' : '$'})</label>
                            <input
                                type="number"
                                step="any"
                                value={formData.result}
                                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                                placeholder={formData.platform === 'WPL' ? "e.g. 150.5 (억 단위)" : "e.g. 150 or -55"}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full mt-4">
                            Save Session
                        </button>
                    </form>
                ) : activeTab === 'review' ? (
                    <div className="review-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Review Extracted Data ({parsedSessions.length} rows)</h3>
                        <table style={{ width: '100%', marginBottom: '1rem' }}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Format</th>
                                    <th>Stakes</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedSessions.map((session, i) => {
                                    const actualResult = calculateActualResult(session);
                                    const displayResult = session.platform === 'WPL'
                                        ? formatWPLCurrency(actualResult)
                                        : `$${actualResult}`;

                                    return (
                                        <tr key={i}>
                                            <td>{session.date}</td>
                                            <td>{session.format}</td>
                                            <td>{session.stakes}</td>
                                            <td className={actualResult > 0 ? 'text-success' : 'text-danger'}>
                                                {displayResult}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-outline w-full" onClick={() => setActiveTab('upload')}>
                                Cancel
                            </button>
                            <button className="btn-primary w-full" onClick={handleBulkSubmit}>
                                Save All {parsedSessions.length} Sessions
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="upload-container">
                        <div
                            className="dropzone"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ cursor: isAnalyzing ? 'wait' : 'pointer' }}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/png, image/jpeg, image/webp"
                                multiple
                                onChange={handleFileSelect}
                            />
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="animate-spin" size={48} color="var(--primary-color)" />
                                    <p>AI is analyzing the screenshots...</p>
                                    <span className="text-muted text-sm">Please wait a few seconds</span>
                                </>
                            ) : (
                                <>
                                    <FileImage size={48} color="var(--text-muted)" />
                                    <p>Drag & drop up to 5 WPL or session screenshots here</p>
                                    <span className="text-muted text-sm">PNG, JPG up to 5MB per image. Max 5 images.</span>
                                    <button className="btn-outline mt-4">Browse Files</button>
                                </>
                            )}
                        </div>
                        {errorMsg && <div className="text-danger" style={{ marginTop: '0.5rem' }}>{errorMsg}</div>}
                        <div className="ai-notice">
                            <SparklesIcon /> AI will automatically extract the date, format, stakes, and result from the image.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SparklesIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: 'var(--primary-color)' }}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    );
}
