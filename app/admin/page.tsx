import AdminPageClient from "@/components/admin-page-client"

export const dynamic = "force-dynamic"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminPageClient />
    </div>
  )
}
