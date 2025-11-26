import Link from "next/link";

const actions = [
  {
    href: "/upload",
    title: "Upload ảnh",
    description: "Tải ảnh từ máy của bạn lên server chỉ với vài thao tác.",
    cta: "Đi tới Upload",
  },
  {
    href: "/gallery",
    title: "Xem & bình luận",
    description:
      "Duyệt toàn bộ ảnh đã có và để lại bình luận cho từng tấm hình.",
    cta: "Mở thư viện",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
        <section className="text-center">
          <p className="text-sm font-semibold uppercase text-blue-600">
            Photo Studio
          </p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Quản lý ảnh và thảo luận nhanh chóng
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Sử dụng Ant Design để tải ảnh lên, xem lại và trao đổi cùng đồng
            đội. Bắt đầu ngay với hai trang chính bên dưới.
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-2">
          {actions.map((action) => (
            <div
              key={action.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-slate-900">
                {action.title}
              </h2>
              <p className="mt-2 text-slate-600">{action.description}</p>
              <Link
                href={action.href}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-500"
              >
                {action.cta}
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
