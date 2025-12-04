import { type ReactNode } from "react";

interface TitleProps {
  label: string;
  className?: string;
  icon?: ReactNode;
  subTitle?: string;
}

export const Title: React.FC<TitleProps> = ({
  label,
  className,
  icon,
  subTitle,
}) => {
  return (
    <div>
      <h2
        className={`flex items-center text-3xl font-bold text-gray-900 dark:text-white ${className}`}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </h2>
      {subTitle && <p className="text-muted-foreground mt-1">{subTitle}</p>}
    </div>
  );
};
