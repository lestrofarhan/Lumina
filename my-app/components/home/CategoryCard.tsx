interface CategoryProps {
  name: string;
  icon: string;
  colorClass: string;
  iconClass: string;
}

export default function CategoryCard({
  name,
  icon,
  colorClass,
  iconClass,
}: CategoryProps) {
  return (
    <a
     
      className="flex flex-col items-center p-6 rounded-xl bg-slate-50 hover:bg-white hover:shadow-lg border cursor-pointer border-slate-100 hover:border-primary-100 transition-all group"
    >
      <div
        className={`w-12 h-12 rounded-full ${colorClass} ${iconClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
      >
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      <span className="font-medium text-slate-700 group-hover:text-primary-600">
        {name}
      </span>
    </a>
  );
}
