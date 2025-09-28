// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
// @ts-ignore;
import { BookOpen, Clock, CheckCircle2 } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function BookCard({
  book,
  onPress
}) {
  const statusConfig = {
    reading: {
      label: '在读',
      icon: Clock,
      color: 'bg-blue-100 text-blue-800'
    },
    read: {
      label: '已读',
      icon: CheckCircle2,
      color: 'bg-green-100 text-green-800'
    },
    unread: {
      label: '未读',
      icon: BookOpen,
      color: 'bg-gray-100 text-gray-800'
    }
  };
  const status = statusConfig[book.status] || statusConfig.unread;
  return <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-95" onClick={() => onPress?.(book)}>
      <div className="flex">
        <div className="w-24 h-36 bg-gray-100 flex-shrink-0">
          {book.cover ? <img src={book.cover} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>}
        </div>
        <div className="flex-1 p-4">
          <CardHeader className="p-0 mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <Badge className={cn('text-xs', status.color)}>
                <status.icon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              <span className="text-xs text-gray-500">{book.category}</span>
            </div>
            {book.rating && <div className="flex items-center mt-2">
                <span className="text-sm text-amber-500">★</span>
                <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
              </div>}
          </CardContent>
        </div>
      </div>
    </Card>;
}