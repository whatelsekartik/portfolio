import { useState } from "react";
import { useSystem } from "../context/SystemContext";
import { trashItems, type TrashItem } from "../data/portfolioData";
import { useCoarsePointer } from "../utils/useCoarsePointer";

const btn =
  "border-2 border-black bg-[#dfdfdf] px-3 py-1 text-[13px] shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:bg-black hover:text-white";

type Dialog = { kind: "item"; item: TrashItem; restored?: boolean } | { kind: "empty" } | null;

/** The easter egg: abandoned ideas, old designs and funny moments. */
export default function TrashApp() {
  const { trashEmpty, emptyTrash } = useSystem();
  const [dialog, setDialog] = useState<Dialog>(null);
  const coarse = useCoarsePointer();

  return (
    <div className="relative flex min-h-full flex-col gap-3 p-4 text-[14px]">
      {trashEmpty ? (
        <p className="m-auto text-center text-black/60">
          The Trash is empty.
          <br />
          <span className="text-[12px]">(Reload the page and it all comes back. Nothing ever really dies.)</span>
        </p>
      ) : (
        <>
          <p>
            {trashItems.length} items. Nothing important — probably. Double-click one to see what it was.
          </p>
          <ul className="flex flex-col gap-1">
            {trashItems.map((it) => (
              <li key={it.name}>
                <button
                  type="button"
                  onDoubleClick={() => setDialog({ kind: "item", item: it })}
                  onClick={(e) => (coarse || e.detail === 0) && setDialog({ kind: "item", item: it })}
                  className="flex w-full items-center gap-2 border border-black/25 px-2 py-1 text-left hover:bg-black hover:text-white"
                >
                  <span className="min-w-0 flex-1 truncate">{it.name}</span>
                  <span className="text-[12px] opacity-60">{it.kind}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setDialog({ kind: "empty" })} className={`${btn} mt-auto self-start`}>
            Empty Trash…
          </button>
        </>
      )}

      {dialog && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 p-4">
          <div className="w-full max-w-[320px] border-2 border-black bg-[#dfdfdf] p-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            {dialog.kind === "item" ? (
              <>
                <p className="font-chicago mb-1 truncate">{dialog.item.name}</p>
                <p className="mb-1 text-[12px] text-black/60">{dialog.item.kind}</p>
                <p className="mb-3">
                  {dialog.restored
                    ? "Can't put it back: the original folder no longer exists. Some things are meant to stay here."
                    : dialog.item.story}
                </p>
                <div className="flex justify-end gap-2">
                  {!dialog.restored && (
                    <button type="button" className={btn} onClick={() => setDialog({ ...dialog, restored: true })}>
                      Put back
                    </button>
                  )}
                  <button type="button" className={btn} onClick={() => setDialog(null)}>
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-3">
                  Are you sure you want to permanently remove the {trashItems.length} items in the Trash?
                  You can't undo this action.
                </p>
                <div className="flex justify-end gap-2">
                  <button type="button" className={btn} onClick={() => setDialog(null)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`${btn} outline-2 outline-offset-2 outline-black`}
                    onClick={() => {
                      emptyTrash();
                      setDialog(null);
                    }}
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
