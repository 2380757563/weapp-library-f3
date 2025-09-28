// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Save, ArrowLeft, Image, Trash2 } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, useToast } from '@/components/ui';

export default function BookDetailEdit(props) {
  const {
    $w
  } = props;
  const bookId = props.$w.page.dataset.params?.bookId;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadBook();
  }, [bookId]);
  const loadBook = async () => {
    try {
      setLoading(true);
      // 模拟获取书籍详情
      const mockBook = {
        id: bookId,
        title: '隐形伴侣',
        author: '张抗抗著',
        img: 'http://static.tanshuapi.com/isbn/202507/1739496702e935e6.jpg',
        isbn: '9787559855022',
        publisher: '广西师范大学出版社',
        pubdate: '2022',
        pages: '464',
        price: '68.00',
        status: 'unread',
        category: '文学',
        summary: '本书讲述了陈旭和肖潇在北大荒恋爱、结婚又离婚的故事...',
        notes: ''
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
  const handleSave = async () => {
    try {
      setSaving(true);

      // 更新数据库
      await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaUpdateV2',
        params: {
          data: book,
          filter: {
            where: {
              _id: {
                $eq: bookId
              }
            }
          }
        }
      });
      toast({
        title: '保存成功',
        description: '书籍信息已更新'
      });
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1500);
    } catch (error) {
      toast({
        title: '保存失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm('确定要删除这本书吗？')) return;
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: bookId
              }
            }
          }
        }
      });
      toast({
        title: '删除成功',
        description: '书籍已从书库中删除'
      });
      $w.utils.navigateTo({
        pageId: 'library'
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <h1 className="ml-4 text-lg font-semibold">编辑书籍</h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardContent className="space-y-4">
            {/* 封面 */}
            <div>
              <Label>封面</Label>
              <div className="mt-2">
                <img src={book.img} alt={book.title} className="w-32 h-48 object-cover rounded-lg" />
                <Button type="button" variant="outline" className="mt-2" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  更换封面
                </Button>
              </div>
            </div>

            {/* 基本信息 */}
            <div>
              <Label htmlFor="title">书名</Label>
              <Input id="title" value={book.title} onChange={e => setBook({
              ...book,
              title: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="author">作者</Label>
              <Input id="author" value={book.author} onChange={e => setBook({
              ...book,
              author: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" value={book.isbn} onChange={e => setBook({
              ...book,
              isbn: e.target.value
            })} readOnly />
            </div>

            <div>
              <Label htmlFor="publisher">出版社</Label>
              <Input id="publisher" value={book.publisher} onChange={e => setBook({
              ...book,
              publisher: e.target.value
            })} />
            </div>

            <div>
              <Label htmlFor="category">分类</Label>
              <Select value={book.category} onValueChange={value => setBook({
              ...book,
              category: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="文学">文学</SelectItem>
                  <SelectItem value="历史">历史</SelectItem>
                  <SelectItem value="科技">科技</SelectItem>
                  <SelectItem value="艺术">艺术</SelectItem>
                  <SelectItem value="教育">教育</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">状态</Label>
              <Select value={book.status} onValueChange={value => setBook({
              ...book,
              status: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">未读</SelectItem>
                  <SelectItem value="reading">在读</SelectItem>
                  <SelectItem value="read">已读</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="summary">简介</Label>
              <Textarea id="summary" value={book.summary} onChange={e => setBook({
              ...book,
              summary: e.target.value
            })} rows={4} />
            </div>

            <div>
              <Label htmlFor="notes">我的笔记</Label>
              <Textarea id="notes" value={book.notes || ''} onChange={e => setBook({
              ...book,
              notes: e.target.value
            })} rows={3} placeholder="添加您的阅读笔记..." />
            </div>

            {/* 操作按钮 */}
            <div className="space-y-2 pt-4">
              <Button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                {saving ? '保存中...' : '保存修改'}
              </Button>
              
              <Button onClick={handleDelete} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                删除书籍
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}