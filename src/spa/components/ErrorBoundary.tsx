import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RotateCcw } from "lucide-react";

type Props = { children: ReactNode };
type State = { failed: boolean };
/** Catch an unexpected page render error instead of showing a frozen blank screen. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Page rendering error", error, info.componentStack); }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="container flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-accent-soft text-accent-text"><AlertTriangle size={36}/></span>
      <h1 className="mb-3 text-3xl font-extrabold">This page couldn’t be displayed</h1>
      <p className="mb-8 max-w-md text-grey-600">Something unexpected happened while loading this page. You can retry or return to the shop.</p>
      <div className="flex flex-wrap justify-center gap-3"><button className="btn-primary" onClick={() => { this.setState({ failed: false }); window.location.reload(); }}><RotateCcw size={16}/> Retry</button><Link to="/" className="btn-outline" onClick={() => this.setState({ failed: false })}>Back to home</Link></div>
    </section>;
  }
}
