// components/ui/GradientButton.jsx
import { Button } from 'antd';

export default function GradientButton({ children, ...props }) {
  return (
    <Button
      type="primary"
      {...props}
      className={`gradient-btn ${props.className || ''}`}
    >
      {children}
    </Button>
  );
}

