import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableRow({ id, children, className = "" }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "z-20 opacity-80" : ""} ${className}`}>
      <div className="flex items-stretch gap-2">
        <button
          className="flex min-h-10 w-8 shrink-0 cursor-grab items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag item"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function SortableList({ ids, onReorder, children, strategy = "vertical", className = "" }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const sortingStrategy = strategy === "grid" ? rectSortingStrategy : verticalListSortingStrategy;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);
        onReorder(arrayMove(ids, oldIndex, newIndex), oldIndex, newIndex);
      }}
    >
      <SortableContext items={ids} strategy={sortingStrategy}>
        <div className={className}>{children(SortableRow)}</div>
      </SortableContext>
    </DndContext>
  );
}
