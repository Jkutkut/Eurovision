import {useDroppable} from '@dnd-kit/core';

interface Props {
  id: string,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactNode
}

export const Dropable = ({id, className, style, children}: Props) => {
  const {isOver, setNodeRef} = useDroppable({
    id
  });
  const componentStyle = {
    ...style
  };
  
  
  return (
    <div ref={setNodeRef} className={className} style={componentStyle}>
      {children}
    </div>
  );
};
