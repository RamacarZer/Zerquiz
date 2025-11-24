export default function QuestionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Soru Bankası</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Yeni Soru Ekle
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <input
              type="search"
              placeholder="Soru ara..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="p-6">
            <p className="text-gray-500">Sorular yüklenecek...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

