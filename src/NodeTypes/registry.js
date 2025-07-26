// Registry for all node types

import DraggableTextNode from './DraggableTextNode';

export const NODE_TYPES = {
  text: {
    type: 'text',
    label: 'Text Node',
    icon: '📝',
    draggableComponent: DraggableTextNode,
    // reactflowComponent: ... (to be added later)
  },
  // Add more node types here in the future
}; 