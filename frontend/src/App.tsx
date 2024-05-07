import {useState} from 'react';
import {
  closestCenter,
  DndContext, 
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const App = () => {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(['1', '2', '3']);
  const sensors = useSensors(
    useSensor(PointerSensor, {
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const {active} = event;
    setActiveId(active.id);
  };
  
  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map(id => <SortableItem key={id} id={id} />)}
      </SortableContext>
      <DragOverlay>
      {/*
        {activeId && <Item id={"dragged" + activeId} />}
      */}
      </DragOverlay>
    </DndContext>
  );
}

export default App;

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';


export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const value = props.id
  
  return (
    <Item ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {value}
    </Item>
  );
}

import {forwardRef} from 'react';

export const Item = forwardRef(({id, ...props}, ref) => {
  const {style, ...rest} = props;
  const itemStyle = {
    touchAction: 'none',
    width: '100%',
    height: '100px',
    backgroundColor: '#f0f0f0',
    margin: '0 0 4px 0',
    ...style,
  };
  return (
    <div {...rest} style={itemStyle} ref={ref}>
      Element Original: {props.children} {id && `Dragged: ${id}`}
    </div>
  )
});
