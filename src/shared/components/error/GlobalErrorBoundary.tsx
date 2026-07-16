import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Cập nhật state để lần render tiếp theo hiển thị UI fallback.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Nơi log lỗi ra service bên thứ 3 (ví dụ Sentry)
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-white mb-2">Đã có lỗi hệ thống xảy ra</h1>
            <p className="text-zinc-400 mb-6 text-sm">
              Rất xin lỗi, giao diện ứng dụng gặp sự cố trong quá trình render. Bạn vui lòng thử tải lại trang.
            </p>
            
            {/* Hiển thị chi tiết lỗi ở môi trường dev, ẩn đi ở production */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-black/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-32">
                <code className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors w-full"
            >
              <RefreshCw className="w-4 h-4" />
              Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
