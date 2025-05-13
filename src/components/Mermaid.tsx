'use client';

import React from 'react';
import mermaid from 'mermaid';

// Defining props type
type MermaidProps = {
  chart: string;
};

// Use it with the component
export default class Mermaid extends React.Component<MermaidProps> {
  componentDidMount() {
    mermaid.contentLoaded();
  }

  render() {
    return <div className="mermaid">{this.props.chart}</div>;
  }
}
