import { Draggable } from 'react-beautiful-dnd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styles from '../../styles/ScrollList.module.css';
import { IScrollListProps, colors } from '../ScrollList';
import { ScrollListContainer } from '../ScrollList';

interface IDraggableScrollList extends IScrollListProps {
  savedScrollIds: string[];
  updateSavedScrollIds: (ids: string[]) => void;
}

const DraggableScrollList = ({
  type,
  items,
  savedScrollNames,
  handleClick,
  savedScrollsMessage,
  link,
  savedScrollIds,
  updateSavedScrollIds,
}: IDraggableScrollList): React.ReactElement => {
  const handleOnDragEnd = (e): void => {
    const { destination, source } = e;
    const ids = [...savedScrollIds];
    const [reorderedItem] = ids.splice(source.index, 1);
    ids.splice(destination.index, 0, reorderedItem);
    updateSavedScrollIds(ids);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="saved">
        {(provided) => (
          <ul
            id={type}
            key={type}
            className={styles.list}
            style={{ borderColor: colors[type] }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <ScrollListContainer
              type={type}
              savedScrollsMessage={savedScrollsMessage}
              link={link}
            >
              {items.map(({ name, lowPrice, midPrice }, i) => (
                <Draggable key={name} draggableId={name} index={i}>
                  {(providedDrag) => (
                    <li
                      className={
                        savedScrollNames && savedScrollNames.includes(name)
                          ? styles.savedCard
                          : styles.card
                      }
                      onClick={handleClick}
                      ref={providedDrag.innerRef}
                      {...providedDrag.draggableProps}
                      {...providedDrag.dragHandleProps}
                    >
                      <h3>{name}</h3>
                      <span>Low: {lowPrice}</span>
                      <span>Mid: {midPrice}</span>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ScrollListContainer>
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggableScrollList;
