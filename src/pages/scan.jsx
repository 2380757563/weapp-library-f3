// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Camera, Scan as ScanIcon, CheckCircle, XCircle, Download } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, useToast } from '@/components/ui';

import { BottomNav } from '@/components/BottomNav';
export default function ScanPage(props) {
  const {
    $w
  } = props;
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBooks, setScannedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('scan');
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();

  // 模拟ISBN扫描结果
  const mockScanResult = {
    code: 1,
    msg: "操作成功",
    data: {
      title: "隐形伴侣",
      img: "http://static.tanshuapi.com/isbn/202507/1739496702e935e6.jpg",
      author: "张抗抗著",
      isbn: "9787559855022",
      publisher: "广西师范大学出版社",
      pubdate: "2022",
      pubplace: "桂林",
      pages: "464",
      price: "68.00",
      binding: "一般轻型纸",
      edition: "",
      format: "32开",
      summary: "本书讲述了陈旭和肖潇在北大荒恋爱、结婚又离婚的故事..."
    }
  };
  const handleScan = async () => {
    try {
      setIsScanning(true);

      // 模拟扫描延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 这里可以调用真实的摄像头API
      // 模拟API调用
      const response = await fetch(`https://api.tanshuapi.com/api/isbn_base/v1/index?key=demo&isbn=9787559855022`);

      // 使用模拟数据
      const bookData = mockScanResult.data;

      // 检查是否已存在
      const exists = scannedBooks.some(book => book.isbn === bookData.isbn);
      if (!exists) {
        setScannedBooks(prev => [...prev, {
          ...bookData,
          id: Date.now()
        }]);
        toast({
          title: '扫描成功',
          description: `已添加《${bookData.title}》`
        });
      } else {
        toast({
          title: '已存在',
          description: '这本书已经在扫描列表中',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '扫描失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsScanning(false);
    }
  };
  const handleAddToLibrary = async book => {
    try {
      setLoading(true);

      // 存储到数据库
      await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publisher: book.publisher,
            cover: book.img,
            status: 'unread',
            category: '未分类',
            createdAt: new Date()
          }
        }
      });

      // 从扫描列表移除
      setScannedBooks(prev => prev.filter(b => b.id !== book.id));
      toast({
        title: '添加成功',
        description: `《${book.title}》已添加到书库`
      });
    } catch (error) {
      toast({
        title: '添加失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBatchAdd = async () => {
    if (scannedBooks.length === 0) {
      toast({
        title: '提示',
        description: '请先扫描书籍',
        variant: 'destructive'
      });
      return;
    }
    try {
      setLoading(true);

      // 批量添加
      const booksToAdd = scannedBooks.map(book => ({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        cover: book.img,
        status: 'unread',
        category: '未分类',
        createdAt: new Date()
      }));
      await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaBatchCreateV2',
        params: {
          data: booksToAdd
        }
      });
      setScannedBooks([]);
      toast({
        title: '批量添加成功',
        description: `已添加${booksToAdd.length}本书到书库`
      });

      // 跳转到书库
      $w.utils.navigateTo({
        pageId: 'library'
      });
    } catch (error) {
      toast({
        title: '批量添加失败',
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
    } else if (tab === 'profile') {
      $w.utils.navigateTo({
        pageId: 'profile'
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* 顶部标题 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center">ISBN扫描</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 扫描区域 */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                {isScanning ? <div className="animate-pulse">
                    <ScanIcon className="w-16 h-16 text-blue-600" />
                    <p className="text-sm text-gray-600 mt-2">正在扫描...</p>
                  </div> : <Camera className="w-16 h-16 text-gray-400" />}
              </div>
              
              <Button onClick={handleScan} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700" size="lg">
                {isScanning ? '扫描中...' : '开始扫描'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 扫描结果列表 */}
        {scannedBooks.length > 0 && <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">扫描结果 ({scannedBooks.length})</h3>
                <Button onClick={handleBatchAdd} disabled={loading} className="bg-green-600 hover:bg-green-700" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  批量添加
                </Button>
              </div>
              
              <div className="space-y-3">
                {scannedBooks.map(book => <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img src={book.img} alt={book.title} className="w-16 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{book.title}</h4>
                      <p className="text-xs text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                    <Button onClick={() => handleAddToLibrary(book)} disabled={loading} size="sm" variant="ghost" className="text-blue-600">
                      添加
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>;
}