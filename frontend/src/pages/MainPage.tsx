import { useState } from "react";
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

import {ViewSongRef} from "../components/ViewSong";
import EditSong from "../components/EditSong";

import useRestAPI from "../hooks/useRestAPI";
import UserScore, {NO_POINTS} from "../models/UserScore";

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

  const editSong = (songId: number) => {
    setEditorSong(songId);
  };

  const saveSongData = (newScore: UserScore) => {
    for (let i = 0; i < userScores.length; i++) {
      if (userScores[i].song_id == newScore.song_id) {
        userScores[i] = newScore;
        break;
      }
    }
    save(userScores, true);
    setEditorSong(-1);
    console.debug("Song data updated", newScore);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 10}
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const {active} = event;
    console.debug("Drag start", active.id);
    setDragged(active.id);
  };

  const handleDragOver = (event: any) => {
    handleDrag(event, false);
  };
  
  const handleDragEnd = (_: any) => {
    setDragged(null);
    save(userScores, true);
  };

  const handleDrag = ({active, over}: any, saveRest: boolean) => {
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
      newScores[newIndex].points = NO_POINTS;
    }
    save(newScores, saveRest);
  };

  if (isLoading) {
    return <pre>Loading...</pre>;
  }

  const ranking = userScores.filter(score => score.points != NO_POINTS);
  const unranked = userScores.filter(score => score.points == NO_POINTS);

  console.debug(
  "\neuroInfo", euroInfo,
  "\nuserScores", userScores,
  "\nranking", ranking,
  "\nunranked", unranked,
  );

  return <>
    {editorSong != -1 &&
      <EditSong
        song={euroInfo.countries[editorSong]}
        userScore={userScores.find(score => score.song_id == editorSong)!}
        saveCallback={saveSongData}
        cancelCallback={() => setEditorSong(-1)}
      />
    }
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
      onDragOver={handleDragOver}
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
            items={ranking as any}
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
          items={unranked as any}
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
