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

const renderComments = (photo: Photo) => {
  if (!photo.comments?.length) {
    return (
      <Paragraph type="secondary" className="text-sm">
        Chưa có bình luận nào.
      </Paragraph>
    );
  }

  return (
    <Space orientation="vertical" size="small" className="w-full">
      {photo.comments.map((comment) => (
        <Card key={comment.id ?? Math.random()} size="small">
          <Space orientation="vertical" size={2} className="w-full">
            <Text strong>{resolveCommentAuthor(comment)}</Text>
            <Text>{comment.body}</Text>
            {(comment).createdAt && (
              <Text type="secondary" className="text-xs">
                {new Date(comment.createdAt).toLocaleString()}
              </Text>
            )}
          </Space>
        </Card>
      ))}
    </Space>
  );
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
        width="80vw"
        styles={{ body: { padding: 0 } }}
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
            {photo.title ?? "Ảnh không tiêu đề"}
          </Title>
          {photo.originalName && (
            <Text type="secondary">{photo.originalName}</Text>
          )}
          {photo.description && (
            <Paragraph className="mb-0!" type="secondary">
              {photo.description}
            </Paragraph>
          )}
          {photo.createdAt && (
            <Text type="secondary" className="text-xs">
              Tạo lúc {new Date(photo.createdAt).toLocaleString()}
            </Text>
          )}
        </Space>
        <Tag className="mt-3">ID: {photo.id}</Tag>
      </div>

      <div>
        <Space orientation="vertical" size="small" className="w-full">
          <Title level={5} className="mb-0!">
            Bình luận
          </Title>
          {renderComments(photo)}
        </Space>
      </div>

      <Space orientation="vertical" size="small" className="w-full">
        <Input.TextArea
          rows={3}
          placeholder="Nhập bình luận của bạn..."
          value={commentValue}
          onChange={(event) => onCommentChange(event.target.value)}
        />
        <Button
          type="primary"
          icon={<CommentOutlined />}
          loading={submitting}
          onClick={onSubmit}
        >
          Gửi bình luận
        </Button>
      </Space>
    </Card>
  );
}

