import { FaMessage, FaTrash } from "react-icons/fa6";
import { FaPen, FaTimes, FaUndo } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../Redux/Store";
import {
  addMessageNodeInFlow,
  deleteMessageNode,
  removeNodeFromFlow,
  setSelectedMessageNode,
} from "../Redux/Reducers/MessageNode";
import { Button } from "./Button";
import { NodeContentProps } from "../../types";
import { showToast } from "../Redux/Reducers/ToastSlice";
export const NodeContent: React.FC<NodeContentProps> = ({ data }) => {
  const { messageNodes } = useAppSelector((state) => state.messageNodes);
  const messageNode = messageNodes.find((item) => item.id === data.id);
  const dispatch = useAppDispatch();

  const handleNodeSelect = () => {
    dispatch(setSelectedMessageNode(messageNode));
  };

  const handleRemoveNode = () => {
    dispatch(
      showToast({ message: "Message Node removed from flow.", type: "success" })
    );
    dispatch(
      removeNodeFromFlow({
        id: messageNode?.id,
        inFlow: false,
      })
    );
  };

  const handleDeleteNode = () => {
    dispatch(deleteMessageNode({ id: messageNode?.id }));
  };

  const handleAddNoteInFlow = () => {
    dispatch(
      showToast({ message: "Message Node Added to flow.", type: "success" })
    );
    dispatch(addMessageNodeInFlow({ id: messageNode?.id }));
  };

  return (
    <div className="w-full border border-black shadow-lg rounded-lg overflow-hidden bg-white">
      <div className="bg-[#C5FFF8] p-2 flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <FaMessage />
          <h3 className="font-bold">Send Message</h3>
        </div>
        <div>
          <div className="flex gap-2">
            {!messageNode?.inFlow && (
              <Button
                icon={<FaUndo className="text-black cursor-pointer" />}
                onClick={handleAddNoteInFlow}
                backgroundColor="none"
                tooltipText="Add this to flow."
              />
            )}

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
              icon={<FaPen className="text-green-500 cursor-pointer" />}
              onClick={handleNodeSelect}
              backgroundColor="none"
            />
          </div>
        </div>
      </div>
      <div className="p-2">
        <h2>{data.data.label}</h2>
      </div>
    </div>
  );
};
