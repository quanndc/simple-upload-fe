"use client";

import { Button, Space, Typography, Avatar, Dropdown, MenuProps } from "antd";
import { useAuth } from "@/components/AuthProvider";

const { Text } = Typography;

export function AuthBar() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-end gap-3">
        <Text type="secondary" className="text-sm">
          Đang kiểm tra phiên đăng nhập...
        </Text>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-end gap-3">
        <Button type="primary" onClick={loginWithGoogle}>
          Đăng nhập với Google
        </Button>
      </div>
    );
  }

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: () => logout(),
    },
  ];

  return (
    <div className="flex items-center justify-end gap-3">
      <Dropdown menu={{ items }}>
        <Space className="cursor-pointer">
          <Avatar src={user.photoURL ?? undefined}>
            {user.displayName?.[0] ?? "U"}
          </Avatar>
          <Text className="max-w-[160px] truncate text-sm">
            {user.displayName ?? user.email}
          </Text>
        </Space>
      </Dropdown>
    </div>
  );
}


