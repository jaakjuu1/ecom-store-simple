import { Nav, NavLink } from "@/components/Nav"

// bypassing any static generation or caching. 
// This is useful for pages that need to display real-time data or frequently changing content.
export const dynamic = "force-dynamic"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  )
}