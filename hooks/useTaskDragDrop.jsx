import { useDrag, useDrop } from "react-dnd";

export function useTaskDragDrop({ id, index, onMove, type = "TASK" }) {
  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (item.index !== index) {
        onMove(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return { drag, drop, isDragging };
}
