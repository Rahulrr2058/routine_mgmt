import { Button } from "@mantine/core";
type CommonButtonProps = {
  label?: string;
  onClick?: () => void;
  w?: string;
  className?: string;
  children?: React.ReactNode;
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  title?: string;
};
const CommonButton = ({ label, onClick, w, className, children ,radius}: CommonButtonProps) => {
  return (
    <Button
      className={`text-[0.65rem] sm:text-sm sm:py-1.5 px-2 sm:px-3  ${w ? `w-${w}` : ''} ${className || ''}`}
        radius={radius}
      color="#770000"
      onClick={onClick}
    >
      {children || label}
    </Button>
  );
};

export default CommonButton;
