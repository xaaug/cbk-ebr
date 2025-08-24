interface CardButtonProps {
    label: string;
    icon: React.ElementType; 
    href: string;
  }
  
  export default function CardButton({ label, icon: Icon, href }: CardButtonProps) {
    return (
      <a
        href={href}
        className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md active:scale-95"
      >
        <Icon className="w-5 h-5 text-primary group-hover:text-primary/80 transition" />
        <span className="text-sm font-sans font-medium text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </a>
    );
  }
  