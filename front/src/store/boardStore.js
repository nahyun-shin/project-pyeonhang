import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const boardStore = create(
    persist(
        immer((set, get) => ({
            refresh: false,

            toggleRefresh: () => {
                set(state => !state.refresh)
            }
        }))
    )
)