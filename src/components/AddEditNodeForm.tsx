import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Redux/Store";
import {
  addMessageNode,
  messageNodeType,
  setSelectedMessageNode,
  updateMessageNode,
} from "../Redux/Reducers/MessageNode";
import { showToast } from "../Redux/Reducers/ToastSlice";
import { Button } from "./Button";

export const AddEditNodeForm = () => {
  const selectedMessageNode = useAppSelector(
    (state) => state.messageNodes.selectedMessageNode as messageNodeType | null
  );
  const dispatch = useAppDispatch();

  const data = useMemo(
    () => selectedMessageNode?.data ?? { label: "" },
    [selectedMessageNode]
  );

  const [value, setValue] = useState(data?.label);

  useEffect(() => {
    setValue(data?.label);
  }, [data]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedMessageNode?.status === "new") {
      dispatch(
        addMessageNode({
          ...selectedMessageNode,
          status: "added",
          data: {
            ...selectedMessageNode.data,
            label: value,
          },
        })
      );
    } else {
      dispatch(
        updateMessageNode({ id: selectedMessageNode?.id, newMessage: value })
      );
    }
    dispatch(
      showToast({
        message: `Message ${
          selectedMessageNode?.status === "new" ? "Added" : "Updated"
        } Successfully.!`,
        type: "success",
      })
    );

    dispatch(setSelectedMessageNode(null));
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Enter Message text here..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="border border-gray-500 rounded-md p-1 text-black font-semibold w-full"
      />
      <Button
        buttonText={
          selectedMessageNode?.status === "new" ? "Add Message" : "Save Changes"
        }
      />
    </form>
  );
};
