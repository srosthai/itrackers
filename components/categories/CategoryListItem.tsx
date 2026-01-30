// =====================================================
// CATEGORY LIST ITEM
//
// Displays category with expandable subcategories
// Action menu with Edit/Delete options
// Shows total transaction amount per category
// =====================================================

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from '@/components/ui';
import { Category } from '@/hooks/useCategories';
import { useLanguage } from '@/components/providers';

interface CategoryListItemProps {
    category: Category;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
}

export function CategoryListItem({ category, onEdit, onDelete }: CategoryListItemProps) {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const subcategoryCount = category.subcategories?.length || 0;

    // Color based on type
    const accentColor = category.type === 'income' ? '#22c55e' : '#ef4444';
    const accentBg = category.type === 'income' ? 'bg-[#22c55e]/15' : 'bg-[#ef4444]/15';

    // Format currency
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Calculate total including subcategories
    const getTotalAmount = (): number => {
        let total = category.totalAmount || 0;
        if (category.subcategories) {
            category.subcategories.forEach(sub => {
                total += sub.totalAmount || 0;
            });
        }
        return total;
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openMenuId) {
                const menuElement = menuRefs.current.get(openMenuId);
                if (menuElement && !menuElement.contains(event.target as Node)) {
                    setOpenMenuId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openMenuId]);

    const toggleMenu = useCallback((e: React.MouseEvent, menuId: string) => {
        e.stopPropagation();
        setOpenMenuId(prev => prev === menuId ? null : menuId);
    }, []);

    const handleEdit = useCallback((e: React.MouseEvent, cat: Category) => {
        e.stopPropagation();
        setOpenMenuId(null);
        onEdit?.(cat);
    }, [onEdit]);

    const handleDelete = useCallback((e: React.MouseEvent, cat: Category) => {
        e.stopPropagation();
        setOpenMenuId(null);
        onDelete?.(cat);
    }, [onDelete]);

    const setMenuRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
        if (el) {
            menuRefs.current.set(id, el);
        } else {
            menuRefs.current.delete(id);
        }
    }, []);

    // Action Menu Component
    const ActionMenu = ({ cat, isSubcategory = false }: { cat: Category; isSubcategory?: boolean }) => {
        const menuId = cat.categoryId;
        const isOpen = openMenuId === menuId;

        if (!onEdit && !onDelete) return null;

        return (
            <div className="relative" ref={setMenuRef(menuId)}>
                <button
                    onClick={(e) => toggleMenu(e, menuId)}
                    className={`${isSubcategory ? 'p-1.5' : 'p-1.5 sm:p-2'} text-gray-500 hover:text-white active:text-white hover:bg-white/10 active:bg-white/10 rounded-lg transition-colors touch-manipulation`}
                    aria-label={t('common.edit')}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <Icons.DotsVertical className={isSubcategory ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'} />
                </button>

                {isOpen && (
                    <div
                        className={`absolute right-0 top-full mt-1 z-50 ${isSubcategory ? 'min-w-[120px]' : 'min-w-[140px]'} bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl shadow-2xl overflow-hidden`}
                        role="menu"
                    >
                        {onEdit && (
                            <button
                                onClick={(e) => handleEdit(e, cat)}
                                className={`w-full flex items-center gap-3 ${isSubcategory ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm'} text-gray-300 hover:bg-[#2a3f2a] hover:text-white transition-colors`}
                                role="menuitem"
                            >
                                <Icons.Pencil className={isSubcategory ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                                {t('common.edit')}
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => handleDelete(e, cat)}
                                className={`w-full flex items-center gap-3 ${isSubcategory ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm'} text-red-400 hover:bg-red-500/10 transition-colors`}
                                role="menuitem"
                            >
                                <Icons.Trash className={isSubcategory ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                                {t('common.delete')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="rounded-xl overflow-visible">
            {/* Parent Category */}
            <div
                className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl transition-all touch-manipulation ${
                    hasSubcategories ? 'cursor-pointer hover:bg-[#1f2f1f] active:bg-[#1f2f1f]' : ''
                } ${isExpanded && hasSubcategories ? 'rounded-b-none border-b-0' : ''}`}
                onClick={() => hasSubcategories && setIsExpanded(!isExpanded)}
            >
                {/* Icon */}
                <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${accentBg}`}
                    style={{ color: accentColor }}
                >
                    <Icons.Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                {/* Name & Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{category.name}</p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                        {hasSubcategories && (
                            <span>
                                {subcategoryCount} {subcategoryCount === 1 ? 'subcategory' : 'subcategories'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Amount */}
                <div className="text-right mr-0.5 sm:mr-1">
                    <p className={`text-xs sm:text-sm font-semibold ${category.type === 'income' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {formatAmount(getTotalAmount())}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <ActionMenu cat={category} />

                    {hasSubcategories && (
                        <div className="p-1.5 sm:p-2 text-gray-500">
                            <Icons.ChevronDown
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Subcategories */}
            {isExpanded && hasSubcategories && (
                <div className="bg-[#0f1610] border border-t-0 border-[#2a3f2a] rounded-b-xl overflow-visible">
                    {category.subcategories!.map((sub, index) => (
                        <div
                            key={sub.categoryId}
                            className={`flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 hover:bg-[#1a2a1a]/50 active:bg-[#1a2a1a]/50 transition-colors touch-manipulation ${
                                index !== category.subcategories!.length - 1 ? 'border-b border-[#2a3f2a]/50' : ''
                            }`}
                        >
                            {/* Indent + connector */}
                            <div className="w-9 sm:w-10 flex justify-center">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-l-2 border-b-2 border-[#2a3f2a] rounded-bl-md" />
                            </div>

                            {/* Subcategory Icon */}
                            <div
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-[#1a2a1a]"
                                style={{ color: accentColor }}
                            >
                                <Icons.Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-60" />
                            </div>

                            {/* Name */}
                            <p className="flex-1 text-xs sm:text-sm text-gray-300 truncate">{sub.name}</p>

                            {/* Subcategory Amount */}
                            <p className={`text-[10px] sm:text-xs font-medium ${category.type === 'income' ? 'text-[#22c55e]/70' : 'text-[#ef4444]/70'}`}>
                                {formatAmount(sub.totalAmount || 0)}
                            </p>

                            {/* Subcategory Actions */}
                            <ActionMenu cat={sub} isSubcategory />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
