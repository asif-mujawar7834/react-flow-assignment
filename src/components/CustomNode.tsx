import React from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeContent } from "./NodeContent";

export const CustomNode: React.FC<NodeProps> = (data) => {
  return (
    <>
      <Handle type="source" position={Position.Bottom} />

      <div className="max-w-[600px] min-w-[300px]">
        <NodeContent data={data} />
      </div>
      <Handle type="target" position={Position.Top} />
    </>
  );
};
