import React from 'react';

const styles = {
  saveButton: {
    position: 'fixed',
    top: '28px',
    right: '360px', // 320px sidebar + 40px margin
    zIndex: 20,
    backgroundColor: 'white',
    color: '#2563eb',
    padding: '10px 28px',
    border: '2px solid #2563eb',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.04)',
    fontWeight: 700,
    fontSize: '17px',
    outline: 'none',
    transition: 'all 0.18s',
  },
  saveButtonHover: {
    backgroundColor: '#f1f5fd',
    borderColor: '#1d4ed8',
    color: '#1d4ed8',
    boxShadow: '0 4px 16px rgba(37,99,235,0.08)'
  }
};

export default function SaveButton({ onSave }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      style={{
        ...styles.saveButton,
        ...(hovered ? styles.saveButtonHover : {})
      }}
      onClick={onSave}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Save Changes
    </button>
  );
} 