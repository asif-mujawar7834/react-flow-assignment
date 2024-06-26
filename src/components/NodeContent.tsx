import React from "react";
import { FaTrash } from "react-icons/fa";
import { FaPen, FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../Redux/Store";
import {
  deleteMessageNode,
  removeNodeFromFlow,
  setSelectedMessageNode,
} from "../Redux/Reducers/MessageNode";
import { Button } from "./Button";
import { NodeContentProps } from "../../types";
import { showToast } from "../Redux/Reducers/ToastSlice";
import { toggleSidebar } from "../Redux/Reducers/SidebarSlice";
import { RiMessage2Line } from "react-icons/ri";

// Define the NodeContent component

export const NodeContent: React.FC<NodeContentProps> = ({ data }) => {
  // Redux hooks to access state and dispatch actions
  const { messageNodes } = useAppSelector((state) => state.messageNodes);
  const { isSidebarOpen } = useAppSelector((state) => state.sidebar);
  const messageNode = messageNodes.find((item) => item.id === data.id);
  const dispatch = useAppDispatch();

  // Function to handle node selection
  const handleNodeSelect = () => {
    if (
      window.matchMedia("(max-width: 768px)").matches &&
      messageNode?.inFlow
    ) {
      dispatch(toggleSidebar(!isSidebarOpen));
    }
    dispatch(setSelectedMessageNode(messageNode));
  };

  // Function to remove node from flow
  const handleRemoveNode = () => {
    dispatch(
      showToast({
        message: "Message Node removed from the flow.",
        type: "success",
      })
    );
    dispatch(
      removeNodeFromFlow({
        id: messageNode?.id,
        inFlow: false,
      })
    );
  };

  // Function to delete node
  const handleDeleteNode = () => {
    dispatch(showToast({ message: "Message Node Deleted.", type: "success" }));
    dispatch(deleteMessageNode({ id: messageNode?.id }));
  };

  // Render the component
  return (
    <div className="w-full border border-black shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="bg-[#a6dfd6] p-2 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <RiMessage2Line />
          <h3 className="font-bold">Send Message</h3>
        </div>
        <div>
          <div className="flex gap-2">
            <Button
              icon={
                messageNode?.inFlow ? (
                  <FaTimes className="text-red-500" />
                ) : (
                  <FaTrash className="cursor-pointer text-red-500" />
                )
              }
              onClick={
                messageNode?.inFlow ? handleRemoveNode : handleDeleteNode
              }
              backgroundColor="none"
              tooltipText={
                messageNode?.inFlow
                  ? "Remove from flow."
                  : "Delete this message node."
              }
            />
            <Button
              icon={<FaPen className="text-green-600 cursor-pointer" />}
              onClick={handleNodeSelect}
              backgroundColor="none"
            />
          </div>
        </div>
      </div>
      <div className="p-2">
        <h2 className="font-semibold">{data.data.label}</h2>
      </div>
    </div>
  );
};
