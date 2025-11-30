import { type ReactNode } from "react";

interface TitleProps {
  label: string;
  className?: string;
  icon?: ReactNode;
}

export const Title: React.FC<TitleProps> = ({ label, className, icon }) => {
  return (
    <h2
      className={`flex items-center text-3xl font-bold text-gray-900 dark:text-white sm:mb-4 mb-3 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </h2>
  );
};
