// =====================================================
// SPENDING CHART COMPONENT
//
// Shows spending trend with simple line visualization
// Features: Period filter, weekly/daily breakdown, tooltips
// =====================================================

'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/components/providers';

type Period = 'today' | 'week' | 'month' | 'year';

interface TooltipData {
    index: number;
    value: number;
    label: string;
    x: number;
    y: number;
}

interface SpendingChartProps {
    amount: number;
    change: number;
    weeklyData?: number[];
    dailyData?: number[];
    monthlyData?: number[];
    onPeriodChange?: (period: Period) => void;
}

export function SpendingChart({
    amount,
    change,
    weeklyData,
    dailyData,
    monthlyData,
    onPeriodChange,
}: SpendingChartProps) {
    const { t } = useLanguage();
    const [period, setPeriod] = useState<Period>('month');
    const [tooltip, setTooltip] = useState<TooltipData | null>(null);

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);

    // Handle period change
    const handlePeriodChange = (newPeriod: Period) => {
        setPeriod(newPeriod);
        onPeriodChange?.(newPeriod);
    };

    // Get data based on selected period
    const getData = (): number[] => {
        switch (period) {
            case 'today':
                // Hourly data (6 points: 4h intervals)
                return dailyData || [0, 0, 0, 0, 0, 0];
            case 'week':
                // Daily data (7 days)
                return dailyData || [0, 0, 0, 0, 0, 0, 0];
            case 'month':
                // Weekly data (4 weeks)
                return weeklyData || [0, 0, 0, 0];
            case 'year':
                // Monthly data (12 months)
                return monthlyData || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            default:
                return weeklyData || [0, 0, 0, 0];
        }
    };

    // Get labels based on selected period
    const getLabels = (): string[] => {
        switch (period) {
            case 'today':
                return ['6AM', '10AM', '2PM', '6PM', '10PM', 'Now'];
            case 'week':
                return [
                    t('chart.mon'),
                    t('chart.tue'),
                    t('chart.wed'),
                    t('chart.thu'),
                    t('chart.fri'),
                    t('chart.sat'),
                    t('chart.sun'),
                ];
            case 'month':
                return [
                    t('chart.week1'),
                    t('chart.week2'),
                    t('chart.week3'),
                    t('chart.week4'),
                ];
            case 'year':
                return [
                    t('chart.jan'),
                    t('chart.feb'),
                    t('chart.mar'),
                    t('chart.apr'),
                    t('chart.may'),
                    t('chart.jun'),
                    t('chart.jul'),
                    t('chart.aug'),
                    t('chart.sep'),
                    t('chart.oct'),
                    t('chart.nov'),
                    t('chart.dec'),
                ];
            default:
                return [t('chart.week1'), t('chart.week2'), t('chart.week3'), t('chart.week4')];
        }
    };

    // Get comparison text based on period
    const getComparisonText = (): string => {
        switch (period) {
            case 'today':
                return t('chart.vsYesterday');
            case 'week':
                return t('chart.vsLastWeek');
            case 'month':
                return t('chart.vsLastMonth');
            case 'year':
                return t('chart.vsLastYear');
            default:
                return t('chart.vsLastMonth');
        }
    };

    const rawData = getData();
    const labels = getLabels();

    // For year view, show individual months; for others, show cumulative
    const chartData: number[] = period === 'year'
        ? rawData
        : (() => {
            const cumulative: number[] = [];
            let sum = 0;
            rawData.forEach(v => {
                sum += v;
                cumulative.push(sum);
            });
            return cumulative;
        })();

    // Normalize data points to 0-100 scale for SVG
    const maxValue = Math.max(...chartData, 1);
    const dataPoints = chartData.map(v => (v / maxValue) * 100);

    // Check if there's any actual data
    const hasData = rawData.some(v => v > 0);

    // Period filter buttons
    const periods: { key: Period; label: string }[] = [
        { key: 'today', label: t('chart.today') },
        { key: 'week', label: t('chart.week') },
        { key: 'month', label: t('chart.month') },
        { key: 'year', label: t('chart.year') },
    ];

    // Determine how many labels to show based on period
    const displayLabels = period === 'year'
        ? labels.filter((_, i) => i % 3 === 0) // Show every 3rd month for year
        : labels;

    // Format currency for tooltip
    const formatCurrency = useCallback((value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }, []);

    // Handle tooltip show/hide
    const handleShowTooltip = useCallback((index: number, x: number, y: number) => {
        const value = period === 'year' ? rawData[index] : chartData[index];
        setTooltip({
            index,
            value,
            label: labels[index],
            x,
            y,
        });
    }, [period, rawData, chartData, labels]);

    const handleHideTooltip = useCallback(() => {
        setTooltip(null);
    }, []);

    return (
        <div className="rounded-2xl bg-[#0f1610] p-4 sm:p-5 border border-[#1a2f1a]">
            {/* Header with Period Filter */}
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-white">{t('chart.spendingTrend')}</h3>
                <div className="flex gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-[#1a2a1a] rounded-lg border border-[#2a3f2a]">
                    {periods.map(p => (
                        <button
                            key={p.key}
                            onClick={() => handlePeriodChange(p.key)}
                            className={`px-2 sm:px-2.5 py-1.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-md transition-all touch-manipulation ${
                                period === p.key
                                    ? 'bg-[#22c55e] text-[#0a0f0a]'
                                    : 'text-gray-400 hover:text-white active:text-white'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Amount and Change */}
            <div className="flex items-baseline gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
                <span className="text-2xl sm:text-3xl font-bold text-white">{formattedAmount}</span>
                <span className={`text-xs sm:text-sm font-medium ${change <= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {change === 0 ? '' : change > 0 ? '+' : ''}{change.toFixed(1)}% {getComparisonText()}
                </span>
            </div>

            {/* Line Chart */}
            <div className="relative h-20 sm:h-24 mb-3 sm:mb-4" onMouseLeave={handleHideTooltip}>
                {/* Tooltip */}
                {tooltip && (
                    <div
                        className="absolute z-10 px-3 py-2 text-xs font-medium text-white bg-[#1a2a1a] border border-[#2a3f2a] rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
                        style={{
                            left: `${(tooltip.x / 300) * 100}%`,
                            top: `${(tooltip.y / 80) * 100}%`,
                            marginTop: '-8px',
                        }}
                    >
                        <div className="text-[#22c55e] font-bold">{formatCurrency(tooltip.value)}</div>
                        <div className="text-gray-400 text-center">{tooltip.label}</div>
                        {/* Arrow */}
                        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                            <div className="border-4 border-transparent border-t-[#2a3f2a]" />
                        </div>
                    </div>
                )}

                {!hasData ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        {t('chart.noData')}
                    </div>
                ) : period === 'year' ? (
                    /* Bar chart for year view */
                    <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="300" y2="40" stroke="#1a2f1a" strokeWidth="1" strokeDasharray="4" />
                        <line x1="0" y1="80" x2="300" y2="80" stroke="#1a2f1a" strokeWidth="1" />

                        {/* Bars for each month */}
                        {dataPoints.map((point, i) => {
                            const barWidth = 300 / 12 - 4;
                            const x = (i / 12) * 300 + 2;
                            const height = (point / 100) * 75;
                            const barY = 80 - height;
                            return (
                                <g key={i}>
                                    <rect
                                        x={x}
                                        y={barY}
                                        width={barWidth}
                                        height={height}
                                        fill={tooltip?.index === i ? '#16a34a' : (point > 0 ? '#22c55e' : '#1a2f1a')}
                                        rx="2"
                                        opacity={point > 0 ? (tooltip?.index === i ? 1 : 0.8) : 0.3}
                                        className="cursor-pointer transition-opacity"
                                        onMouseEnter={() => handleShowTooltip(i, x + barWidth / 2, barY)}
                                        onMouseLeave={handleHideTooltip}
                                    />
                                    {/* Larger invisible hit area for easier hover */}
                                    <rect
                                        x={x - 2}
                                        y={0}
                                        width={barWidth + 4}
                                        height={80}
                                        fill="transparent"
                                        className="cursor-pointer"
                                        onMouseEnter={() => handleShowTooltip(i, x + barWidth / 2, barY)}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                ) : (
                    /* Line chart for other periods */
                    <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="300" y2="40" stroke="#1a2f1a" strokeWidth="1" strokeDasharray="4" />

                        {/* Chart line */}
                        {dataPoints.length > 1 && (
                            <>
                                <path
                                    d={`M ${dataPoints.map((point, i) => `${(i / (dataPoints.length - 1)) * 300},${80 - (point / 100) * 80}`).join(' L ')}`}
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Gradient fill */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={`M 0,80 L ${dataPoints.map((point, i) => `${(i / (dataPoints.length - 1)) * 300},${80 - (point / 100) * 80}`).join(' L ')} L 300,80 Z`}
                                    fill="url(#chartGradient)"
                                />

                                {/* Data points */}
                                {dataPoints.map((point, i) => {
                                    const cx = (i / (dataPoints.length - 1)) * 300;
                                    const cy = 80 - (point / 100) * 80;
                                    const isHovered = tooltip?.index === i;
                                    const isLast = i === dataPoints.length - 1;
                                    return (
                                        <g key={i}>
                                            {/* Visible point */}
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={isHovered ? 6 : (isLast ? 4 : 2)}
                                                fill="#22c55e"
                                                opacity={isHovered || isLast ? 1 : 0.5}
                                                className="transition-all duration-150"
                                            />
                                            {/* Hover ring for selected point */}
                                            {isHovered && (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={10}
                                                    fill="#22c55e"
                                                    opacity={0.2}
                                                />
                                            )}
                                            {/* Larger invisible hit area for easier hover */}
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={15}
                                                fill="transparent"
                                                className="cursor-pointer"
                                                onMouseEnter={() => handleShowTooltip(i, cx, cy)}
                                            />
                                        </g>
                                    );
                                })}
                            </>
                        )}
                    </svg>
                )}
            </div>

            {/* Labels */}
            <div className={`flex justify-between text-[10px] sm:text-xs text-gray-500 ${period === 'year' ? 'px-1 sm:px-2' : ''}`}>
                {displayLabels.map((label, i) => (
                    <span key={i} className="truncate">{label}</span>
                ))}
            </div>
        </div>
    );
}
