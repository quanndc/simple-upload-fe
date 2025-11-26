"use client";

import { useCallback, useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import type { UploadProps } from "antd";
import type { RcFile } from "antd/es/upload";
import { PHOTOS_ENDPOINT } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export function usePhotoUpload() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const uploadSingleFile = useCallback(
    async (file: UploadFile) => {
      const currentFile = file.originFileObj as RcFile | undefined;
      if (!currentFile) {
        throw new Error("Không tìm thấy tệp nguồn");
      }

      const headers: HeadersInit = {};
      if (user) {
        const token = await user.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const formData = new FormData();
      formData.append("photo", currentFile);
      formData.append("description", description);
      const response = await fetch(PHOTOS_ENDPOINT, {
        method: "POST",
        body: formData,
        headers,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload thất bại");
      }
      return response.json().catch(() => ({}));
    },
    [description, user],
  );

  const uploadAll = useCallback(async () => {
    if (!fileList.length) {
      throw new Error("Vui lòng chọn ít nhất một ảnh");
    }
    setIsUploading(true);
    try {
      for (const file of fileList) {
        await uploadSingleFile(file);
      }
      setFileList([]);
    } finally {
      setIsUploading(false);
    }
  }, [fileList, uploadSingleFile]);

  const uploadProps: UploadProps = useMemo(
    () => ({
      name: "file",
      multiple: true,
      accept: "image/*",
      showUploadList: true,
      disabled: isUploading,
      fileList,
      beforeUpload: () => false,
      onChange: ({ fileList: newFileList }) => setFileList(newFileList),
      onRemove: (file) => {
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      },
    }),
    [fileList, isUploading],
  );

  return {
    fileList,
    description,
    setDescription,
    isUploading,
    uploadAll,
    uploadProps,
  };
}

