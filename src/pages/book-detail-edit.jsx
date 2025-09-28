// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Save, ArrowLeft, Image, Trash2, Plus } from 'lucide-react';
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
  const [customGroups, setCustomGroups] = useState(['文学', '历史', '科幻', '教育', '其他']);
  const {
    toast
  } = useToast();

  // 加载书籍详情
  const loadBook = async () => {
    try {
      setLoading(true);
      if (bookId) {
        // 编辑模式：从数据库加载
        const result = await $w.cloud.callDataSource({
          dataSourceName: 'books',
          methodName: 'wedaGetItemV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: bookId
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        setBook(result);
      } else {
        // 新建模式：创建空书籍对象
        setBook({
          title: '',
          author: '',
          isbn: '',
          publisher: '',
          pubdate: '',
          pages: '',
          price: '',
          cover: '',
          summary: '',
          status: 'unread',
          category: '文学',
          group: '未分组',
          notes: ''
        });
      }

      // 加载自定义分组
      const groupsResult = await $w.cloud.callDataSource({
        dataSourceName: 'books',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            group: true
          }
        }
      });
      const uniqueGroups = [...new Set(groupsResult.records?.map(b => b.group).filter(Boolean) || [])];
      setCustomGroups(['文学', '历史', '科幻', '教育', '其他', ...uniqueGroups]);
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
    loadBook();
  }, [bookId]);
  const handleSave = async () => {
    try {
      // 验证必填字段
      if (!book.title || !book.author) {
        toast({
          title: '请填写完整信息',
          description: '书名和作者为必填项',
          variant: 'destructive'
        });
        return;
      }
      setSaving(true);
      const bookData = {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publisher: book.publisher,
        pubdate: book.pubdate,
        pages: book.pages,
        price: book.price,
        cover: book.cover,
        summary: book.summary,
        status: book.status,
        category: book.category,
        group: book.group,
        notes: book.notes,
        updatedAt: new Date()
      };
      if (bookId) {
        // 更新现有书籍
        await $w.cloud.callDataSource({
          dataSourceName: 'books',
          methodName: 'wedaUpdateV2',
          params: {
            data: bookData,
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
      } else {
        // 创建新书籍
        await $w.cloud.callDataSource({
          dataSourceName: 'books',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              ...bookData,
              createdAt: new Date()
            }
          }
        });
        toast({
          title: '创建成功',
          description: '书籍已添加到书库'
        });
      }
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'library'
        });
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
    if (!bookId) return;
    if (!confirm('确定要删除这本书吗？此操作不可恢复。')) return;
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
  const handleAddCustomGroup = () => {
    const newGroup = prompt('请输入新分组名称：');
    if (newGroup && newGroup.trim() && !customGroups.includes(newGroup.trim())) {
      setCustomGroups(prev => [...prev, newGroup.trim()]);
      setBook(prev => ({
        ...prev,
        group: newGroup.trim()
      }));
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
          <h1 className="ml-4 text-lg font-semibold">
            {bookId ? '编辑书籍' : '添加书籍'}
          </h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardContent className="space-y-4">
            {/* 封面 */}
            <div>
              <Label>封面</Label>
              <div className="mt-2">
                {book.cover ? <img src={book.cover} alt={book.title} className="w-32 h-48 object-cover rounded-lg" /> : <div className="w-32 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>}
                <Button type="button" variant="outline" className="mt-2" size="sm">
                  <Image className="w-4 h-4 mr-2" />
                  上传封面
                </Button>
              </div>
            </div>

            {/* 基本信息 */}
            <div>
              <Label htmlFor="title">书名 *</Label>
              <Input id="title" value={book.title} onChange={e => setBook({
              ...book,
              title: e.target.value
            })} placeholder="请输入书名" />
            </div>

            <div>
              <Label htmlFor="author">作者 *</Label>
              <Input id="author" value={book.author} onChange={e => setBook({
              ...book,
              author: e.target.value
            })} placeholder="请输入作者" />
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" value={book.isbn} onChange={e => setBook({
              ...book,
              isbn: e.target.value
            })} placeholder="请输入ISBN" />
            </div>

            <div>
              <Label htmlFor="publisher">出版社</Label>
              <Input id="publisher" value={book.publisher} onChange={e => setBook({
              ...book,
              publisher: e.target.value
            })} placeholder="请输入出版社" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pubdate">出版日期</Label>
                <Input id="pubdate" value={book.pubdate} onChange={e => setBook({
                ...book,
                pubdate: e.target.value
              })} placeholder="如：2022" />
              </div>
              <div>
                <Label htmlFor="pages">页数</Label>
                <Input id="pages" value={book.pages} onChange={e => setBook({
                ...book,
                pages: e.target.value
              })} placeholder="请输入页数" />
              </div>
            </div>

            <div>
              <Label htmlFor="price">价格</Label>
              <Input id="price" value={book.price} onChange={e => setBook({
              ...book,
              price: e.target.value
            })} placeholder="请输入价格" />
            </div>

            <div>
              <Label htmlFor="status">阅读状态</Label>
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
                  <SelectItem value="科幻">科幻</SelectItem>
                  <SelectItem value="教育">教育</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="group">分组</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleAddCustomGroup} className="text-blue-600">
                  <Plus className="w-4 h-4 mr-1" />
                  添加分组
                </Button>
              </div>
              <Select value={book.group} onValueChange={value => setBook({
              ...book,
              group: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customGroups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="summary">简介</Label>
              <Textarea id="summary" value={book.summary} onChange={e => setBook({
              ...book,
              summary: e.target.value
            })} rows={4} placeholder="请输入书籍简介" />
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
                {saving ? '保存中...' : '保存'}
              </Button>
              
              {bookId && <Button onClick={handleDelete} variant="outline" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除书籍
                </Button>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}