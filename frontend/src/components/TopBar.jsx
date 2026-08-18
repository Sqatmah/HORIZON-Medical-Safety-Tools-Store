export default function TopBar() {
  return (
    <div className="bg-[#0B253D] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <button className="flex items-center gap-1 text-gray-200 hover:text-white">
          <span>English</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
          </svg>
        </button>
        <p className="text-gray-200">شركة هورايزون للحلول التقنية والأمنية</p>
      </div>
    </div>
  );
}