import React from "react";
import { SortableElement, SortableContainer } from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const SortableItem = SortableElement(
  ({ value, i }: { value: string; i: number }) => {
    return (
      // <li>{value}</li>
      <div className="item">
        <div className="order">{i + 1}</div>
        <div className="description">{value}</div>
        <div className="action">
          <div className="remove" onClick={() => console.log("remove")}>
            X
          </div>
        </div>
      </div>
    );
  }
);

const SortableList = SortableContainer(({ items }: { items: any }) => {
  return (
    <div className="list">
      {items?.map((item: any, i: number) => {
        return (
          <SortableItem key={`item-${item}`} index={i} value={item} i={i} />
        );
      })}
    </div>
  );
});

export default SortableList;
