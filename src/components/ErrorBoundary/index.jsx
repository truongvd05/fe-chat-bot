import NotFound from "@/page/NotFound";
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <NotFound/>; // hoặc component 404 của bạn
        }
        return this.props.children;
    }
}

export default ErrorBoundary;