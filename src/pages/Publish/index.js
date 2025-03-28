import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import {
  createArticleAPI,
  getArticleById,
  updateArticleAPI,
} from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
  // 获取频道列表
  const { channelList } = useChannel()
  const navigate = useNavigate()
  // 提交表单
  const onFinish = (formValue) => {
    // console.log(formValue)
    // 校验封面类型 imageType 是否和实际的图片列表 imageList 数量相等
    if (imageList.length !== imageType)
      return message.warning('封面类型和图片数量不匹配')
    const { title, content, channel_id } = formValue
    // 1. 按照接口文档的格式处理收集到的表单数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType, // 封面模式
        // 新增和编辑回填的数据结构不一致，需要兼容两种数据
        images: imageList.map((item) => {
          if (item.response) {
            return item.response.data.url
          } else {
            return item.url
          }
        }), // 图片列表
      },
      channel_id,
    }
    // 2. 调用接口提交
    // 处理调用不同的结构 新增 - 新增接口  编辑状态 - 更新接口  id
    articleId
      ? updateArticleAPI({ ...reqData, id: articleId })
      : createArticleAPI(reqData)

    // 跳转首页
    navigate('/article')
  }

  // 上传回调
  const [imageList, setImageList] = useState([])

  const onChange = (value) => {
    console.log('正在上传中', value)
    setImageList(value.fileList)
  }

  // 切换图片封面类型
  const [imageType, setImageType] = useState(0)
  const onTypeChange = (e) => {
    console.log('切换封面了', e.target.value)
    setImageType(e.target.value)
  }

  // 回填数据  页面一打开就可以调用
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  console.log(articleId)
  // 获取实例
  const [form] = Form.useForm()

  useEffect(() => {
    // 1. 通过id 获取数据
    async function getArticleDetail() {
      const res = await getArticleById(articleId)
      const data = res.data
      const { cover } = data
      form.setFieldsValue({
        ...data,
        type: cover.type,
      })
      // 无法回填封面原因： 数据结构问题 set方法 -> { type: 3}, 返回数据 { cover : {type : 3}}
      // 回填图片列表
      setImageType(cover.type)
      // 显示图片
      setImageList(
        // 格式与上传时一致
        cover.images.map((url) => {
          return { url }
        })
      )
    }
    // 只在有id 的时候才能调用此函数
    if (articleId) getArticleDetail()
    // articleId && getArticleDetail()
    // 2. 调用实例方法 完成回填
  }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: `${articleId ? '编辑' : '发布'}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 
              listType：决定选择文件框的外观样式
              showUploadList: 控制显示上传列表
            */}
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* 富文本编辑器 */}
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish
