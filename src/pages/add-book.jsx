// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Camera, Search, Type, BookOpen } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, useToast } from '@/components/ui';

export default function AddBook(props) {
  const {
    $w
  } = props;
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    status: 'unread',
    description: '',
    cover: ''
  });
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      toast({
        title: '请填写完整信息',
        description: '书名和作者为必填项',
        variant: 'destructive'
      });
      return;
    }
    try {
      setLoading(true);

      // 这里可以调用云函数添加书籍
      // await $w.cloud.callFunction({
      //   name: 'addBook',
      //   data: formData
      // });

      toast({
        title: '添加成功',
        description: '书籍已添加到您的书架'
      });
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1500);
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
  const handleScanISBN = () => {
    // 模拟扫码功能
    toast({
      title: '扫码功能',
      description: '正在开发中，敬请期待'
    });
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="text-gray-600">
            返回
          </button>
          <h1 className="ml-4 text-lg font-semibold">添加新书</h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>书籍信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>封面</Label>
                <div className="mt-2">
                  <div className="w-32 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  </div>
                  <Button type="button" variant="outline" className="mt-2" size="sm">
                    上传封面
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="title">书名 *</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({
                ...formData,
                title: e.target.value
              })} placeholder="请输入书名" />
              </div>

              <div>
                <Label htmlFor="author">作者 *</Label>
                <Input id="author" value={formData.author} onChange={e => setFormData({
                ...formData,
                author: e.target.value
              })} placeholder="请输入作者" />
              </div>

              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <div className="flex space-x-2">
                  <Input id="isbn" value={formData.isbn} onChange={e => setFormData({
                  ...formData,
                  isbn: e.target.value
                })} placeholder="请输入ISBN" />
                  <Button type="button" variant="outline" onClick={handleScanISBN}>
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="category">分类</Label>
                <Select value={formData.category} onValueChange={value => setFormData({
                ...formData,
                category: value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
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
                <Label htmlFor="status">阅读状态</Label>
                <Select value={formData.status} onValueChange={value => setFormData({
                ...formData,
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
                <Label htmlFor="description">简介</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({
                ...formData,
                description: e.target.value
              })} placeholder="请输入书籍简介" rows={3} />
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading ? '添加中...' : '添加书籍'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>;
}