import { useAppDispatch, useAppSelector } from "../Redux/Store";
import { useState } from "react";
import {
  messageNodeType,
  setSelectedMessageNode,
} from "../Redux/Reducers/MessageNode";
import { BsArrowLeft } from "react-icons/bs";
import { NodeContent } from "./NodeContent";
import { AddEditNodeForm } from "./AddEditNodeForm";
import { FaBars } from "react-icons/fa";
import { Button } from "./Button";

export const SettingPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedMessageNode = useAppSelector(
    (state) => state.messageNodes.selectedMessageNode as messageNodeType | null
  );
  const { messageNodes } = useAppSelector((state) => state.messageNodes);
  const dispatch = useAppDispatch();

  const handleAddNewMessageNode = () => {
    dispatch(
      setSelectedMessageNode({
        id: Number(messageNodes[messageNodes.length - 1].id + 1).toString(),
        data: {
          label: "",
        },
        type: "custom",
        position: {
          x: messageNodes[messageNodes.length - 1].position.x + 100,
          y: 200,
        },
        status: "new",
        inFlow: false,
      })
    );
  };

  return (
    <>
      <button
        className="fixed top-5 right-5 md:hidden p-2 bg-blue-500 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>
      <div
        className={`fixed md:sticky top-0 left-0 w-[400px] h-full bg-white border border-black shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center bg-slate-100 mb-2 p-3">
          <BsArrowLeft className="mr-2" />
          <h1 className="font-bold mb-0 text-center flex-1">Messages</h1>
          <button
            className="md:hidden ml-auto p-2 bg-red-500 text-white rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            X
          </button>
        </div>
        <div className="flex flex-col p-2 h-full">
          {selectedMessageNode ? (
            <div className="flex flex-col gap-2 flex-grow">
              <AddEditNodeForm />
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2 flex-grow overflow-auto">
              {messageNodes
                .filter((item) => !item.inFlow)
                .map((messageNode) => (
                  <NodeContent key={messageNode.id} data={messageNode} />
                ))}
              <Button
                buttonText="Add New Message"
                onClick={handleAddNewMessageNode}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};