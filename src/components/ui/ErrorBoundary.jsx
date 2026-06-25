import React from 'react';
import { Button } from 'antd';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">页面出现异常</h1>
          <p className="text-gray-500 max-w-md text-center">
            {this.state.error?.message || '发生未知错误，请尝试刷新页面'}
          </p>
          <Button type="primary" onClick={() => window.location.reload()}>
            刷新页面
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
