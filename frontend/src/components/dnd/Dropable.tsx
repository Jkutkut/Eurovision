import {useDroppable} from '@dnd-kit/core';

interface Props {
  id: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
}

export const Dropable = ({id, style, children}: Props) => {
  const {isOver, setNodeRef} = useDroppable({
    id
  });
  const componentStyle = {
    ...style
  };
  
  
  return (
    <div ref={setNodeRef} style={componentStyle}>
      {children}
    </div>
  );
};
