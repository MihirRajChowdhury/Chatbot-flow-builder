import React from 'react';

const styles = {
  card: {
    background: 'white',
    borderRadius: '14px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    padding: '24px 24px 16px 24px',
    margin: '24px 0',
    minWidth: '260px',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    position: 'relative',
  },
  back: {
    position: 'absolute',
    left: '16px',
    top: '18px',
    fontSize: '20px',
    color: '#2563eb',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    outline: 'none',
    zIndex: 2
  },
  header: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#374151',
    textAlign: 'center',
    marginBottom: '8px',
    marginTop: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    marginTop: '8px'
  },
  textarea: {
    width: '100%',
    minHeight: '60px',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '15px',
    color: '#374151',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border 0.2s',
  }
};

export default function SettingsPanel({ selectedNode, updateNode, selectedNodeId, onBack }) {
  if (!selectedNode) return null;
  return (
    <div style={styles.card}>
      <button style={styles.back} onClick={onBack} title="Back to Nodes Panel">←</button>
      <div style={styles.header}>Message</div>
      <div>
        <div style={styles.label}>Text</div>
        <textarea
          style={styles.textarea}
          value={selectedNode.data.text}
          onChange={e => updateNode(selectedNodeId, { data: { ...selectedNode.data, text: e.target.value } })}
          placeholder="Enter your message..."
        />
      </div>
    </div>
  );
} 