// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Star, Clock, CheckCircle2, Edit3, Trash2, ArrowLeft } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, Badge, useToast } from '@/components/ui';

export default function BookDetail(props) {
  const {
    $w
  } = props;
  const bookId = props.$w.page.dataset.params?.bookId;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadBookDetail();
  }, [bookId]);
  const loadBookDetail = async () => {
    try {
      setLoading(true);
      // 模拟获取书籍详情
      const mockBook = {
        id: bookId,
        title: '活着',
        author: '余华',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        status: 'read',
        category: '文学',
        rating: 4.8,
        isbn: '9787506365437',
        publisher: '作家出版社',
        publishDate: '2012-08-01',
        pages: 191,
        description: '《活着》是作家余华的代表作之一，讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，因为嗜赌成性，卖掉了家里的田地，一贫如洗，穷困潦倒，在经历了人生的大起大落之后，福贵渐渐领悟到了人生的真谛。',
        notes: '这本书让我深刻理解了生命的意义。',
        startDate: '2024-01-15',
        endDate: '2024-02-20'
      };
      setBook(mockBook);
    } catch (error) {
      toast({
        title: '加载失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = newStatus => {
    setBook({
      ...book,
      status: newStatus
    });
    toast({
      title: '状态更新',
      description: `已将《${book.title}》标记为${getStatusText(newStatus)}`
    });
  };
  const getStatusText = status => {
    const statusMap = {
      unread: '未读',
      reading: '在读',
      read: '已读'
    };
    return statusMap[status] || status;
  };
  const getStatusColor = status => {
    const colorMap = {
      unread: 'bg-gray-100 text-gray-800',
      reading: 'bg-blue-100 text-blue-800',
      read: 'bg-green-100 text-green-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>;
  }
  if (!book) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">书籍信息不存在</p>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-lg font-semibold">书籍详情</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 书籍信息卡片 */}
        <Card>
          <div className="flex">
            <img src={book.cover} alt={book.title} className="w-32 h-48 object-cover rounded-l-lg" />
            <div className="flex-1 p-4">
              <h2 className="text-xl font-bold mb-1">{book.title}</h2>
              <p className="text-gray-600 mb-2">{book.author}</p>
              <Badge className={getStatusColor(book.status)}>
                {getStatusText(book.status)}
              </Badge>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-amber-500 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{book.rating}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 详细信息 */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">详细信息</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">出版社</span>
              <span>{book.publisher}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">出版日期</span>
              <span>{book.publishDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">页数</span>
              <span>{book.pages}页</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ISBN</span>
              <span>{book.isbn}</span>
            </div>
          </CardContent>
        </Card>

        {/* 简介 */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">简介</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">{book.description}</p>
          </CardContent>
        </Card>

        {/* 阅读笔记 */}
        {book.notes && <Card>
            <CardHeader>
              <h3 className="font-semibold">我的笔记</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{book.notes}</p>
            </CardContent>
          </Card>}

        {/* 阅读时间 */}
        {book.startDate && <Card>
            <CardHeader>
              <h3 className="font-semibold">阅读时间</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {book.startDate} {book.endDate ? `- ${book.endDate}` : '开始阅读'}
              </p>
            </CardContent>
          </Card>}

        {/* 操作按钮 */}
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('unread')} className={book.status === 'unread' ? 'bg-gray-100' : ''}>
              未读
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('reading')} className={book.status === 'reading' ? 'bg-blue-100' : ''}>
              在读
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('read')} className={book.status === 'read' ? 'bg-green-100' : ''}>
              已读
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="text-amber-600">
              <Edit3 className="w-4 h-4 mr-2" />
              编辑
            </Button>
            <Button variant="outline" className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              删除
            </Button>
          </div>
        </div>
      </div>
    </div>;
}