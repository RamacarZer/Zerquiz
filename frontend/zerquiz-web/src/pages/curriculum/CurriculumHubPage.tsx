import { Link } from "react-router-dom";

const CurriculumHubPage = () => {
  const sections = [
    {
      title: "Eğitim Modelleri",
      description:
        "MEB, Cambridge, IB gibi eğitim sistemlerini tanımlayın ve yönetin",
      icon: "🌍",
      color: "bg-blue-500",
      link: "/curriculum/education-models",
    },
    {
      title: "Branşlar",
      description: "Matematik, Fizik, Türkçe gibi ders branşlarını yönetin",
      icon: "📖",
      color: "bg-green-500",
      link: "/curriculum/subjects-manage",
    },
    {
      title: "Konular",
      description:
        "Müfredat konularını hiyerarşik olarak düzenleyin",
      icon: "📚",
      color: "bg-purple-500",
      link: "/curriculum/topics",
    },
    {
      title: "Kazanımlar",
      description: "Müfredat kazanımlarını tanımlayın ve yönetin",
      icon: "🎯",
      color: "bg-teal-500",
      link: "/curriculum/learning-outcomes",
    },
    {
      title: "Müfredatlar",
      description: "Yıllık müfredat planlarını oluşturun ve yönetin",
      icon: "📋",
      color: "bg-orange-500",
      link: "/curriculum/curricula",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Müfredat Yönetimi
        </h1>
        <p className="text-gray-600 mt-2">
          Eğitim programlarını, branşları, konuları ve kazanımları yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.link}
            to={section.link}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
          >
            <div className={`${section.color} h-2`}></div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{section.icon}</span>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h2>
              </div>
              <p className="text-gray-600">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">3</div>
          <div className="text-sm text-gray-600 mt-1">Eğitim Modeli</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-600 mt-1">Branş</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">48</div>
          <div className="text-sm text-gray-600 mt-1">Konu</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">256</div>
          <div className="text-sm text-gray-600 mt-1">Kazanım</div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumHubPage;

