import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  slideIndex: number;
}

interface State {
  hasError: boolean;
}

export class SlideErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`Slide ${this.props.slideIndex} crashed:`, error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF9F6] p-16">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <p className="font-display font-bold text-dark text-xl mb-2">Slide {this.props.slideIndex + 1} kon niet geladen worden</p>
          <p className="text-text-secondary text-sm">Controleer de data voor deze slide.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
