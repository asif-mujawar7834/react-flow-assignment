import { useAppDispatch, useAppSelector } from "../Redux/Store";

import {
  messageNodeType,
  setSelectedMessageNode,
} from "../Redux/Reducers/MessageNode";
import { BsArrowLeft } from "react-icons/bs";
import { NodeContent } from "./NodeContent";
import { AddEditNodeForm } from "./AddEditNodeForm";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "./Button";
import { toggleSidebar } from "../Redux/Reducers/SidebarSlice";

export const SettingPanel = () => {
  const { isSidebarOpen } = useAppSelector((state) => state.sidebar);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedMessageNode = useAppSelector(
    (state) => state.messageNodes.selectedMessageNode as messageNodeType | null
  );
  const { messageNodes } = useAppSelector((state) => state.messageNodes);
  const inFlowMessageNodes = messageNodes.filter((item) => !item.inFlow);
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

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar(!isSidebarOpen));
  };

  return (
    <>
      <button
        className="fixed top-5 right-5 md:hidden p-2 bg-blue-500 text-white rounded-md"
        onClick={handleSidebarToggle}
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

          <div className="md:hidden">
            <Button
              icon={<FaTimes />}
              onClick={handleSidebarToggle}
              backgroundColor="red"
            />
          </div>
        </div>
        <div className="flex flex-col p-2 h-full">
          {selectedMessageNode ? (
            <div className="flex flex-col gap-2 flex-grow">
              <AddEditNodeForm />
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2 flex-grow overflow-auto">
              {inFlowMessageNodes.length > 0 ? (
                inFlowMessageNodes.map((messageNode) => (
                  <NodeContent key={messageNode.id} data={messageNode} />
                ))
              ) : (
                <p>
                  No message nodes are available currently in the panel. You can
                  add new messages by clicking "Add New Message".
                </p>
              )}
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
