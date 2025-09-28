// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
// @ts-ignore;
import { Badge } from '@/components/ui';

export function Book3DCard({
  book,
  onPress
}) {
  const statusConfig = {
    reading: {
      label: '在读',
      icon: Clock,
      color: 'bg-blue-500 text-white'
    },
    read: {
      label: '已读',
      icon: CheckCircle2,
      color: 'bg-green-500 text-white'
    },
    unread: {
      label: '未读',
      icon: BookOpen,
      color: 'bg-gray-500 text-white'
    }
  };
  const status = statusConfig[book.status] || statusConfig.unread;
  return <div className="relative cursor-pointer group transition-transform duration-200 ease-out hover:scale-105 hover:-translate-y-1 active:scale-95" onClick={() => onPress?.(book)}>
      {/* 3D效果 */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg transform -rotate-1 group-hover:-rotate-2 transition-transform opacity-50"></div>
        
        {/* 书籍主体 */}
        <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="flex">
            <div className="w-24 h-36 bg-gradient-to-b from-gray-100 to-gray-200 flex-shrink-0">
              {book.img ? <img src={book.img} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>}
            </div>
            <div className="flex-1 p-4">
              <h3 className="font-bold text-lg line-clamp-2 text-gray-800">{book.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{book.author}</p>
              <div className="flex items-center justify-between mt-3">
                <Badge className={`text-xs ${status.color}`}>
                  <status.icon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
                <span className="text-xs text-gray-500">{book.publisher}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}