import React from 'react';

const styles = {
  nodeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '18px 0',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '2px solid #2563eb',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    cursor: 'grab',
    marginBottom: '18px',
    userSelect: 'none',
    transition: 'all 0.2s',
    fontWeight: 600,
    fontSize: '16px',
    outline: 'none',
  },
  nodeItemHover: {
    border: '2px solid #1d4ed8',
    boxShadow: '0 4px 16px rgba(37,99,235,0.08)'
  },
  nodeIcon: {
    fontSize: '28px',
    color: '#2563eb',
    marginBottom: '2px'
  },
  sidebarTitle: {
    fontWeight: 'bold',
    marginBottom: '24px',
    fontSize: '18px',
    color: '#374151',
    textAlign: 'center'
  }
};

// Transparent image for drag preview
const transparentImg =
  typeof window !== 'undefined'
    ? (() => {
        const img = new window.Image();
        img.src =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=';
        return img;
      })()
    : null;

export default function NodesPanel({ NODE_TYPES, onDragStart }) {
  const [hovered, setHovered] = React.useState(null);

  // Enhanced drag start handler
  const handleDragStart = (e, type) => {
    if (transparentImg) {
      e.dataTransfer.setDragImage(transparentImg, 0, 0);
    }
    console.log('Drag started for type:', type);
    onDragStart(e, type);
  };

  return (
    <div>
      <div style={styles.sidebarTitle}>Nodes Panel</div>
      <div>
        {Object.values(NODE_TYPES).map((type) => (
          <div
            key={type.type}
            style={{
              ...styles.nodeItem,
              ...(hovered === type.type ? styles.nodeItemHover : {})
            }}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, type.type)}
            onMouseEnter={() => setHovered(type.type)}
            onMouseLeave={() => setHovered(null)}
            tabIndex={0}
          >
            <span style={styles.nodeIcon}>{type.icon}</span>
            <span>{type.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 