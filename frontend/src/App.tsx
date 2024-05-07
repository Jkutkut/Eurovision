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

import {SortableItem} from './components/dnd';

const DndDemo = () => {
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
        {items.map(id => <SortableItem key={id} id={id}>
          <Item id={id} />
        </SortableItem>)}
      </SortableContext>
      <DragOverlay>
      {/*
        {activeId && <Item id={"dragged" + activeId} />}
      */}
      </DragOverlay>
    </DndContext>
  );
}

import {forwardRef} from 'react';

interface ItemProps {
  id?: string;
  style: any;
  children: React.ReactNode;
}

export const Item = forwardRef(({id, style, children, ...rest}: ItemProps, ref) => {
  const itemStyle = {
    touchAction: 'none',
    width: '100%',
    height: '100px',
    backgroundColor: '#f0f0f0',
    margin: '0 0 4px 0',
  };
  return (
    <div {...rest} style={itemStyle} ref={ref}>
      Element Original: {children} {id && `Dragged: ${id}`}
    </div>
  )
});

import Login from './pages/Login';
import MainPage from './pages/MainPage';

const App = () => {
  let login = localStorage.getItem('login');
  if (login == null) {
    return (
      <Login />
    );
  }

  return <>
    <MainPage user={login} />
    <DndDemo />
  </>;
}

export default App;
