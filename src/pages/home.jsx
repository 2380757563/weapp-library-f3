// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, BookOpen } from 'lucide-react';
// @ts-ignore;
import { Input, Button, useToast } from '@/components/ui';

import { BookCard } from '@/components/BookCard';
import { TabBar } from '@/components/TabBar';
export default function Home(props) {
  const {
    $w
  } = props;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 模拟书籍数据
  const mockBooks = [{
    id: '1',
    title: '活着',
    author: '余华',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    status: 'read',
    category: '文学',
    rating: 4.8
  }, {
    id: '2',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    status: 'reading',
    category: '历史',
    rating: 4.6
  }, {
    id: '3',
    title: '三体',
    author: '刘慈欣',
    cover: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=300&h=400&fit=crop',
    status: 'unread',
    category: '科幻',
    rating: 4.9
  }, {
    id: '4',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop',
    status: 'read',
    category: '文学',
    rating: 4.7
  }];
  useEffect(() => {
    loadBooks();
  }, []);
  const loadBooks = async () => {
    try {
      setLoading(true);
      // 这里可以调用云函数获取真实数据
      // const result = await $w.cloud.callFunction({
      //   name: 'getBooks',
      //   data: { search: searchQuery }
      // });
      setBooks(mockBooks);
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
  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockBooks.filter(book => book.title.toLowerCase().includes(query.toLowerCase()) || book.author.toLowerCase().includes(query.toLowerCase()));
      setBooks(filtered);
    } else {
      setBooks(mockBooks);
    }
  };
  const handleTabChange = tab => {
    setActiveTab(tab);
    if (tab === 'add') {
      $w.utils.navigateTo({
        pageId: 'add-book'
      });
    } else if (tab === 'search') {
      $w.utils.navigateTo({
        pageId: 'search'
      });
    } else if (tab === 'profile') {
      $w.utils.navigateTo({
        pageId: 'profile'
      });
    }
  };
  const handleBookPress = book => {
    $w.utils.navigateTo({
      pageId: 'book-detail',
      params: {
        bookId: book.id
      }
    });
  };
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索书名或作者..." value={searchQuery} onChange={e => handleSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full" />
          </div>
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="px-4 py-2 bg-white border-b">
        <div className="flex space-x-2 overflow-x-auto">
          <Button variant="ghost" size="sm" className="text-amber-600">
            全部
          </Button>
          <Button variant="ghost" size="sm">
            在读
          </Button>
          <Button variant="ghost" size="sm">
            已读
          </Button>
          <Button variant="ghost" size="sm">
            未读
          </Button>
        </div>
      </div>

      {/* 书籍列表 */}
      <div className="p-4">
        {loading ? <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div> : books.length > 0 ? <div className="grid gap-4">
            {books.map(book => <BookCard key={book.id} book={book} onPress={handleBookPress} />)}
          </div> : <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无书籍</p>
            <Button className="mt-4 bg-amber-600 hover:bg-amber-700" onClick={() => handleTabChange('add')}>
              添加第一本
            </Button>
          </div>}
      </div>

      {/* 底部导航 */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}