'use client';

import React from 'react';
import mermaid from 'mermaid';

// Defining props type
type MermaidProps = {
  chart: string;
  onError?: () => void;
};

// Use it with the component
export default class Mermaid extends React.Component<MermaidProps> {
    containerRef = React.createRef<HTMLDivElement>();
    componentDidMount() {
        this.renderMermaid();
    }
    componentDidUpdate(prevProps: MermaidProps) {
        if (prevProps.chart !== this.props.chart) {
          this.renderMermaid();
        }
      }
    
    renderMermaid() {
        mermaid.initialize({ startOnLoad: false });
        const { chart, onError } = this.props;
        mermaid
          .render('generatedChart', chart)
          .then(({ svg }) => {
            if (this.containerRef.current) {
              this.containerRef.current.innerHTML = svg;
            }
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error);
            if (onError) onError();
          });
      }
      
    render() {
        return <div ref={this.containerRef}></div>;
    }
}
