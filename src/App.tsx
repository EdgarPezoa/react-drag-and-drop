import React, { useState } from "react";
import {
	DragDropContext,
	Draggable,
	DraggingStyle,
	Droppable,
	NotDraggingStyle,
} from "react-beautiful-dnd";

const getItems = (count: number): { id: string; content: string }[] =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `item-${k}`,
		content: `item ${k}`,
	}));

const reorder = (
	list: any,
	startIndex: number,
	endIndex: number,
): { id: string; content: string }[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result as { id: string; content: string }[];
};

const grid = 8;

const getItemStyle = (
	isDragging: boolean,
	draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
): React.CSSProperties | undefined => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? "lightred" : "grey",

	// styles we need to apply on draggables
	...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
	background: isDraggingOver ? "lightblue" : "lightgrey",
	padding: grid,
	width: 250,
});

const App: React.FC = () => {
	const [items, setItems] = useState(getItems(10));
	const onDragEnd = (result: any) => {
		if (!result.destination) {
			return;
		}

		const newItems: { id: string; content: string }[] = reorder(
			items,
			result.source.index,
			result.destination.index,
		);

		setItems(newItems);
	};
	return (
		<>
			<h1 className="title">React Drag And Drop</h1>
			<div className="container">
				<p>
					Drag from the '<b>x {"->"}</b>'
				</p>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided, snapshot) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								style={getListStyle(snapshot.isDraggingOver)}
							>
								{items.map((item, index) => (
									<Draggable
										key={item.id}
										draggableId={item.id}
										index={index}
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												style={getItemStyle(
													snapshot.isDragging,
													provided.draggableProps
														.style,
												)}
											>
												<span
													style={{
														color: snapshot.isDragging
															? "red"
															: "black",
													}}
													{...provided.dragHandleProps}
												>
													{"x -> "}
												</span>
												{item.content}
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
		</>
	);
};

export default App;
