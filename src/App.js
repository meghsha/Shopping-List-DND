import logo from "./logo.svg";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useState } from "react";

const DATA = [
  {
    id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
    name: "Walmart",
    items: [
      { id: "26fd50b3-3841-496e-8b32-73636f6f4197", name: "3% Milk" },
      { id: "b0ee9d50-d0a6-46f8-96e3-7f3f0f9a2525", name: "Butter" },
    ],
    tint: 1,
  },
  {
    id: "487f68b4-1746-438c-920e-d67b7df46247",
    name: "Indigo",
    items: [
      {
        id: "95ee6a5d-f927-4579-8c15-2b4eb86210ae",
        name: "Designing Data Intensive Applications",
      },
      { id: "5bee94eb-6bde-4411-b438-1c37fa6af364", name: "Atomic Habits" },
    ],
    tint: 2,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
    name: "Lowes",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15eacc", name: "Workbench" },
      { id: "d3edf796-6449-4931-a777-ff66965a025b", name: "Hammer" },
    ],
    tint: 3,
  },
  {
    id: "25daffdc-aae0-4d73-bd31-43f73101e7",
    name: "Amul",
    items: [
      { id: "960cbbcf-89a0-4d79-aa8e-56abbc15ea", name: "Cheese" },
      { id: "d3edf796-6449-4931-a777-ff66965a02", name: "Curd" },
      { id: "d3edf796-6449-4931-a777-ff66965a0", name: "Ice Cream" },
    ],
    tint: 4,
  },
];

const StoreList = ({ store }) => {
  return (
    <div
      className="store-container"
      style={{ border: "1px solid green", marginTop: "5px" }}
    >
      <div className="store-name">{store.name}</div>
      <Droppable droppableId={store.id} type="item">
        {(provided) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {store.items.map((item, index) => {
                return (
                  <Draggable draggableId={item.id} index={index} key={item.id}>
                    {(provided) => {
                      return (
                        <div
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="item-container"
                        >
                          {item.name}
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};

function App() {
  const [stores, setstores] = useState(DATA);

  const handleDragAndDrop = (results) => {
    console.log(results);

    const { destination, source, draggableId, type } = results;

    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type == "group") {
      const newStores = [...stores];
      const [removed] = newStores.splice(source.index, 1);
      newStores.splice(destination.index, 0, removed);
      return setstores(newStores);
    }

    const newStores = [...stores];

    const sourceItemIndex = source.index;
    const destinationItemIndex = destination.index;

    const sourceStoreIndex = stores.findIndex((store) => {
      return store.id === source.droppableId;
    });
    const destinationStoreIndex = stores.findIndex((store) => {
      return store.id === destination.droppableId;
    });

    const sourceItems = stores[sourceStoreIndex].items;
    const destinationItems =
      source.droppableId === destination.droppableId
        ? sourceItems
        : stores[destinationStoreIndex].items;

    const [removed] = sourceItems.splice(sourceItemIndex, 1);
    destinationItems.splice(destinationItemIndex, 0, removed);

    newStores[sourceStoreIndex] = {
      ...stores[sourceStoreIndex],
      items: sourceItems,
    };
    newStores[destinationStoreIndex] = {
      ...stores[destinationStoreIndex],
      items: destinationItems,
    };

    setstores(newStores);
  };

  return (
    <div className="layout__wrapper">
      <div className="card">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <div className="header">
            <h2>Shopping List</h2>
          </div>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {stores.map((store, index) => {
                    return (
                      <Draggable
                        draggableId={store.id}
                        index={index}
                        key={store.id}
                      >
                        {(provided) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              {/* <div className="store-container">
                                {store.name}
                              </div> */}
                              <StoreList store={store} />
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
