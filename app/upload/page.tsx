"use client";

import Link from "next/link";
import { Button, Card, Input, Space, Typography, Upload, message } from "antd";
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  PictureOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function UploadPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    uploadProps,
    description,
    setDescription,
    isUploading,
    uploadAll,
    fileList,
  } = usePhotoUpload();

  const handleConfirmUpload = async () => {
    if (!fileList.length) {
      messageApi.warning("Vui lòng chọn ít nhất một ảnh");
      return;
    }
    try {
      await uploadAll();
      messageApi.success("Đã upload ảnh thành công");
      setDescription("");
    } catch (error) {
      const err = error as Error;
      messageApi.error(err.message || "Không thể upload ảnh");
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-[#f5f6fa] px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Card>
            <Space orientation="vertical" size="large" className="w-full">
              <div>
                <Title level={3}>Upload ảnh mới</Title>
                <Paragraph type="secondary">
                  Kéo thả hoặc chọn nhiều ảnh từ máy để tải lên server.
                </Paragraph>
              </div>
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon text-blue-600">
                  <CloudUploadOutlined />
                </p>
                <Title level={4}>Kéo thả ảnh vào khu vực này</Title>
                <Paragraph type="secondary">
                  Hoặc nhấn nút bên dưới để chọn ảnh từ máy tính.
                </Paragraph>
                <Button
                  icon={<UploadOutlined />}
                  type="primary"
                  loading={isUploading}
                >
                  Chọn ảnh từ máy
                </Button>
              </Dragger>

              <Space orientation="vertical" className="w-full">
                <Text strong>Mô tả ảnh</Text>
                <Input.TextArea
                  rows={3}
                  value={description}
                  placeholder="Nhập mô tả cho ảnh (tuỳ chọn, áp dụng cho tất cả ảnh trong lần upload này)"
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Space>

              <Space size="middle">
                <Link href="/gallery">
                  <Button icon={<PictureOutlined />}>Xem thư viện ảnh</Button>
                </Link>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={isUploading}
                  disabled={isUploading || fileList.length === 0 || description.trim().length === 0}
                  onClick={handleConfirmUpload}
                >
                  Xác nhận upload
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </div>
    </>
  );
}

