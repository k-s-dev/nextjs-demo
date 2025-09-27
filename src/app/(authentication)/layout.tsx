import "./layout.scss"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <aside className="auth-sidebar-left"></aside>
      <main className="auth-main">{children}</main>
    </>
  );
}
