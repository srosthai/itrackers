// =====================================================
// TRANSACTION FILTER BAR
//
// Search + Dropdown Filters (Category, Type, Date)
// Using Custom Dropdowns matching Select component style
// Cascading Category Filter (Parent -> Sub-category)
// =====================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '@/components/ui';

interface SubCategory {
    categoryId: string;
    name: string;
}

interface CategoryWithSubs {
    categoryId: string;
    name: string;
    type: 'income' | 'expense';
    subcategories?: SubCategory[];
}

interface FilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    filters: {
        type?: string;
        categoryId?: string;
        startDate?: string;
        endDate?: string;
        period?: string;
    };
    onFilterChange: (key: string, value: string | undefined) => void;
    onDateRangeChange: (startDate: string, endDate: string) => void;
    categories: CategoryWithSubs[];
}

interface Option {
    value: string;
    label: string;
}

// Helper to get date ranges for period filters
function getDateRange(period: string): { startDate: string; endDate: string } {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();
    const dayOfWeek = today.getDay();

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    switch (period) {
        case 'today':
            return {
                startDate: formatDate(today),
                endDate: formatDate(today)
            };
        case 'week': {
            // Start of week (Sunday)
            const startOfWeek = new Date(year, month, date - dayOfWeek);
            const endOfWeek = new Date(year, month, date + (6 - dayOfWeek));
            return {
                startDate: formatDate(startOfWeek),
                endDate: formatDate(endOfWeek)
            };
        }
        case 'month': {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0);
            return {
                startDate: formatDate(startOfMonth),
                endDate: formatDate(endOfMonth)
            };
        }
        case 'year': {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);
            return {
                startDate: formatDate(startOfYear),
                endDate: formatDate(endOfYear)
            };
        }
        default:
            return { startDate: '', endDate: '' };
    }
}

// Period Filter with Custom Date Range support
function PeriodFilterDropdown({
    value,
    customStartDate,
    customEndDate,
    onChange,
    onCustomDateChange
}: {
    value?: string;
    customStartDate?: string;
    customEndDate?: string;
    onChange: (period: string | undefined) => void;
    onCustomDateChange: (startDate: string, endDate: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(customStartDate || '');
    const [tempEndDate, setTempEndDate] = useState(customEndDate || '');
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const periodOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' }
    ];

    const selectedOption = periodOptions.find(opt => opt.value === value);
    const isActive = !!value;

    // Format display label for custom range
    const getDisplayLabel = () => {
        if (value === 'custom' && customStartDate && customEndDate) {
            const start = new Date(customStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const end = new Date(customEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return `${start} - ${end}`;
        }
        return selectedOption?.label || 'Period';
    };

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }
            const target = event.target as Element;
            if (!target.closest('.portal-dropdown')) {
                setIsOpen(false);
                setShowCustom(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleScroll = (e: Event) => {
            const target = e.target as Element;
            if (target?.closest?.('.portal-dropdown')) {
                return;
            }
            setIsOpen(false);
            setShowCustom(false);
        };

        const handleResize = () => {
            setIsOpen(false);
            setShowCustom(false);
        };

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left
            });
            setIsOpen(true);
            setShowCustom(value === 'custom');
        } else {
            setIsOpen(false);
            setShowCustom(false);
        }
    };

    const handlePeriodSelect = (period: string) => {
        if (period === 'custom') {
            setShowCustom(true);
            setTempStartDate(customStartDate || '');
            setTempEndDate(customEndDate || '');
        } else {
            onChange(period);
            setIsOpen(false);
            setShowCustom(false);
        }
    };

    const handleApplyCustom = () => {
        if (tempStartDate && tempEndDate) {
            onCustomDateChange(tempStartDate, tempEndDate);
            onChange('custom');
            setIsOpen(false);
            setShowCustom(false);
        }
    };

    return (
        <div className="relative shrink-0">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-full border text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation ${isActive
                    ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]'
                    : 'bg-[#1a2a1a] border-[#2a3f2a] text-gray-300 hover:border-gray-500 active:border-gray-500'
                    }`}
            >
                <Icons.Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate">{getDisplayLabel()}</span>
                <Icons.ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#22c55e]' : 'text-gray-500'}`} />
            </button>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="portal-dropdown fixed z-[9999] bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        minWidth: showCustom ? '280px' : '180px'
                    }}
                >
                    {!showCustom ? (
                        <div className="p-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(undefined);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-3 py-2 text-left rounded-lg hover:bg-[#22c55e]/10 transition-colors ${!value ? 'text-[#22c55e]' : 'text-gray-400'}`}
                            >
                                <span className="text-sm">All Time</span>
                            </button>

                            {periodOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handlePeriodSelect(opt.value)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-[#22c55e]/10 transition-colors ${value === opt.value ? 'text-[#22c55e] bg-[#22c55e]/5' : 'text-gray-300'}`}
                                >
                                    <span className="text-sm">{opt.label}</span>
                                    {value === opt.value && opt.value !== 'custom' && <Icons.Check className="w-3 h-3 ml-2 shrink-0" />}
                                    {opt.value === 'custom' && <Icons.ChevronRight className="w-3 h-3 ml-2 shrink-0 text-gray-500" />}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCustom(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <Icons.ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium text-white">Custom Range</span>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={tempStartDate}
                                        onChange={(e) => setTempStartDate(e.target.value)}
                                        className="w-full h-10 px-3 bg-[#0f1610] border border-[#2a3f2a] rounded-lg text-white text-sm focus:border-[#22c55e] focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={tempEndDate}
                                        onChange={(e) => setTempEndDate(e.target.value)}
                                        className="w-full h-10 px-3 bg-[#0f1610] border border-[#2a3f2a] rounded-lg text-white text-sm focus:border-[#22c55e] focus:outline-none [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleApplyCustom}
                                disabled={!tempStartDate || !tempEndDate}
                                className="w-full h-10 rounded-lg bg-[#22c55e] text-[#0a0f0a] font-semibold text-sm hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

function FilterDropdown({
    label,
    value,
    options,
    onChange,
    className = ''
}: {
    label: string;
    value?: string;
    options: Option[];
    onChange: (val: string | undefined) => void;
    className?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const isActive = !!value;

    // Click outside to close (modified for Portal)
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            // Check if click is on button
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }
            // Check if click is inside dropdown (we need a ref for the dropdown content if possible, 
            // but since it's portal, we can check if target is NOT closest .portal-dropdown)
            const target = event.target as Element;
            if (!target.closest('.portal-dropdown')) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Handle Window Resize / Scroll to close or update position
    // Only close on scroll OUTSIDE the dropdown
    useEffect(() => {
        if (!isOpen) return;

        const handleScroll = (e: Event) => {
            // Don't close if scrolling inside the dropdown
            const target = e.target as Element;
            if (target?.closest?.('.portal-dropdown')) {
                return;
            }
            setIsOpen(false);
        };

        const handleResize = () => setIsOpen(false);

        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left,
                width: Math.max(rect.width, 200) // Min width for dropdown
            });
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    return (
        <div className={`relative shrink-0 ${className}`}>
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation ${isActive
                        ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]'
                        : 'bg-[#1a2a1a] border-[#2a3f2a] text-gray-300 hover:border-gray-500 active:border-gray-500'
                    }`}
            >
                <span className="max-w-[80px] sm:max-w-[120px] truncate">
                    {selectedOption ? selectedOption.label : label}
                </span>
                <Icons.ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-[#22c55e]' : 'text-gray-500'
                    }`} />
            </button>

            {/* Portal Dropdown Menu */}
            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    className="portal-dropdown fixed z-[9999] bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl shadow-xl scrollbar-thin scrollbar-thumb-gray-700 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        minWidth: '200px'
                    }}
                >
                    <div className="p-1">
                        <button
                            type="button"
                            onClick={() => {
                                onChange(undefined);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 text-left rounded-lg hover:bg-[#22c55e]/10 transition-colors ${!value ? 'text-[#22c55e]' : 'text-gray-400'}`}
                        >
                            <span className="text-sm">All {label}s</span>
                        </button>

                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-[#22c55e]/10 transition-colors ${value === opt.value ? 'text-[#22c55e] bg-[#22c55e]/5' : 'text-gray-300'
                                    }`}
                            >
                                <span className="text-sm truncate">{opt.label}</span>
                                {value === opt.value && <Icons.Check className="w-3 h-3 ml-2 shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export function TransactionFilterBar({
    search,
    onSearchChange,
    filters,
    onFilterChange,
    onDateRangeChange,
    categories
}: FilterBarProps) {
    const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);

    // Check if any filter is active
    const hasActiveFilters = !!(filters.period || filters.type || filters.categoryId);

    // Clear all filters
    const handleClearFilters = () => {
        onFilterChange('period', undefined);
        onFilterChange('type', undefined);
        onFilterChange('categoryId', undefined);
        onFilterChange('startDate', undefined);
        onFilterChange('endDate', undefined);
        setSelectedParentId(undefined);
    };

    // Handle period change - calculate date range
    const handlePeriodChange = (period: string | undefined) => {
        onFilterChange('period', period);
        if (period && period !== 'custom') {
            const { startDate, endDate } = getDateRange(period);
            onDateRangeChange(startDate, endDate);
        } else if (!period) {
            // Clear date filters
            onFilterChange('startDate', undefined);
            onFilterChange('endDate', undefined);
        }
    };

    // Filter categories by type if type filter is active
    const filteredCategories = filters.type
        ? categories.filter(c => c.type === filters.type)
        : categories;

    // Get parent categories only
    const parentCategories = filteredCategories;

    // Find selected parent and its subcategories
    const selectedParent = parentCategories.find(c => c.categoryId === selectedParentId);
    const hasSubcategories = selectedParent?.subcategories && selectedParent.subcategories.length > 0;

    // Handle parent category change
    const handleParentChange = (parentId: string | undefined) => {
        setSelectedParentId(parentId);
        // If selecting a parent, set it as the filter (can be refined with sub-category)
        onFilterChange('categoryId', parentId);
    };

    // Handle sub-category change
    const handleSubcategoryChange = (subId: string | undefined) => {
        if (subId) {
            onFilterChange('categoryId', subId);
        } else {
            // "All" in subcategory means use parent category
            onFilterChange('categoryId', selectedParentId);
        }
    };

    // Sync selectedParentId when filters change externally
    useEffect(() => {
        if (!filters.categoryId) {
            setSelectedParentId(undefined);
            return;
        }

        // Check if it's a parent category
        const isParent = parentCategories.find(c => c.categoryId === filters.categoryId);
        if (isParent) {
            setSelectedParentId(filters.categoryId);
            return;
        }

        // Check if it's a subcategory - find its parent
        for (const parent of parentCategories) {
            const sub = parent.subcategories?.find(s => s.categoryId === filters.categoryId);
            if (sub) {
                setSelectedParentId(parent.categoryId);
                return;
            }
        }
    }, [filters.categoryId, parentCategories]);

    return (
        <div className="space-y-3 sm:space-y-4 px-3 sm:px-4 py-2 sticky top-12 sm:top-14 bg-[#0a0f0a] z-10 pb-3 sm:pb-4 border-b border-[#1a2f1a]">
            {/* Search Bar */}
            <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search transactions"
                    className="w-full h-10 sm:h-11 pl-9 sm:pl-10 pr-4 bg-[#1a2a1a] text-white rounded-xl border border-[#2a3f2a] focus:border-[#22c55e] focus:outline-none placeholder:text-gray-500 text-xs sm:text-sm transition-all shadow-inner"
                />
            </div>

            {/* Filter Chips - Scrollable Row */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1 min-h-[38px] sm:min-h-[42px]">
                {/* Clear Filters Button - Only show when filters are active */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 active:bg-red-500/20 hover:border-red-500/50 shrink-0 touch-manipulation"
                        title="Clear filters"
                    >
                        <Icons.X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                )}

                {/* Period Filter */}
                <PeriodFilterDropdown
                    value={filters.period}
                    customStartDate={filters.startDate}
                    customEndDate={filters.endDate}
                    onChange={handlePeriodChange}
                    onCustomDateChange={onDateRangeChange}
                />

                {/* Type Filter */}
                <FilterDropdown
                    label="Type"
                    value={filters.type}
                    onChange={(val) => {
                        onFilterChange('type', val);
                        // Reset category when type changes
                        setSelectedParentId(undefined);
                        onFilterChange('categoryId', undefined);
                    }}
                    options={[
                        { value: 'income', label: 'Income' },
                        { value: 'expense', label: 'Expense' }
                    ]}
                />

                {/* Parent Category Filter */}
                <FilterDropdown
                    label="Category"
                    value={selectedParentId}
                    onChange={handleParentChange}
                    options={parentCategories.map(c => ({ value: c.categoryId, label: c.name }))}
                />

                {/* Sub-category Filter - Only show if parent has subcategories */}
                {hasSubcategories && (
                    <FilterDropdown
                        label="Sub-category"
                        value={filters.categoryId !== selectedParentId ? filters.categoryId : undefined}
                        onChange={handleSubcategoryChange}
                        options={selectedParent!.subcategories!.map(s => ({ value: s.categoryId, label: s.name }))}
                    />
                )}
            </div>
        </div>
    );
}
