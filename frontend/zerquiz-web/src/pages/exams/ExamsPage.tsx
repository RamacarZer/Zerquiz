export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sınavlar</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Yeni Sınav Oluştur
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Sınavlar yüklenecek...</p>
        </div>
      </div>
    </div>
  )
}

