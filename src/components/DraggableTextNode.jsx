import React, { useState, useRef, useCallback } from 'react';

const styles = {
  node: {
    position: 'absolute',
    backgroundColor: 'white',
    border: '2px solid #10b981',
    borderRadius: '12px',
    minWidth: '220px',
    minHeight: '70px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    padding: 0,
    cursor: 'move',
    zIndex: 2
  },
  nodeSelected: {
    border: '2px solid #2563eb',
    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.3)',
    transform: 'scale(1.02)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d1fae5',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '15px',
    color: '#047857',
    borderBottom: '1px solid #b7e4d8'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerIcon: {
    fontSize: '18px',
    color: '#10b981'
  },
  whatsappIcon: {
    fontSize: '18px',
    color: '#25d366',
    background: 'white',
    borderRadius: '50%',
    padding: '2px',
    border: '1.5px solid #b7e4d8'
  },
  content: {
    padding: '12px 16px',
    color: '#374151',
    fontSize: '15px',
    fontWeight: 500
  },
  handle: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    backgroundColor: '#374151',
    borderRadius: '50%',
    border: '3px solid white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    zIndex: 10
  },
  handleLeft: {
    top: '50%',
    left: '-8px',
    transform: 'translateY(-50%)'
  },
  handleRight: {
    top: '50%',
    right: '-8px',
    transform: 'translateY(-50%)'
  }
};

export default function DraggableTextNode({ 
  data, 
  position, 
  isSelected, 
  onClick, 
  onHandleClick, 
  onDrag,
  isConnecting, 
  connectingFrom, 
  nodeId 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  const nodeStyle = {
    ...styles.node,
    left: position.x,
    top: position.y,
    transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
    ...(isSelected ? styles.nodeSelected : {}),
    ...(isConnecting && connectingFrom === nodeId ? { 
      border: '2px solid #10b981', 
      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)' 
    } : {}),
    ...(isConnecting && connectingFrom !== nodeId ? { 
      border: '2px dashed #f59e0b',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)' 
    } : {}),
    ...(isDragging ? { zIndex: 1000 } : {})
  };

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('node-handle')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    onDrag(nodeId, newPosition);
  }, [isDragging, dragStart, nodeId, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleNodeClick = (e) => {
    if (!e.target.classList.contains('node-handle') && !isDragging) {
      e.stopPropagation();
      if (!isConnecting) {
        onClick();
      }
    }
  };

  const handleSourceClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isConnecting) {
      onHandleClick(nodeId, 'source');
    }
  };

  const handleTargetClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isConnecting && connectingFrom !== nodeId) {
      onHandleClick(nodeId, 'target');
    }
  };

  return (
    <div 
      ref={nodeRef}
      style={nodeStyle} 
      onClick={handleNodeClick}
      onMouseDown={handleMouseDown}
    >
      {/* Target handle (left) */}
      <div 
        className="node-handle"
        style={{
          ...styles.handle, 
          ...styles.handleLeft,
          backgroundColor: isConnecting ? '#f59e0b' : '#6b7280',
        }}
        onClick={handleTargetClick}
        onMouseDown={(e) => e.stopPropagation()}
        title="Target handle - click to connect here"
      ></div>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerIcon}>💬</span>
          <span>Send Message</span>
        </div>
        <span style={styles.whatsappIcon}>🟢</span>
      </div>
      {/* Content */}
      <div style={styles.content}>{data.text}</div>
      {/* Source handle (right) */}
      <div 
        className="node-handle"
        style={{
          ...styles.handle, 
          ...styles.handleRight,
          backgroundColor: isConnecting && connectingFrom === nodeId ? '#10b981' : '#6b7280',
        }}
        onClick={handleSourceClick}
        onMouseDown={(e) => e.stopPropagation()}
        title="Source handle - click to start connection"
      ></div>
    </div>
  );
} 