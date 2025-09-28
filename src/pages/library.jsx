// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, Grid3X3, BookOpen } from 'lucide-react';
// @ts-ignore;
import { Input, Button, useToast } from '@/components/ui';

import { Book3DCard } from '@/components/Book3DCard';
export default function Library(props) {
  const {
    $w
  } = props;
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('全部');
  const [groups, setGroups] = useState(['全部', '已读', '在读', '未读', '文学', '历史', '科幻', '教育', '其他']);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 加载书籍和分组
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

      // 动态生成分组
      const uniqueGroups = [...new Set(result.records?.map(book => book.group).filter(Boolean) || [])];
      setGroups(['全部', '已读', '在读', '未读', ...uniqueGroups]);
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
  const handleBookPress = book => {
    $w.utils.navigateTo({
      pageId: 'book-detail-edit',
      params: {
        bookId: book._id
      }
    });
  };
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedGroup === '全部') return matchesSearch;
    if (['已读', '在读', '未读'].includes(selectedGroup)) {
      return matchesSearch && book.status === selectedGroup.toLowerCase();
    }
    return matchesSearch && book.group === selectedGroup;
  });
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
            {filteredBooks.map(book => <Book3DCard key={book._id} book={book} onPress={handleBookPress} />)}
          </div> : <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无书籍</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => $w.utils.navigateTo({
          pageId: 'scan'
        })}>
              去扫描添加
            </Button>
          </div>}
      </div>
    </div>;
}