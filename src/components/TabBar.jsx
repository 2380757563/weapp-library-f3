// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Home, Search, PlusCircle, User } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function TabBar({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'home',
    icon: Home,
    label: '首页'
  }, {
    id: 'search',
    icon: Search,
    label: '搜索'
  }, {
    id: 'add',
    icon: PlusCircle,
    label: '添加'
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
        return <button key={tab.id} className={cn('flex flex-col items-center justify-center flex-1 py-2', isActive ? 'text-amber-600' : 'text-gray-400')} onClick={() => onTabChange(tab.id)}>
              <Icon className={cn('w-6 h-6', tab.id === 'add' && 'w-8 h-8')} />
              <span className={cn('text-xs mt-1', tab.id === 'add' && 'hidden')}>
                {tab.label}
              </span>
            </button>;
      })}
      </div>
    </div>;
}