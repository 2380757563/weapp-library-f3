// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Library, ScanLine, User } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function BottomNav({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'library',
    icon: Library,
    label: '书库'
  }, {
    id: 'scan',
    icon: ScanLine,
    label: '扫描'
  }, {
    id: 'profile',
    icon: User,
    label: '我的'
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} className={cn('flex flex-col items-center justify-center flex-1 py-2 transition-colors', isActive ? 'text-blue-600' : 'text-gray-400')} onClick={() => onTabChange(tab.id)}>
              <Icon className={cn('w-6 h-6', isActive && 'scale-110')} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}