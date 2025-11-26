"use client";

import { useCallback, useState } from "react";
import type { Photo } from "@/models/photo.model";
import { PHOTOS_ENDPOINT } from "@/lib/api";

type FetchOptions = {
  silent?: boolean;
};

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(
    async ({ silent = false }: FetchOptions = {}) => {
      if (!silent) {
        setLoading(true);
      }
      try {
        const response = await fetch(PHOTOS_ENDPOINT, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách ảnh");
        }
        const data = (await response.json()) as { photos?: Photo[] } | Photo[];
        const list = Array.isArray(data) ? data : data?.photos ?? [];
        setPhotos(list);
        return list;
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  return {
    photos,
    loading,
    fetchPhotos,
  };
}

