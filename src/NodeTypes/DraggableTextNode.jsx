import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Custom Text Node for React Flow
 * - Shows text
 * - Top: target handle (multiple allowed)
 * - Bottom: source handle (only one outgoing edge allowed)
 */
export default function DraggableTextNode({ data }) {
  return (
    <div className="bg-white rounded shadow p-4 min-w-[120px] border border-gray-300">
      {/* Target handle (top) */}
      <Handle type="target" position={Position.Top} />
      <div className="text-gray-800 text-sm">{data.text}</div>
      {/* Source handle (bottom) */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
} 