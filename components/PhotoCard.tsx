"use client";

import { useState } from "react";
import Image from "next/image";
import type { Photo } from "../models/photo.model";
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tag,
  Typography,
} from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { Comment } from "../models/comment.model";

const { Title, Paragraph, Text } = Typography;

const resolveCommentAuthor = (comment?: Comment) => {
  if (!comment) {
    return "Ẩn danh";
  }
  return (comment as { author?: string | null }).author ?? "Ẩn danh";
};

type PhotoCardProps = {
  photo: Photo;
  imageUrl: string;
  commentValue: string;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export function PhotoCard({
  photo,
  imageUrl,
  commentValue,
  onCommentChange,
  onSubmit,
  submitting = false,
}: PhotoCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);
  const comments = photo.comments ?? [];
  const commentCount = comments.length;
  const hasComments = commentCount > 0;

  const displayedComments = comments.slice(0, visibleComments);
  const remainingComments = Math.max(comments.length - visibleComments, 0);
  const toggleLabel = showComments
    ? "Ẩn bình luận"
    : hasComments
      ? "Xem bình luận"
      : "Viết bình luận";

  const handleToggleComments = () => {
    setShowComments((prev) => {
      const next = !prev;
      if (next) {
        setVisibleComments(5);
      }
      return next;
    });
  };

  return (
    <Card
      styles={{
        body: { display: "flex", flexDirection: "column", gap: 16 },
      }}
    >
      <div
        className="relative h-72 w-full cursor-zoom-in overflow-hidden rounded-xl"
        role="button"
        tabIndex={0}
        onClick={() => setPreviewOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setPreviewOpen(true);
          }
        }}
      >
        <Image
          src={imageUrl}
          alt={photo.title ?? `Photo ${photo.id}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
      </div>
      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
        width="70vw"
        styles={{ body: { padding: 24 } }}
      >
        <div className="relative h-[80vh] w-full bg-black">
          <Image
            src={imageUrl}
            alt={photo.title ?? `Photo ${photo.id}`}
            fill
            className="object-contain"
            sizes="100vw"
            unoptimized
          />
        </div>
      </Modal>
      <div>
        <Space orientation="vertical" size={4} className="w-full">
          <Title level={4} className="mb-0!">
            {photo.description ?? "Ảnh không tiêu đề"}
          </Title>
          {photo.createdAt && (
            <Text type="secondary" className="text-xs">
              Tạo lúc {new Date(photo.createdAt).toLocaleString()}
            </Text>
          )}
        </Space>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Text type="secondary" className="text-sm">
            {hasComments
              ? `${commentCount} bình luận`
              : "Chưa có bình luận nào"}
          </Text>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <Title level={5} className="mb-0!">
          Bình luận
        </Title>
        <Button type="link" className="px-0" onClick={handleToggleComments}>
          {toggleLabel}
        </Button>
      </div>

      {showComments && (
        <>
          {!hasComments ? (
            <Paragraph type="secondary" className="text-sm">
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </Paragraph>
          ) : (
            <>
              <div className="max-h-64 w-full overflow-y-auto pr-1">
                <Space orientation="vertical" size="small" className="w-full">
                  {displayedComments.map((comment, index) => (
                    <Card
                      key={comment.id ?? `comment-${photo.id}-${index}`}
                      size="small"
                    >
                      <Space orientation="vertical" size={2} className="w-full">
                        <Text strong>{resolveCommentAuthor(comment)}</Text>
                        <Text>{comment.body}</Text>
                        {comment.createdAt && (
                          <Text type="secondary" className="text-xs">
                            {new Date(comment.createdAt).toLocaleString()}
                          </Text>
                        )}
                      </Space>
                    </Card>
                  ))}
                </Space>
              </div>
              {remainingComments > 0 && (
                <Button
                  type="link"
                  className="self-start px-0"
                  onClick={() =>
                    setVisibleComments((prev) =>
                      Math.min(prev + 5, comments.length),
                    )
                  }
                >
                  Xem thêm {Math.min(5, remainingComments)} bình luận
                </Button>
              )}
            </>
          )}

          <Space orientation="vertical" size="small" className="w-full">
            <Input.TextArea
              rows={3}
              placeholder="Nhập bình luận của bạn..."
              value={commentValue}
              onChange={(event) => onCommentChange(event.target.value)}
            />
            <Button
              disabled={!commentValue?.trim()}
              type="primary"
              icon={<CommentOutlined />}
              loading={submitting}
              onClick={onSubmit}
            >
              Gửi bình luận
            </Button>
          </Space>
        </>
      )}
    </Card>
  );
}

