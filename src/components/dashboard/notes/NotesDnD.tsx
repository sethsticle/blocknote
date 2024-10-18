"use client";

import React, { useState, DragEvent, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiPlus, FiTrash } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { AlertDialogDelete } from "@/components/AlertDialog";
import Link from "next/link";

// Define types
type ColumnType = "backlog" | "todo" | "doing" | "done" | "null";

type CardType = {
  id: string;
  name: string;
  description: string;
  subdirectory: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl: string | null;
  userId: string;
  column: ColumnType;
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

type CardProps = CardType & {
  handleDragStart: Function;
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

type PageDndProps = {
  data: CardType[]; // Fetched data from Page.tsx
};


//Default data//////////////////////////////////////////////////////////

//   const DEFAULT_CARDS: CardType[] = [
//     // BACKLOG
//     { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
//     { title: "SOX compliance checklist", id: "2", column: "backlog" },
//     { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
//     { title: "Document Notifications service", id: "4", column: "backlog" },
//     // TODO
//     {
//       title: "Research DB options for new microservice",
//       id: "5",
//       column: "todo",
//     },
//     { title: "Postmortem for outage", id: "6", column: "todo" },
//     { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
  
//     // DOING
//     {
//       title: "Refactor context providers to use Zustand",
//       id: "8",
//       column: "doing",
//     },
//     { title: "Add logging to daily CRON", id: "9", column: "doing" },
//     // DONE
//     {
//       title: "Set up DD dashboards for Lambda listener",
//       id: "10",
//       column: "done",
//     },
//   ];


//Methods//////////////////////////////////////////////////////////

// const Board = ({ data }: PageDndProps) => {
//     const [cards, setCards] = useState(data);
  
//     return (
//       <div className="flex h-full w-full gap-3 overflow-scroll p-12">
//         <Column
//           title="Backlog"
//           column="backlog"
//           headingColor="text-neutral-500"
//           cards={cards}
//           setCards={setCards}
//         />
//         <Column
//           title="TODO"
//           column="todo"
//           headingColor="text-yellow-200"
//           cards={cards}
//           setCards={setCards}
//         />
//         <Column
//           title="In progress"
//           column="doing"
//           headingColor="text-blue-200"
//           cards={cards}
//           setCards={setCards}
//         />
//         <Column
//           title="Complete"
//           column="done"
//           headingColor="text-emerald-200"
//           cards={cards}
//           setCards={setCards}
//         />
//         <BurnBarrel setCards={setCards} />
//       </div>
//     );
//   };

const Column = ({ title, headingColor, cards, column, setCards }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((c) => c.id !== cardId);
      const moveToBack = before === "-1";
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
      >
        {filteredCards.map((c) => (
          <CustomCard key={c.id} {...c} handleDragStart={handleDragStart} />
        ))}
        <DropIndicator beforeId={null} column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};

const CustomCard = ({ id, name, description, imageUrl, column, handleDragStart }: CardProps) => {
  return (
    <>
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { id, name, description, column })}
        className="cursor-grab rounded-lg border border-neutral-700 bg-neutral-800 p-4 active:cursor-grabbing"
      >
        <Card>
          <Image
            src={imageUrl ?? '/default-image.png'}
            alt={name}
            className="rounded-t-lg object-cover w-full h-[200px]"
            width={400}
            height={200}
          />
          <CardHeader>
            <CardTitle className="truncate">{name}</CardTitle>
            <CardDescription className="line-clamp-3">{description}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between gap-2">
            <AlertDialogDelete noteId={id} />
            <Button asChild className='w-full'>
              <Link href={`/dashboard/pages/${id}`}>Open</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
};
  const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
    return (
      <div
        data-before={beforeId || "-1"}
        data-column={column}
        className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
      />
    );
  };

  const BurnBarrel = ({
    setCards,
  }: {
    setCards: Dispatch<SetStateAction<CardType[]>>;
  }) => {
    const [active, setActive] = useState(false);
  
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setActive(true);
    };
  
    const handleDragLeave = () => {
      setActive(false);
    };
  
    const handleDragEnd = (e: DragEvent) => {
      const cardId = e.dataTransfer.getData("cardId");
  
      setCards((pv) => pv.filter((c) => c.id !== cardId));
  
      setActive(false);
    };
  
    return (
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
          active
            ? "border-red-800 bg-red-800/20 text-red-500"
            : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
      >
        {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
      </div>
    );
  };

// const AddCard = ({ column, setCards }: AddCardProps) => {
//     const [text, setText] = useState("");
//     const [adding, setAdding] = useState(false);
  
//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//       e.preventDefault();
  
//       if (!text.trim().length) return;
  
//       const newCard = {
//         column,
//         title: text.trim(),
//         id: Math.random().toString(),
//       };
  
//       setCards((pv) => [...pv, newCard]);
  
//       setAdding(false);
//     };
  
//     return (
//       <>
//         {adding ? (
//           <motion.form layout onSubmit={handleSubmit}>
//             <textarea
//               onChange={(e) => setText(e.target.value)}
//               autoFocus
//               placeholder="Add new task..."
//               className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
//             />
//             <div className="mt-1.5 flex items-center justify-end gap-1.5">
//               <button
//                 onClick={() => setAdding(false)}
//                 className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//               >
//                 Close
//               </button>
//               <button
//                 type="submit"
//                 className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
//               >
//                 <span>Add</span>
//                 <FiPlus />
//               </button>
//             </div>
//           </motion.form>
//         ) : (
//           <motion.button
//             layout
//             onClick={() => setAdding(true)}
//             className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//           >
//             <span>Add card</span>
//             <FiPlus />
//           </motion.button>
//         )}
//       </>
//     );
//   };






const NotesDnD = ({ data }: PageDndProps) => {
    const [cards, setCards] = useState(data);
  
    return (
      <div className="flex h-full w-full gap-3 overflow-scroll p-12">
          <Column
            title="Fresh"
            column="null"
            headingColor="text-emerald-200"
            cards={cards}
            setCards={setCards}
          />
        <Column
          title="Backlog"
          column="backlog"
          headingColor="text-neutral-500"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="TODO"
          column="todo"
          headingColor="text-yellow-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="In progress"
          column="doing"
          headingColor="text-blue-200"
          cards={cards}
          setCards={setCards}
        />
        <Column
          title="Complete"
          column="done"
          headingColor="text-emerald-200"
          cards={cards}
          setCards={setCards}
        />
        <BurnBarrel setCards={setCards} />
      </div>
    );
  };
  
  export default NotesDnD;