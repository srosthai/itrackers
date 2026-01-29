// =====================================================
// CATEGORY LIST ITEM
//
// Displays category with expandable subcategories
// Clean hierarchy visualization
// =====================================================

'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui';
import { Category } from '@/hooks/useCategories';

interface CategoryListItemProps {
    category: Category;
    onEdit?: (category: Category) => void;
    onDelete?: (category: Category) => void;
}

export function CategoryListItem({ category, onEdit, onDelete }: CategoryListItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const subcategoryCount = category.subcategories?.length || 0;

    // Color based on type
    const accentColor = category.type === 'income' ? '#22c55e' : '#ef4444';
    const accentBg = category.type === 'income' ? 'bg-[#22c55e]/15' : 'bg-[#ef4444]/15';

    return (
        <div className="rounded-xl overflow-hidden">
            {/* Parent Category */}
            <div
                className={`flex items-center gap-3 p-3 bg-[#1a2a1a] border border-[#2a3f2a] rounded-xl transition-all ${
                    hasSubcategories ? 'cursor-pointer hover:bg-[#1f2f1f]' : ''
                } ${isExpanded && hasSubcategories ? 'rounded-b-none border-b-0' : ''}`}
                onClick={() => hasSubcategories && setIsExpanded(!isExpanded)}
            >
                {/* Icon */}
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentBg}`}
                    style={{ color: accentColor }}
                >
                    <Icons.Tag className="w-5 h-5" />
                </div>

                {/* Name & Count */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{category.name}</p>
                    {hasSubcategories && (
                        <p className="text-xs text-gray-500">
                            {subcategoryCount} {subcategoryCount === 1 ? 'subcategory' : 'subcategories'}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(category);
                            }}
                            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Icons.Pencil className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(category);
                            }}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Icons.Trash className="w-4 h-4" />
                        </button>
                    )}
                    {hasSubcategories && (
                        <div className="p-2 text-gray-500">
                            <Icons.ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-180' : ''
                                }`}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Subcategories */}
            {isExpanded && hasSubcategories && (
                <div className="bg-[#0f1610] border border-t-0 border-[#2a3f2a] rounded-b-xl">
                    {category.subcategories!.map((sub, index) => (
                        <div
                            key={sub.categoryId}
                            className={`flex items-center gap-3 px-3 py-2.5 hover:bg-[#1a2a1a]/50 transition-colors ${
                                index !== category.subcategories!.length - 1 ? 'border-b border-[#2a3f2a]/50' : ''
                            }`}
                        >
                            {/* Indent + connector */}
                            <div className="w-10 flex justify-center">
                                <div className="w-5 h-5 border-l-2 border-b-2 border-[#2a3f2a] rounded-bl-md" />
                            </div>

                            {/* Subcategory Icon */}
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1a2a1a]"
                                style={{ color: accentColor }}
                            >
                                <Icons.Tag className="w-4 h-4 opacity-60" />
                            </div>

                            {/* Name */}
                            <p className="flex-1 text-sm text-gray-300 truncate">{sub.name}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-0.5 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(sub)}
                                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                    >
                                        <Icons.Pencil className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(sub)}
                                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                    >
                                        <Icons.Trash className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
