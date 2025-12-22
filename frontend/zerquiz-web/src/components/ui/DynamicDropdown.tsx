import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface DropdownItem {
  id: string;
  code: string;
  value: string;
  displayOrder: number;
  iconName?: string;
  colorCode?: string;
  isActive: boolean;
  metadata?: string;
  parentId?: string;
  level?: number;
  hasChildren?: boolean;
}

interface DropdownResponse {
  groupCode: string;
  groupName: string;
  language: string;
  items: DropdownItem[];
  totalCount: number;
}

interface DynamicDropdownProps {
  groupCode: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showIcons?: boolean;
  hierarchical?: boolean;
  includeInactive?: boolean;
}

export function DynamicDropdown({
  groupCode,
  value,
  onChange,
  multiple = false,
  placeholder,
  disabled = false,
  className = '',
  showIcons = false,
  hierarchical = false,
  includeInactive = false,
}: DynamicDropdownProps) {
  const { currentLanguage, t } = useLanguage();
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDropdownData();
  }, [groupCode, currentLanguage, hierarchical, includeInactive]);

  const fetchDropdownData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const endpoint = hierarchical
        ? `/api/Definitions/dropdown/${groupCode}/hierarchical`
        : `/api/Definitions/dropdown/${groupCode}`;

      const queryParams = new URLSearchParams({
        language: currentLanguage,
        includeInactive: includeInactive.toString(),
      });

      const response = await fetch(
        `${import.meta.env.VITE_CORE_API_URL || 'http://localhost:5002'}${endpoint}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dropdown data: ${response.statusText}`);
      }

      const data: DropdownResponse = await response.json();
      setItems(data.items);
    } catch (err) {
      console.error('Error fetching dropdown:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      onChange(selectedOptions);
    } else {
      onChange(e.target.value);
    }
  };

  const renderOption = (item: DropdownItem) => {
    const indent = hierarchical && item.level ? '  '.repeat(item.level) : '';
    const icon = showIcons && item.iconName ? `${item.iconName} ` : '';
    const prefix = item.hasChildren ? '📁 ' : '';

    return (
      <option
        key={item.id}
        value={item.code}
        style={{
          color: item.colorCode || 'inherit',
          fontWeight: item.hasChildren ? 'bold' : 'normal',
        }}
        disabled={!item.isActive}
      >
        {indent}{prefix}{icon}{item.value}
      </option>
    );
  };

  if (loading) {
    return (
      <select disabled className={`dropdown-loading ${className}`}>
        <option>{t('loading')}...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select disabled className={`dropdown-error ${className}`}>
        <option>{t('error')}: {error}</option>
      </select>
    );
  }

  return (
    <select
      value={value}
      onChange={handleSelectChange}
      multiple={multiple}
      disabled={disabled}
      className={`dynamic-dropdown ${className}`}
    >
      {placeholder && !multiple && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {items.map((item) => renderOption(item))}
    </select>
  );
}

// ============================================
// HOOK: useDynamicDropdown (alternatif kullanım)
// ============================================

export function useDynamicDropdown(groupCode: string, options?: {
  hierarchical?: boolean;
  includeInactive?: boolean;
}) {
  const { currentLanguage } = useLanguage();
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [groupCode, currentLanguage, options?.hierarchical, options?.includeInactive]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const endpoint = options?.hierarchical
        ? `/api/Definitions/dropdown/${groupCode}/hierarchical`
        : `/api/Definitions/dropdown/${groupCode}`;

      const queryParams = new URLSearchParams({
        language: currentLanguage,
        includeInactive: (options?.includeInactive || false).toString(),
      });

      const response = await fetch(
        `${import.meta.env.VITE_CORE_API_URL || 'http://localhost:5002'}${endpoint}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch dropdown data: ${response.statusText}`);
      }

      const data: DropdownResponse = await response.json();
      setItems(data.items);
    } catch (err) {
      console.error('Error fetching dropdown:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getItemByCode = (code: string) => {
    return items.find((item) => item.code === code);
  };

  const getItemsByParentId = (parentId?: string) => {
    return items.filter((item) => item.parentId === parentId);
  };

  const refresh = () => {
    fetchData();
  };

  return {
    items,
    loading,
    error,
    getItemByCode,
    getItemsByParentId,
    refresh,
  };
}




