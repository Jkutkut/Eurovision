import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const finalSpaceCharacters = [
  {
    id: 'abc1',
    name: 'Element 01'
  },
  {
    id: 'abc2',
    name: 'Element 02'
  },
  {
    id: 'abc3',
    name: 'Element 03'
  }
];

const App = () => {
  const [characters, updateCharacters] = useState(finalSpaceCharacters);
  const [v, setv] = useState(0);

  function onDragEnd(result) {
    console.warn(result);
    if (!result.destination) {
      return;
    }
    if (result.destination.droppableId == result.source.droppableId && result.destination.index === result.source.index) {
      return;
    }

    const newCharsArr = Array.from(characters);
    const movedElement = newCharsArr.splice(result.source.index, 1)[0];
    newCharsArr.splice(result.destination.index, 0, movedElement);

    console.log(newCharsArr, movedElement);
    updateCharacters(newCharsArr);
  }

  return <>
    <div
      className="w-100"
      style={{ height: "100vh" }}
    >
      <button onClick={() => setv(v + 1)}>up {v}</button>
      <DragDropContext
        onDragStart={console.log}
        onDragUpdate={console.debug}
        onDragEnd={onDragEnd}
      >
        <Droppable droppableId="characters">
          {(provided) => (
            <div
              className="p-3 d-flex flex-column"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                background: "#EEE"
              }}
            >
              {characters.map(({id, name}, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(p) => (
                    <div
                      {...p.draggableProps /*Element to move*/}
                      {...p.dragHandleProps /*Control container*/}
                      ref={p.innerRef}
                      className="p-3 m-3"
                      style={{border: "2px solid black"}}
                    >
                      { name }
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  </>;
}

export default App;
