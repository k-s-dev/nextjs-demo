import "./layout.scss";
import AdminSidebarWrapper from "@/lib/features/admin/AdminSidebarContainer";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="admin-layout">
        <aside className="admin-sidebar-left">
          <AdminSidebarWrapper />
        </aside>
        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
