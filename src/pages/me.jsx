// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { User, Settings, Download, Upload, BookOpen, BarChart3, FileText } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, useToast } from '@/components/ui';

export default function Me(props) {
  const {
    $w
  } = props;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    booksRead: 0,
    booksReading: 0,
    booksUnread: 0
  });
  const {
    toast
  } = useToast();

  // 加载统计数据
  useEffect(() => {
    loadStats();
  }, []);
  const loadStats = async () => {
    try {
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
      const books = result.records || [];
      setStats({
        totalBooks: books.length,
        booksRead: books.filter(b => b.status === 'read').length,
        booksReading: books.filter(b => b.status === 'reading').length,
        booksUnread: books.filter(b => b.status === 'unread').length
      });
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  // 导出Excel功能
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
          getCount: true,
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      const books = result.records || [];
      if (books.length === 0) {
        toast({
          title: '提示',
          description: '书库中没有书籍可导出',
          variant: 'destructive'
        });
        return;
      }

      // 生成Excel格式的CSV内容
      const headers = ['书名', '作者', 'ISBN', '出版社', '出版日期', '页数', '价格', '阅读状态', '分类', '分组', '添加时间', '简介', '笔记'];
      const rows = books.map(book => [book.title || '', book.author || '', book.isbn || '', book.publisher || '', book.pubdate || '', book.pages || '', book.price || '', book.status === 'read' ? '已读' : book.status === 'reading' ? '在读' : '未读', book.category || '未分类', book.group || '未分组', book.createdAt ? new Date(book.createdAt).toLocaleDateString('zh-CN') : '', book.summary || '', book.notes || '']);
      const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

      // 创建并下载文件
      const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;'
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `我的书库_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: '导出成功',
        description: `已导出${books.length}本书籍信息`
      });
    } catch (error) {
      toast({
        title: '导出失败',
        description: error.message || '导出过程中发生错误',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 高级导出选项
  const handleAdvancedExport = async format => {
    try {
      setLoading(true);

      // 调用后端导出接口
      const result = await $w.cloud.callFunction({
        name: 'exportBooks',
        data: {
          format: format,
          userId: $w.auth.currentUser?.userId
        }
      });
      if (result.success && result.fileUrl) {
        // 下载文件
        const link = document.createElement('a');
        link.href = result.fileUrl;
        link.download = `书库导出_${new Date().toLocaleDateString('zh-CN')}.${format}`;
        link.click();
        toast({
          title: '导出成功',
          description: `已导出为${format.toUpperCase()}格式`
        });
      } else {
        throw new Error(result.error || '导出失败');
      }
    } catch (error) {
      // 回退到前端导出
      await handleExportExcel();
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-50">
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
                  <p className="text-2xl font-bold text-blue-600">{stats.totalBooks}</p>
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
                  <p className="text-2xl font-bold text-green-600">{stats.booksRead}</p>
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
                <span className="font-medium">{stats.booksReading}本</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">未读</span>
                <span className="font-medium">{stats.booksUnread}本</span>
              </div>
              {stats.totalBooks > 0 && <div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{
                  width: `${(stats.booksRead / stats.totalBooks * 100).toFixed(1)}%`
                }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    已读 {stats.booksRead}/{stats.totalBooks} ({(stats.booksRead / stats.totalBooks * 100).toFixed(1)}%)
                  </p>
                </div>}
            </div>
          </CardContent>
        </Card>

        {/* 数据管理 */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">数据管理</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => handleExportExcel()} disabled={loading} className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {loading ? '导出中...' : '导出书库到Excel'}
            </Button>
            
            <Button onClick={() => handleAdvancedExport('xlsx')} disabled={loading} className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              {loading ? '导出中...' : '导出为Excel文件'}
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
              版本 2.0.0 | 云开发小程序 | 支持Excel导出
            </p>
          </CardContent>
        </Card>
      </div>
    </div>;
}