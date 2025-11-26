"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Photo as ApiPhoto } from "@/models/photo.model";
import {
  Button,
  Card,
  Empty,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import { PhotoCard } from "@/components/PhotoCard";
import { usePhotos } from "@/hooks/usePhotos";
import { PHOTOS_ENDPOINT } from "@/lib/api";

const { Title, Paragraph } = Typography;

export default function GalleryPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { photos, loading, fetchPhotos } = usePhotos();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );
  const [commentLoading, setCommentLoading] = useState<Record<string, boolean>>(
    {},
  );

  const resolvePhotoUrl = (photo: ApiPhoto) =>
    photo.url ?? photo.publicUrl ?? photo.storagePath ?? "";

  useEffect(() => {
    fetchPhotos().catch((error) => {
      const err = error as Error;
      messageApi.error(err.message || "Có lỗi xảy ra");
    });
  }, [fetchPhotos, messageApi]);

  const handleCommentSubmit = async (photoId: number) => {
    const key = photoId.toString();
    const content = commentInputs[key]?.trim();
    setCommentLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const response = await fetch(`${PHOTOS_ENDPOINT}/${photoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: content, text: content }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Không thể gửi bình luận");
      }

      setCommentInputs((prev) => ({ ...prev, [key]: "" }));

      // refresh quietly to show latest comments
      await fetchPhotos({ silent: true });
      messageApi.success("Đã thêm bình luận");
    } catch (error) {
      const err = error as Error;
      messageApi.error(err.message || "Có lỗi xảy ra");
    } finally {
      setCommentLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-[#f5f6fa] px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <Card>
            <Space
              orientation="vertical"
              size="middle"
              className="w-full text-center"
            >
              <Title level={3}>Thư viện ảnh</Title>
              <Paragraph type="secondary">
                Duyệt tất cả ảnh đã upload và để lại bình luận cho từng ảnh.
              </Paragraph>
              <Space wrap align="center" className="justify-center">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() =>
                    fetchPhotos()
                      .then(() => messageApi.success("Đã làm mới danh sách"))
                      .catch((error) => {
                        const err = error as Error;
                        messageApi.error(err.message || "Có lỗi xảy ra");
                      })
                  }
                  disabled={loading}
                >
                  Làm mới danh sách
                </Button>
                <Link href="/upload">
                  <Button type="primary" icon={<UploadOutlined />}>
                    Upload ảnh mới
                  </Button>
                </Link>
              </Space>
            </Space>
          </Card>

          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spin size="large" />
            </div>
          ) : photos.length === 0 ? (
            <Card>
              <Empty description="Chưa có ảnh nào. Hãy upload ảnh mới!" />
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {photos.map((photo) => {
                const key = photo.id.toString();
                const photoUrl = resolvePhotoUrl(photo);
                if (!photoUrl) {
                  return null;
                }
                return (
                  <PhotoCard
                    key={key}
                    photo={photo}
                    imageUrl={photoUrl}
                    commentValue={commentInputs[key] ?? ""}
                    submitting={Boolean(commentLoading[key])}
                    onCommentChange={(value) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [key]: value,
                      }))
                    }
                    onSubmit={() => handleCommentSubmit(Number(photo.id))}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

