// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { User, Settings, Download, Upload, BookOpen, BarChart3 } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, useToast } from '@/components/ui';

import { BottomNav } from '@/components/BottomNav';
export default function Profile(props) {
  const {
    $w
  } = props;
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();

  // 模拟用户数据
  const userStats = {
    totalBooks: 128,
    booksRead: 45,
    booksReading: 12,
    booksUnread: 71
  };
  const handleExportExcel = async () => {
    try {
      setLoading(true);

      // 获取所有书籍数据
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          getCount: true
        }
      });

      // 转换为Excel格式
      const books = result.records || [];
      const csvContent = [['书名', '作者', 'ISBN', '出版社', '状态', '分类', '添加时间'], ...books.map(book => [book.title, book.author, book.isbn, book.publisher, book.status, book.category, book.createdAt])].map(row => row.join(',')).join('\n');

      // 创建下载链接
      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `我的书库_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      toast({
        title: '导出成功',
        description: '书库数据已导出为Excel文件'
      });
    } catch (error) {
      toast({
        title: '导出失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = tab => {
    setActiveTab(tab);
    if (tab === 'library') {
      $w.utils.navigateTo({
        pageId: 'library'
      });
    } else if (tab === 'scan') {
      $w.utils.navigateTo({
        pageId: 'scan'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* 顶部用户信息 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">我的书库</h2>
              <p className="text-blue-100">管理您的阅读生活</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总藏书</p>
                  <p className="text-2xl font-bold text-blue-600">{userStats.totalBooks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已读</p>
                  <p className="text-2xl font-bold text-green-600">{userStats.booksRead}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 阅读统计 */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">阅读统计</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">在读</span>
                <span className="font-medium">{userStats.booksReading}本</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">未读</span>
                <span className="font-medium">{userStats.booksUnread}本</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{
                width: `${userStats.booksRead / userStats.totalBooks * 100}%`
              }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 功能设置 */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">数据管理</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleExportExcel} disabled={loading} className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出书库到Excel
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              从Excel导入
            </Button>
            
            <Button className="w-full justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </CardContent>
        </Card>

        {/* 关于 */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">
              版本 1.0.0 | 由云开发提供支持
            </p>
          </CardContent>
        </Card>
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}