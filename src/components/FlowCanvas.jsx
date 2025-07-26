import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function FlowCanvas(props) {
  return (
    <main className="flex-1 relative">
      <ReactFlow {...props}>
        <Background />
        <Controls />
        {props.children}
      </ReactFlow>
    </main>
  );
} 