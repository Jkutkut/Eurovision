import { forwardRef, useEffect, useState } from "react";
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

import ViewSong, {ViewSongRef} from "../components/ViewSong";
import EditSong from "../components/EditSong";

import SongData from "../models/SongData";
import useRestAPI from "../hooks/useRestAPI";
import Song from "../models/Song";

interface Props {
  restAPI: ReturnType<typeof useRestAPI>;
}

const MainPage = ({restAPI}: Props) => {
  const {
    user, logout,
    euroInfo, userScores,
    save,
    isLoading
  } = restAPI;

  const [ editorSong, setEditorSong ] = useState(-1);
  const [dragged, setDragged] = useState(null);
  const [ myData, setMyData ] = useState<any[]>([]);

  const editSong = (country: string) => {};
  // const editSong = (country: string) => {
  //   console.log("Edit song: " + country);
  //   let song: number = -1;
  //   for (let i = 0; i < myData.length; i++) {
  //     if (country == myData[i].song.country) {
  //       song = i;
  //       break;
  //     }
  //   }
  //   if (song == -1)
  //     throw new Error("UPS, i can't find the country");
  //   setEditorSong(song);
  // };

  const saveSongData = (newSongData: SongData) => {}
  // const saveSongData = (newSongData: SongData) => {
  //   console.log("Update song data", newSongData);
  //   let i: number;

  //   for (i = 0; i < myData.length; i++) {
  //     if (myData[i].song.country == newSongData.song.country) {
  //       break;
  //     }
  //   }
  //   if (i == myData.length)
  //     throw new Error("UPS, i can't find the country");
  //   myData[i] = newSongData;
  //   setMyData(myData);
  //   console.log("Song data updated", i);
  //   setEditorSong(-1);
  // };

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
    console.debug("Drag start", active.id);
    setDragged(active.id);
  };
  
  const handleDragEnd = (event) => {
    setDragged(null);
    const {active, over} = event;
    if (active.id == over.id) {
      return;
    }
    console.debug("Drag of", active.id, "over", over.id);
    let newScores;
    const activeSongId = parseInt(active.id);
    const oldIndex = userScores.findIndex(song => song.song_id == activeSongId);
    let newIndex;
    if (over.id == "ranking-drop") {
      newIndex = 0;
    }
    else {
      const overSongId = parseInt(over.id);
      newIndex = userScores.findIndex(song => song.song_id == overSongId);
    }
    newScores = arrayMove(userScores, oldIndex, newIndex);

    if (over.id == "ranking-drop" || over.data.current.sortable.containerId == "ranking") {
      // If the movement is in the ranking
      newScores[newIndex].points = 0;
    }
    else if (active.data.current.sortable.containerId == "ranking") {
      // Ranking to no ranking
      console.debug(over.data.current.sortable.containerId);
      newScores[newIndex].points = SongData.NO_POINTS;
    }

    save(newScores);
  };

  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  const ranking = userScores
    .filter(score => score.points != SongData.NO_POINTS);
  const unranked = userScores
    .filter(score => score.points == SongData.NO_POINTS);

  console.debug(
  "\neuroInfo", euroInfo,
  "\nuserScores", userScores,
  "\nranking", ranking,
  "\nunranked", unranked,
  );

  return <>
    <div className="mt-3 ms-3 me-3">
      <div className="row align-items-end">
        <div className="col">
          <div className="h5 m-0">{user}</div>
        </div>
        <div className="col text-end">
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={logout}
          ></button>
        </div>
      </div>
    </div>
    <br/>
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="d-flex flex-column gap-2 p-0 m-3">
        <Dropable id="ranking-drop"
          className="d-flex flex-column gap-2"
        >
          {ranking.length == 0 &&
            <div className="text-center pt-3 pb-3 bg-secondary">
              Drag a song here to rank it
            </div>
          }
          <SortableContext
            id="ranking"
            items={ranking}
            strategy={verticalListSortingStrategy}
          >
            {ranking.map((songScore: any) => (
              <SortableItem key={songScore.song_id} id={songScore.song_id.toString()}>
                <ViewSongRef
                  song={euroInfo.countries[songScore.song_id]}
                  songScore={songScore}
                  editCallback={editSong}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </Dropable>
      </div>
      <hr/>
      <div className="d-flex flex-column gap-2 p-0 m-3">
        <SortableContext
          id="unranked"
          items={unranked}
          strategy={verticalListSortingStrategy}
        >
          {unranked.map((score: any) => (
            <SortableItem key={score.song_id} id={score.song_id.toString()}>
              <ViewSongRef
                song={euroInfo.countries[score.song_id]}
                songScore={score}
                editCallback={editSong}
              />
            </SortableItem>
          ))}
        </SortableContext>
        <DragOverlay>
          {dragged && <ViewSongRef
            song={euroInfo.countries[dragged]}
            songScore={userScores.find(
              score => score["song_id"] == dragged
            )}
            editCallback={editSong}
          />}
        </DragOverlay>
      </div>
    </DndContext>
  </>;
};

export default MainPage;
