// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, Grid3X3, List } from 'lucide-react';
// @ts-ignore;
import { Input, Button, useToast } from '@/components/ui';

import { Book3DCard } from '@/components/Book3DCard';
import { BottomNav } from '@/components/BottomNav';
export default function Library(props) {
  const {
    $w
  } = props;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('library');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 模拟书籍数据
  const mockBooks = [{
    id: '1',
    title: '隐形伴侣',
    author: '张抗抗著',
    img: 'http://static.tanshuapi.com/isbn/202507/1739496702e935e6.jpg',
    status: 'read',
    publisher: '广西师范大学出版社',
    category: '文学',
    group: '文学'
  }, {
    id: '2',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    status: 'reading',
    publisher: '中信出版社',
    category: '历史',
    group: '历史'
  }, {
    id: '3',
    title: '三体',
    author: '刘慈欣',
    img: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=300&h=400&fit=crop',
    status: 'unread',
    publisher: '重庆出版社',
    category: '科幻',
    group: '科幻'
  }];
  const groups = ['全部', '文学', '历史', '科幻', '教育', '其他'];
  useEffect(() => {
    loadBooks();
  }, []);
  const loadBooks = async () => {
    try {
      setLoading(true);
      // 这里可以调用云函数获取真实数据
      // const result = await $w.cloud.callFunction({
      //   name: 'getBooks',
      //   data: { search: searchQuery, group: selectedGroup }
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
  const handleTabChange = tab => {
    setActiveTab(tab);
    if (tab === 'scan') {
      $w.utils.navigateTo({
        pageId: 'scan'
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
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === '全部' || book.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索书名或作者..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0" />
          </div>
        </div>
        
        {/* 分组标签 */}
        <div className="px-4 pb-2">
          <div className="flex space-x-2 overflow-x-auto">
            {groups.map(group => <Button key={group} variant={selectedGroup === group ? 'default' : 'ghost'} size="sm" onClick={() => setSelectedGroup(group)} className="whitespace-nowrap">
                {group}
              </Button>)}
          </div>
        </div>
      </div>

      {/* 书籍列表 */}
      <div className="p-4">
        {loading ? <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div> : filteredBooks.length > 0 ? <div className="grid grid-cols-2 gap-4">
            {filteredBooks.map(book => <Book3DCard key={book.id} book={book} onPress={handleBookPress} />)}
          </div> : <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无书籍</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => $w.utils.navigateTo({
          pageId: 'scan'
        })}>
              去扫描添加
            </Button>
          </div>}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}