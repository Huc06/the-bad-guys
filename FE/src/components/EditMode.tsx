import { BACKGROUNDS } from "../constants/gameData";
import type { InventoryItem, PlacedDecor, Uuid } from "../types/game";
import type { MouseEvent } from "react";

interface EditModeProps {
  editBackgroundId: string;
  mainBackgroundId: string;
  inventory: InventoryItem[];
  placedDecor: PlacedDecor[];
  onSetEditBackground: (id: string) => void;
  onSetMainBackground: (id: string) => void;
  onDragStart: (
    e: MouseEvent<HTMLElement>,
    uuid: Uuid,
    isFromInventory: boolean,
  ) => void;
  onDeleteDecor: (uuid: Uuid) => void;
  clickSound: () => void;
}

const EDIT_BACKGROUND_OPTIONS = BACKGROUNDS;

export const EditMode: React.FC<EditModeProps> = ({
  editBackgroundId,
  mainBackgroundId,
  inventory,
  placedDecor,
  onSetEditBackground,
  onSetMainBackground,
  onDragStart,
  onDeleteDecor,
  clickSound,
}) => {
  return (
    <div className="edit-mode-ui">
      <div
        style={{
          color: "gold",
          fontSize: "12px",
          marginBottom: "15px",
          textAlign: "center",
          textShadow: "2px 2px 0 #000",
        }}
      >
        🎨 EDIT MODE • DRAG TO PLACE • DOUBLE CLICK TO REMOVE
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "15px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              color: "#00e676",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            EDIT BACKGROUND
          </div>
          <div className="edit-mode-bg-picker">
            {EDIT_BACKGROUND_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                className={`bg-option ${bg.id === editBackgroundId ? "active" : ""}`}
                onClick={() => {
                  clickSound();
                  onSetEditBackground(bg.id);
                }}
              >
                {bg.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: "10px",
              color: "#00e676",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            MAIN BACKGROUND
          </div>
          <div className="edit-mode-bg-picker">
            {EDIT_BACKGROUND_OPTIONS.map((bg) => (
              <button
                key={bg.id}
                className={`bg-option ${bg.id === mainBackgroundId ? "active" : ""}`}
                onClick={() => {
                  clickSound();
                  onSetMainBackground(bg.id);
                }}
              >
                {bg.name}
              </button>
            ))}
            <button
              className="bg-option"
              onClick={() => {
                clickSound();
                onSetMainBackground(editBackgroundId);
              }}
            >
              USE EDIT
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: "10px",
          color: "#00e676",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        DECORATIONS INVENTORY
      </div>
      <div className="decor-inventory-bar">
        {inventory.filter((i) => i.type === "decor").length === 0 ? (
          <span
            style={{
              color: "#aaa",
              fontSize: "10px",
              textAlign: "center",
              width: "100%",
            }}
          >
            No decorations. Buy some in Shop!
          </span>
        ) : (
          inventory
            .filter(
              (i): i is Extract<InventoryItem, { type: "decor" }> =>
                i.type === "decor",
            )
            .map((d) => {
              const isPlaced = placedDecor.some((p) => p.uuid === d.uuid);
              return (
                <div
                  key={String(d.uuid)}
                  className={`decor-slot-item ${isPlaced ? "is-placed" : ""}`}
                  onMouseDown={(e) => {
                    if (isPlaced) return;
                    onDragStart(e, d.uuid, true);
                  }}
                >
                  <img
                    src={d.img}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                    alt="i"
                  />
                  {isPlaced && <div className="decor-slot-badge">ON</div>}
                  <button
                    className="decor-slot-trash"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteDecor(d.uuid);
                    }}
                  >
                    🗑
                  </button>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
