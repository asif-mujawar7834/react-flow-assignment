import { createSlice } from "@reduxjs/toolkit";

export interface messageNodeType {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
  type: string;
  status?: string;
  inFlow: boolean;
}

interface messageNodeEdge {
  id: string;
  source: string;
  target: string;
}

interface initialStateType {
  messageNodes: messageNodeType[];
  selectedMessageNode: null | messageNodeType;
  messageNodeEdges: messageNodeEdge[];
}

const initialState: initialStateType = {
  messageNodes: [
    {
      id: "1",
      position: { x: 30, y: 30 },
      data: { label: "Text Message 1" },
      type: "custom",
      inFlow: true,
    },
    {
      id: "2",
      position: { x: 60, y: 160 },
      data: { label: "Text Message 2" },
      type: "custom",
      inFlow: true,
    },
    {
      id: "3",
      position: { x: 140, y: 270 },
      data: { label: "Text Message 3" },
      type: "custom",
      inFlow: true,
    },
    {
      id: "4",
      position: { x: 150, y: 400 },
      data: { label: "Text Message 4" },
      type: "custom",
      inFlow: true,
    },
    {
      id: "5",
      position: { x: 180, y: 470 },
      data: { label: "Text Message 5" },
      type: "custom",
      inFlow: false,
    },
  ],
  selectedMessageNode: null,
  messageNodeEdges: [
    { id: "e1-2", source: "1", target: "2" },
    {
      id: "e2-3",
      source: "2",
      target: "3",
    },
  ],
};

export const MessageNodeSlice = createSlice({
  name: "MessageNode",
  initialState,
  reducers: {
    addMessageNode: (state, action) => {
      state.messageNodes = [...state.messageNodes, action.payload];
    },
    setSelectedMessageNode: (state, action) => {
      state.selectedMessageNode = action.payload;
    },
    addMessageNodeInFlow: (state, action) => {
      state.messageNodes = state.messageNodes.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            inFlow: true,
          };
        }
        return item;
      });
    },
    updateMessageNodePosition: (state, action) => {
      state.messageNodes = state.messageNodes.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            position: action.payload.position,
          };
        }
        return item;
      });
    },
    deleteMessageNode: (state, action) => {
      state.messageNodes = state.messageNodes.filter(
        (item) => item.id !== action.payload.id
      );
    },
    updateMessageNode: (state, action) => {
      state.messageNodes = state.messageNodes.map((messageNode) => {
        if (messageNode.id === action.payload.id) {
          return {
            ...messageNode,
            data: {
              ...messageNode.data,
              label: action.payload.newMessage,
            },
          };
        }
        return messageNode;
      });
    },

    removeNodeFromFlow: (state, action) => {
      const { id, inFlow } = action.payload;
      state.messageNodes = state.messageNodes.map((messageNode) => {
        if (messageNode.id === id) {
          return {
            ...messageNode,
            inFlow,
          };
        }
        return messageNode;
      });

      if (!inFlow) {
        state.messageNodeEdges = state.messageNodeEdges.filter(
          (edge) => edge.source !== id && edge.target !== id
        );
      }
    },

    setEdges: (state, action) => {
      state.messageNodeEdges = action.payload;
    },
    addEdge: (state, action) => {
      state.messageNodeEdges = action.payload;
    },
    updateEdge: (state, action) => {
      const index = state.messageNodeEdges.findIndex(
        (edge) => edge.id === action.payload.id
      );
      if (index !== -1) {
        state.messageNodeEdges[index] = action.payload;
      }
    },
    removeEdge: (state, action) => {
      state.messageNodeEdges = state.messageNodeEdges.filter(
        (edge) => edge.id !== action.payload
      );
    },
  },
});

export const {
  addMessageNode,
  setSelectedMessageNode,
  updateMessageNode,
  updateMessageNodePosition,
  deleteMessageNode,
  removeNodeFromFlow,
  addEdge,
  removeEdge,
  addMessageNodeInFlow,
} = MessageNodeSlice.actions;

export default MessageNodeSlice.reducer;
