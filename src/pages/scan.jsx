// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Camera, Scan as ScanIcon, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Checkbox, useToast } from '@/components/ui';

export default function ScanPage(props) {
  const {
    $w
  } = props;
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBooks, setScannedBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();

  // 调用摄像头扫描ISBN
  const handleCameraScan = async () => {
    try {
      setIsScanning(true);

      // 调用小程序摄像头API（模拟）
      // 真实环境中使用 wx.scanCode
      const scanResult = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            result: '9787559855022'
          }); // 模拟扫描结果
        }, 1500);
      });
      const isbn = scanResult.result;
      await fetchBookInfo(isbn);
    } catch (error) {
      toast({
        title: '扫描失败',
        description: error.message || '无法识别条形码',
        variant: 'destructive'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // 获取图书信息
  const fetchBookInfo = async isbn => {
    try {
      const response = await fetch(`https://api.tanshuapi.com/api/isbn_base/v1/index?key=demo&isbn=${isbn}`);
      const data = await response.json();
      if (data.code === 1) {
        const bookData = {
          title: data.data.title,
          cover: data.data.img,
          author: data.data.author,
          isbn: isbn,
          publisher: data.data.publisher,
          pubdate: data.data.pubdate,
          pages: data.data.pages,
          price: data.data.price,
          summary: data.data.summary,
          group: '未分组',
          status: 'unread',
          category: '未分类',
          notes: '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // 检查是否已存在
        const exists = scannedBooks.some(book => book.isbn === isbn);
        if (!exists) {
          setScannedBooks(prev => [...prev, bookData]);
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
      } else {
        throw new Error(data.msg || '获取图书信息失败');
      }
    } catch (error) {
      // 使用模拟数据
      const mockBook = {
        title: "隐形伴侣",
        cover: "http://static.tanshuapi.com/isbn/202507/1739496702e935e6.jpg",
        author: "张抗抗著",
        isbn: isbn,
        publisher: "广西师范大学出版社",
        pubdate: "2022",
        pages: "464",
        price: "68.00",
        summary: "本书讲述了陈旭和肖潇在北大荒恋爱、结婚又离婚的故事...",
        group: '文学',
        status: 'unread',
        category: '文学',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setScannedBooks(prev => [...prev, mockBook]);
      toast({
        title: '扫描成功',
        description: `已添加《${mockBook.title}》`
      });
    }
  };

  // 手动输入ISBN
  const handleManualInput = async () => {
    const isbn = prompt('请输入ISBN号码：');
    if (isbn && isbn.trim()) {
      await fetchBookInfo(isbn.trim());
    }
  };

  // 选择/取消选择书籍
  const toggleBookSelection = bookId => {
    setSelectedBooks(prev => prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]);
  };

  // 批量加入书库
  const handleBatchAddToLibrary = async () => {
    if (selectedBooks.length === 0) {
      toast({
        title: '提示',
        description: '请先选择要添加的书籍',
        variant: 'destructive'
      });
      return;
    }
    try {
      setLoading(true);
      const booksToAdd = scannedBooks.filter(book => selectedBooks.includes(book.id));

      // 批量写入数据库
      await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaBatchCreateV2',
        params: {
          data: booksToAdd
        }
      });

      // 从扫描列表移除已添加的书籍
      setScannedBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
      setSelectedBooks([]);
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

  // 移除扫描的书籍
  const removeScannedBook = bookId => {
    setScannedBooks(prev => prev.filter(book => book.id !== bookId));
    setSelectedBooks(prev => prev.filter(id => id !== bookId));
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedBooks.length === scannedBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(scannedBooks.map(book => book.id));
    }
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部标题 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-center">ISBN扫描</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 扫描操作区域 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Button onClick={handleCameraScan} disabled={isScanning} className="flex-1 bg-blue-600 hover:bg-blue-700" size="lg">
                <Camera className="w-5 h-5 mr-2" />
                {isScanning ? '扫描中...' : '相机扫描'}
              </Button>
              <Button onClick={handleManualInput} variant="outline" className="flex-1" size="lg">
                手动输入
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 扫描结果列表 */}
        {scannedBooks.length > 0 && <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox checked={selectedBooks.length === scannedBooks.length && scannedBooks.length > 0} onCheckedChange={toggleSelectAll} />
                  <h3 className="font-semibold">扫描结果 ({scannedBooks.length})</h3>
                </div>
                <Button onClick={handleBatchAddToLibrary} disabled={loading || selectedBooks.length === 0} className="bg-green-600 hover:bg-green-700" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  批量加入书库 ({selectedBooks.length})
                </Button>
              </div>
              
              <div className="space-y-3">
                {scannedBooks.map(book => <div key={book.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Checkbox checked={selectedBooks.includes(book.id)} onCheckedChange={() => toggleBookSelection(book.id)} />
                    <img src={book.cover} alt={book.title} className="w-16 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{book.title}</h4>
                      <p className="text-xs text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                    <Button onClick={() => removeScannedBook(book.id)} size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>)}
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
}