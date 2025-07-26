import React from 'react';

export default function CurvedEdge({ edge, nodes }) {
  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);
  
  if (!sourceNode || !targetNode) return null;

  const nodeHeight = 70;
  const nodeWidth = 220;

  // Debug: Log the positions to see what we're working with
  console.log('Source node:', sourceNode);
  console.log('Target node:', targetNode);

  // Try different positioning approaches:
  
  // Approach 1: Assuming position is top-left corner of node
  const startX = sourceNode.position.x;
  const startY = sourceNode.position.y;
  const endX = targetNode.position.x - 17  - nodeWidth / 2;
  const endY = targetNode.position.y;

  // Approach 2: If position is center of node, uncomment these instead:
  // const startX = sourceNode.position.x + nodeWidth / 2;
  // const startY = sourceNode.position.y;
  // const endX = targetNode.position.x - nodeWidth / 2;
  // const endY = targetNode.position.y;

  console.log('Calculated positions:', { startX, startY, endX, endY });

  // Create a smooth curve
  const deltaX = endX - startX;
  const controlOffset = Math.abs(deltaX) * 0.4; // Adjust curve intensity

  const controlPoint1X = startX + controlOffset;
  const controlPoint1Y = startY;
  const controlPoint2X = endX - controlOffset;
  const controlPoint2Y = endY;

  const pathData = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="7"
          markerHeight="7"
          refX="6" // Adjusted to position arrow tip properly
          refY="3.5"
          orient="auto" // Changed from "90" to "auto" so arrow follows path direction
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="#6b7280" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        stroke="#6b7280"
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrowhead)"
        filter="url(#glow)"
        opacity="0.8"
      />
    </svg>
  );
}