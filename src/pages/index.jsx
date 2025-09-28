// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, BookOpen, Plus } from 'lucide-react';
// @ts-ignore;
import { Input, Button, useToast } from '@/components/ui';

import { BookCard } from '@/components/BookCard';
export default function Index(props) {
  const {
    $w
  } = props;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('全部');
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 小程序云数据库书籍数据
  const loadBooks = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true,
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      setBooks(result.records || []);
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
  useEffect(() => {
    loadBooks();
  }, []);
  const handleSearch = query => {
    setSearchQuery(query);
  };
  const handleAddBook = () => {
    $w.utils.navigateTo({
      pageId: 'scan'
    });
  };
  const handleBookPress = book => {
    $w.utils.navigateTo({
      pageId: 'book-detail',
      params: {
        bookId: book._id
      }
    });
  };
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === '全部' || book.category === selectedGroup;
    return matchesSearch && matchesGroup;
  });
  const groups = ['全部', '文学', '历史', '科幻', '教育', '其他'];
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input type="text" placeholder="搜索书名或作者..." value={searchQuery} onChange={e => handleSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full" />
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
            {filteredBooks.map(book => <BookCard key={book._id} book={book} onPress={handleBookPress} />)}
          </div> : <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无书籍</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleAddBook}>
              <Plus className="w-4 h-4 mr-2" />
              添加书籍
            </Button>
          </div>}
      </div>

      {/* 添加按钮 */}
      <div className="fixed bottom-20 right-4">
        <Button onClick={handleAddBook} className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>;
}