import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  BackgroundVariant,
  OnConnect,
  Connection,
  Edge,
  NodeDragHandler,
  OnEdgesDelete,
  Node,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomNode } from "./CustomNode";
import { SettingPanel } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../Redux/Store";
import {
  updateMessageNodePosition,
  addEdge as addEdgeAction,
  removeEdge as removeEdgeAction,
  addMessageNodeInFlow,
} from "../Redux/Reducers/MessageNode";
import { FaSave } from "react-icons/fa";
import { showToast } from "../Redux/Reducers/ToastSlice";
import { Button } from "./Button";
import { OnDragOverHandler } from "../../types";

// Define custom node types
const nodeTypes = {
  custom: CustomNode,
};

// Define the main Flow component
export const Flow = () => {
  // Ref to the ReactFlow container
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // State to store the ReactFlow instance
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Redux hooks to access state and dispatch actions
  const { messageNodes, messageNodeEdges } = useAppSelector(
    (state) => state.messageNodes
  );
  const edgeData = useAppSelector(
    (state) => state.messageNodes.messageNodeEdges
  );
  const dispatch = useAppDispatch();

  // Custom hooks to manage nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState(messageNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(edgeData);

  // Filter nodes when the messageNodes state changes
  useEffect(() => {
    const filteredNodes = messageNodes.filter((item) => item.inFlow);
    setNodes(filteredNodes);
  }, [messageNodes, setNodes]);

  // Update edges when the messageNodeEdges state changes
  useEffect(() => {
    setEdgesState(edgeData);
  }, [edgeData, setEdgesState]);

  // Callback function for when a connection is created
  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;
      if (source && target) {
        const edge: Edge = {
          id: `${source}-${target}`,
          source,
          target,
        };

        const newEdge = addEdge(edge, edgeData);
        dispatch(addEdgeAction(newEdge));
      }
    },
    [dispatch, edgeData]
  );

  // Callback function for when a node is dragged
  const onNodeDragStop: NodeDragHandler = useCallback(
    (_, node) => {
      dispatch(
        updateMessageNodePosition({ id: node.id, position: node.position })
      );
    },
    [dispatch]
  );

  // Callback function for when edges are deleted
  const onEdgesDelete: OnEdgesDelete = useCallback(
    (edges) => {
      if (edges.length > 0) {
        const edge = edges[0];
        dispatch(removeEdgeAction(edge.id));
      }
    },
    [dispatch]
  );

  // Function to handle saving the flow
  const handleSaveFlow = () => {
    const filteredMessageNodes = messageNodes.filter((item) => item.inFlow);
    const isFlowValid =
      messageNodeEdges.length === filteredMessageNodes.length - 1;

    const message = isFlowValid
      ? "Flow Saved Successfully."
      : "More than one node should not have empty targets.";

    const type = isFlowValid ? "success" : "error";

    dispatch(showToast({ message, type }));
  };

  // Callback function for handling drag over events
  const onDragOver: OnDragOverHandler = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }, []);

  // Callback function for handling drop events
  const onDrop: OnDragOverHandler = useCallback(
    (event) => {
      event.preventDefault();

      if (event.dataTransfer && reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();

        const customNodeData = event.dataTransfer.getData(
          "application/custom-nodedata"
        );

        if (customNodeData) {
          const parsedNode = JSON.parse(customNodeData);
          const position = (reactFlowInstance as ReactFlowInstance).project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          const newNode: Node = {
            ...parsedNode,
            position: position,
            inFlow: true,
          };

          setNodes((nds) => nds.concat(newNode));
          dispatch(addMessageNodeInFlow({ id: newNode.id, position }));
        }
      }
    },
    [reactFlowInstance, setNodes, dispatch]
  );

  // Render the component
  return (
    <div className="flex relative">
      <div className="h-screen w-full p-5 relative">
        <h1 className="font-bold text-3xl text-center mb-5">
          Chatbot Flow Builder
        </h1>
        <div className="absolute top-24 right-10 z-10 inline-flex">
          <Button
            onClick={handleSaveFlow}
            icon={<FaSave className="mr-2" />}
            buttonText="Save Flow"
          />
        </div>
        <ReactFlowProvider>
          <div className="h-full w-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodeDragStop={onNodeDragStop}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgesDelete={onEdgesDelete}
              nodeTypes={nodeTypes}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              className="bg-slate-100"
            >
              <MiniMap />
              <Controls />
              <Background
                gap={16}
                color="#ddd"
                variant={BackgroundVariant.Lines}
              />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
      <SettingPanel />
    </div>
  );
};
