"use client";

import { readAll } from "../actions.";

export const ReadAllButton = () => {
  const getAll = async () => {
    const all = await readAll();
    console.log(all);
  };
  return <button onClick={getAll}>Read All</button>;
};
