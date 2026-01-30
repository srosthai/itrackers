// =====================================================
// TRANSACTION ITEM
//
// Single transaction row with icon, details, and amount
// Includes Action Menu (Edit/Delete)
// =====================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/components/providers';

interface TransactionItemProps {
    note: string;
    categoryName: string;
    amount: number;
    type: 'income' | 'expense';
    date?: string; // ISO date string
    onEdit?: () => void;
    onDelete?: () => void;
}

export function TransactionItem({ note, categoryName, amount, type, date, onEdit, onDelete }: TransactionItemProps) {
    const { t, language } = useLanguage();
    const isIncome = type === 'income';

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);

    // Format date for display
    const formattedDate = date
        ? new Date(date).toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', {
            month: 'short',
            day: 'numeric',
        })
        : '';

    // Menu State
    const [showMenu, setShowMenu] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu on scroll/resize
    useEffect(() => {
        const handleScroll = () => { if (showMenu) setShowMenu(false); };
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        }
    }, [showMenu]);

    // Click outside handler
    useEffect(() => {
        if (!showMenu) return;
        function handleClickOutside(event: MouseEvent) {
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }
            const target = event.target as Element;
            if (!target.closest('.action-menu-portal')) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const handleToggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!showMenu && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Position menu: Align right edge with button right edge, below button
            const menuWidth = 140;
            setCoords({
                top: rect.bottom + 4,
                left: rect.right - menuWidth,
            });
            setShowMenu(true);
        } else {
            setShowMenu(false);
        }
    };

    // Determine Icon & Color base
    let Icon = Icons.Receipt;
    let bgClass = 'bg-[#1a2a1a]';
    let iconClass = 'text-gray-400';

    if (isIncome) {
        Icon = Icons.BankNotes;
        bgClass = 'bg-[#22c55e]/10';
        iconClass = 'text-[#22c55e]';
    } else if (categoryName.toLowerCase().includes('food')) {
        Icon = Icons.Receipt;
        bgClass = 'bg-orange-500/10';
        iconClass = 'text-orange-500';
    } else if (categoryName.toLowerCase().includes('transport') || categoryName.toLowerCase().includes('car')) {
        Icon = Icons.ArrowsRightLeft; // Fallback icon
        bgClass = 'bg-blue-500/10';
        iconClass = 'text-blue-500';
    } else if (categoryName.toLowerCase().includes('shopping')) {
        Icon = Icons.Tag;
        bgClass = 'bg-purple-500/10';
        iconClass = 'text-purple-500';
    }

    return (
        <div className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-3 sm:px-4 hover:bg-[#1a2a1a]/50 active:bg-[#1a2a1a]/50 transition-colors rounded-xl mx-1.5 sm:mx-2 cursor-pointer relative group touch-manipulation">
            {/* Icon */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${bgClass}`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconClass}`} />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-white truncate mb-0.5">
                    {note || categoryName}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {categoryName}{formattedDate && ` · ${formattedDate}`}
                </p>
            </div>

            {/* Amount & Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-right shrink-0">
                    <p className={`text-xs sm:text-sm font-semibold ${isIncome ? 'text-[#22c55e]' : 'text-red-500'}`}>
                        {isIncome ? '+' : '-'}{formattedAmount}
                    </p>
                </div>

                {/* Menu Button - Visible on hover/touch or always? */}
                {/* Always visible on mobile, maybe hover on desktop. Let's make it always visible but subtle */}
                <button
                    ref={buttonRef}
                    onClick={handleToggleMenu}
                    className={`p-1.5 sm:p-2 rounded-full hover:bg-white/10 active:bg-white/10 text-gray-500 hover:text-white active:text-white transition-colors touch-manipulation ${showMenu ? 'bg-white/10 text-white' : ''}`}
                >
                    <Icons.DotsVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>

            {/* Action Menu Portal */}
            {showMenu && typeof document !== 'undefined' && createPortal(
                <div
                    className="action-menu-portal fixed z-[9999] bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl shadow-xl overflow-hidden min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: coords.top,
                        left: coords.left,
                    }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                        <Icons.Pencil className="w-4 h-4" />
                        {t('common.edit')}
                    </button>
                    <div className="h-px bg-[#2a3f2a]" />
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
                    >
                        <Icons.Trash className="w-4 h-4" />
                        {t('common.delete')}
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
}
