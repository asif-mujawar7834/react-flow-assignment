import { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Edge,
  NodeDragHandler,
  Connection,
  NodeTypes,
  OnEdgesDelete,
  OnConnect,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { CustomNode } from "./CustomNode";
import { SettingPanel } from "./Sidebar";
import { useAppDispatch, useAppSelector } from "../Redux/Store";
import {
  updateMessageNodePosition,
  addEdge as addEdgeAction,
  removeEdge as removeEdgeAction,
} from "../Redux/Reducers/MessageNode";
import { FaSave } from "react-icons/fa";
import { showToast } from "../Redux/Reducers/ToastSlice";
import { Button } from "./Button";

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const Flow = () => {
  const { messageNodes, messageNodeEdges } = useAppSelector(
    (state) => state.messageNodes
  );
  const edgeData = useAppSelector(
    (state) => state.messageNodes.messageNodeEdges
  );
  const dispatch = useAppDispatch();

  const [nodes, setNodes, onNodesChange] = useNodesState(messageNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(edgeData);

  useEffect(() => {
    const filteredNodes = messageNodes.filter((item) => item.inFlow);
    setNodes(filteredNodes);
  }, [messageNodes, setNodes]);

  useEffect(() => {
    setEdgesState(edgeData);
  }, [edgeData, setEdgesState]);

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

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_, node) => {
      dispatch(
        updateMessageNodePosition({ id: node.id, position: node.position })
      );
    },
    [dispatch]
  );

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (edges: Edge[]) => {
      if (edges.length > 0) {
        const edge = edges[0];
        dispatch(removeEdgeAction(edge.id));
      }
    },
    [dispatch]
  );

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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodeDragStop={onNodeDragStop}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
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
        </ReactFlowProvider>
      </div>
      <SettingPanel />
    </div>
  );
};
