import { forwardRef, useState } from "react";
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

import {SortableItem, Dropable} from '../components/dnd';

import ViewSong from "../components/ViewSong";
import EditSong from "../components/EditSong";

import SongData from "../models/SongData";
import useRestAPI from "../hooks/useRestAPI";

interface Props {
  user: string;
}

const MainPage = ({ user }: Props) => {
  // TODO hook rest service
  // TODO rework points
  // TODO refactor
  const { myData, setMyData, isLoading } = useRestAPI({user});
  const [ editorSong, setEditorSong ] = useState(-1);
  const [dragged, setDragged] = useState(null);

  const editSong = (country: string) => {
    console.log("Edit song: " + country);
    let song: number = -1;
    for (let i = 0; i < myData.length; i++) {
      if (country == myData[i].song.country) {
        song = i;
        break;
      }
    }
    if (song == -1)
      throw new Error("UPS, i can't find the country");
    setEditorSong(song);
  };

  const saveSongData = (newSongData: SongData) => {
    console.log("Update song data", newSongData);
    let i: number;

    for (i = 0; i < myData.length; i++) {
      if (myData[i].song.country == newSongData.song.country) {
        break;
      }
    }
    if (i == myData.length)
      throw new Error("UPS, i can't find the country");
    myData[i] = newSongData;
    setMyData(myData);
    console.log("Song data updated", i);
    setEditorSong(-1);
  };

  // TODO refactor
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 10}
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const {active} = event;
    setDragged(active.id);
  };
  
  const handleDragEnd = (event) => {
    // TODO refactor
    console.log("Drag end", event);
    const {active, over} = event;
    console.log("Drag end", active.id, over.id);
    if (active.id !== over.id) {
      if (over.id == "ranking-drop") {
        const newData = [...myData];
        const newIndex = myData.findIndex(item => item.id == over.id);
        newData[newIndex].points = 0; // Will be updated now
        const points = [12, 10, 8, 6, 5, 4, 3, 2, 1];
        let startingIndex = 0;
        for (let i = 0; i < newIndex; i++) {
          if (newData[i].points == SongData.NO_POINTS)
            continue;
          startingIndex++;
        }
        for (let i = newIndex, j = startingIndex; i < newData.length; i++) {
          if (newData[i].points == SongData.NO_POINTS)
            continue;
          let point = j < points.length ? points[j++] : 0;
          newData[i].points = point;
        }
        return;
      }

      const oldIndex = myData.findIndex(item => item.id == active.id);
      const newIndex = myData.findIndex(item => item.id == over.id);
      if (oldIndex == -1 || newIndex == -1) {
        return;
      }
      const newData = arrayMove(myData, oldIndex, newIndex);
      const activeZone = active.data.current.sortable.containerId;
      const overZone = over.data.current.sortable.containerId;
      if (activeZone !== overZone) {
        if (activeZone == "ranking") { // From ranking to unranked
          newData[newIndex].points = SongData.NO_POINTS;
        }
        else { // From unranked to ranking
          newData[newIndex].points = 0; // Will be updated now
          const points = [12, 10, 8, 6, 5, 4, 3, 2, 1];
          let startingIndex = 0;
          for (let i = 0; i < newIndex; i++) {
            if (newData[i].points == SongData.NO_POINTS)
              continue;
            startingIndex++;
          }
          for (let i = newIndex, j = startingIndex; i < newData.length; i++) {
            if (newData[i].points == SongData.NO_POINTS)
              continue;
            let point = j < points.length ? points[j++] : 0;
            newData[i].points = point;
          }
        }
      }
      else if (activeZone == "ranking") {
        const points = [12, 10, 8, 6, 5, 4, 3, 2, 1];
        for (let i = 0, j = 0; i < newData.length; i++) {
          if (newData[i].points == SongData.NO_POINTS)
            continue;
          let point = j < points.length ? points[j++] : 0;
          newData[i].points = point;
        }
      }
      setMyData(newData);
    }
    setDragged(null);
  }

  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  const ranking = myData
    .filter(data => data.points != SongData.NO_POINTS);
  const unranked = myData.filter(data => data.points == SongData.NO_POINTS);

  return (<>
    <div className="container mt-3">
      <div className="row align-items-end">
        <div className="col">
          <div className="h5 m-0">{user}</div>
        </div>
        <div className="col text-end">
          <button type="button" className="btn-close" aria-label="Close" onClick={logout}></button>
        </div>
      </div>
    </div>

    <br/>
    {editorSong != -1 &&
      <EditSong
        songData={myData[editorSong]}
        cancelCallback={() => setEditorSong(-1)}
        saveCallback={saveSongData}
      />
    }
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Dropable id="ranking-drop">
        <div className="container d-flex flex-column gap-2 p-0 m-3 bg-secondary">
          {ranking.length == 0 &&
            <div className="text-center">
              Drag a song here to rank it
            </div>
          }
          <SortableContext
            id="ranking"
            items={ranking}
            strategy={verticalListSortingStrategy}
          >
            {ranking.map((songData: SongData) => (
              <SortableItem key={songData.id} id={songData.id}>
                <ViewSongRef
                  songData={songData}
                  editCallback={editSong}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </div>
      </Dropable>
      <div className="container d-flex flex-column gap-2">
        <SortableContext
          id="unranked"
          items={unranked}
          strategy={verticalListSortingStrategy}
        >
          {unranked.map((songData: SongData) => (
            <SortableItem key={songData.id} id={songData.id}>
              <ViewSongRef
                songData={songData}
                editCallback={editSong}
              />
            </SortableItem>
          ))}
        </SortableContext>
        <DragOverlay>
          {dragged && <ViewSongRef
            songData={myData.find(item => item.id == dragged)}
            editCallback={editSong}
          />}
        </DragOverlay>
      </div>
    </DndContext>
  </>);
};

const ViewSongRef = forwardRef((props: any, ref) => {
  return <ViewSong {...props} ref={ref} />
});

const logout = () => {
  localStorage.removeItem('login');
  window.location.reload();
};

export default MainPage;
