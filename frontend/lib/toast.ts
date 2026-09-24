export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface ToastOptions {
  id?: string;
  title?: string;
  duration?: number; // ms, default 5000 (0 for no auto-dismiss)
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

type Listener = (toasts: ToastItem[]) => void;

class ToastManager {
  private toasts: ToastItem[] = [];
  private listeners = new Set<Listener>();

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getToasts(): ToastItem[] {
    return [...this.toasts];
  }

  public show(type: ToastType, message: string, options?: ToastOptions): string {
    const id = options?.id || `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? 5000,
      action: options?.action,
      createdAt: Date.now(),
    };

    // Prevent duplicate spam of exact same message within 2 seconds
    const existingIndex = this.toasts.findIndex((t) => t.message === message && t.type === type);
    if (existingIndex !== -1 && Date.now() - this.toasts[existingIndex].createdAt < 2000) {
      return this.toasts[existingIndex].id;
    }

    // Keep maximum 5 toasts at a time
    this.toasts = [newToast, ...this.toasts].slice(0, 5);
    this.notify();
    return id;
  }

  public dismiss(id: string) {
    const initialLength = this.toasts.length;
    this.toasts = this.toasts.filter((t) => t.id !== id);
    if (this.toasts.length !== initialLength) {
      this.notify();
    }
  }

  public clearAll() {
    this.toasts = [];
    this.notify();
  }

  public error(message: string, options?: ToastOptions): string {
    return this.show('error', message, {
      title: options?.title ?? 'Action Failed',
      ...options,
    });
  }

  public success(message: string, options?: ToastOptions): string {
    return this.show('success', message, {
      title: options?.title ?? 'Success',
      ...options,
    });
  }

  public warning(message: string, options?: ToastOptions): string {
    return this.show('warning', message, {
      title: options?.title ?? 'Notice',
      ...options,
    });
  }

  public info(message: string, options?: ToastOptions): string {
    return this.show('info', message, {
      title: options?.title ?? 'Information',
      ...options,
    });
  }

  /**
   * Helper to show error directly from unknown API error
   */
  public apiError(error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.'): string {
    let msg = fallbackMessage;
    let title = 'Request Failed';

    if (error && typeof error === 'object') {
      const err = error as {
        response?: {
          data?: {
            message?: string | string[];
            statusCode?: number;
          };
        };
        message?: string;
      };
      const responseData = err.response?.data;
      if (responseData?.message) {
        msg = Array.isArray(responseData.message)
          ? responseData.message.join(', ')
          : String(responseData.message);
      } else if (err.message && typeof err.message === 'string') {
        if (err.message === 'Network Error') {
          msg = 'Unable to connect to the server. Please check your internet connection.';
          title = 'Network Connection Lost';
        } else {
          msg = err.message;
        }
      }

      if (responseData?.statusCode) {
        const code = responseData.statusCode;
        if (code === 409) title = 'Conflict';
        else if (code === 401) title = 'Authentication Required';
        else if (code === 403) title = 'Access Denied';
        else if (code === 404) title = 'Not Found';
        else if (code === 422 || code === 400) title = 'Validation Error';
        else if (code >= 500) title = 'Server Error';
      }
    }

    return this.error(msg, { title });
  }
}

export const toast = new ToastManager();
