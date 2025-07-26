import React, { useState, useCallback, useRef } from 'react';
import NodesPanel from './components/NodesPanel';
import DraggableTextNode from './components/DraggableTextNode';
import CurvedEdge from './components/CurvedEdge';
import SettingsPanel from './components/SettingsPanel';
import SaveButton from './components/SaveButton';

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden'
  },
  sidebar: {
    width: '320px',
    backgroundColor: '#f3f4f6',
    borderLeft: '1px solid #d1d5db',
    boxSizing: 'border-box',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    overflow: 'hidden'
  },
  sidebarContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  canvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
    width: '100%',
    height: '100vh',
    backgroundImage: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
    backgroundSize: '20px 20px'
  },
  connectingIndicator: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
  }
};

// Node types registry
const NODE_TYPES = {
  text: {
    type: 'text',
    label: 'Message',
    icon: '💬'
  }
};

// Main App
export default function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);

  // Node id generator
  const nodeIdRef = useRef(0);
  const getId = () => `node_${nodeIdRef.current++}`;

  // Node panel drag
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Canvas drop
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      setNodes(prev => [
        ...prev,
        {
          id: getId(),
          type,
          position,
          data: { text: 'Text Node' }
        }
      ]);
    },
    []
  );

  // Allow drop
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Node selection
  const selectNode = useCallback((nodeId) => setSelectedNodeId(nodeId), []);

  // Node drag
  const dragNode = useCallback((nodeId, newPosition) => {
    setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, position: newPosition } : node));
  }, []);

  // Node update
  const updateNode = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, ...updates } : node));
  }, []);

  // Edge add
  const addEdge = useCallback((edge) => setEdges(prev => [...prev, edge]), []);

  // Connection logic
  const startConnection = useCallback((nodeId) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);
  const completeConnection = useCallback((targetNodeId) => {
    if (connectingFrom && connectingFrom !== targetNodeId) {
      const hasOutgoing = edges.some((e) => e.source === connectingFrom);
      if (hasOutgoing) {
        alert('This node already has an outgoing connection!');
      } else {
        const newEdge = {
          id: `${connectingFrom}-${targetNodeId}`,
          source: connectingFrom,
          target: targetNodeId
        };
        addEdge(newEdge);
      }
    }
    setIsConnecting(false);
    setConnectingFrom(null);
  }, [connectingFrom, edges, addEdge]);
  const cancelConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectingFrom(null);
  }, []);

  // Canvas click
  const onCanvasClick = (event) => {
    if (event.target === event.currentTarget) {
      selectNode(null);
      if (isConnecting) cancelConnection();
    }
  };

  // Node handle click
  const onHandleClick = (nodeId, handleType) => {
    if (handleType === 'source' && !isConnecting) {
      startConnection(nodeId);
    } else if (handleType === 'target' && isConnecting && connectingFrom !== nodeId) {
      completeConnection(nodeId);
    }
  };

  // Save logic
  const onSave = () => {
    if (nodes.length === 0) {
      alert('No nodes to save!');
      return;
    }
    const nodesWithNoIncoming = nodes.filter(
      (node) => !edges.some((edge) => edge.target === node.id)
    );
    if (nodesWithNoIncoming.length > 1) {
      alert('Error: More than one node has empty target handles!');
      return;
    }
    alert(`Flow saved! ${nodes.length} nodes and ${edges.length} connections saved.`);
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div style={styles.container}>
      <SaveButton onSave={onSave} />
      <main style={styles.canvas} onDrop={onDrop} onDragOver={onDragOver} onClick={onCanvasClick}>
        {/* Render edges */}
        {edges.map(edge => (
          <CurvedEdge key={edge.id} edge={edge} nodes={nodes} />
        ))}
        {/* Render nodes */}
        {nodes.map(node => (
          <DraggableTextNode
            key={node.id}
            nodeId={node.id}
            data={node.data}
            position={node.position}
            isSelected={selectedNodeId === node.id}
            isConnecting={isConnecting}
            connectingFrom={connectingFrom}
            onClick={() => selectNode(node.id)}
            onHandleClick={onHandleClick}
            onDrag={dragNode}
          />
        ))}
        {/* Connection status indicator */}
        {isConnecting && (
          <div style={styles.connectingIndicator}>
            🔗 Connecting... Click on a target handle (top circle) to complete
          </div>
        )}
      </main>
      {/* Sidebar: show NodesPanel or SettingsPanel depending on selection, now on the right */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarContent}>
          {selectedNode ? (
            <SettingsPanel selectedNode={selectedNode} updateNode={updateNode} selectedNodeId={selectedNodeId} onBack={() => setSelectedNodeId(null)} />
          ) : (
            <NodesPanel NODE_TYPES={NODE_TYPES} onDragStart={onDragStart} />
          )}
        </div>
      </div>
    </div>
  );
}