import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const loadingStore = create(
  persist(
    immer((set, get) => ({
      loading: false,
      timerId: null, // 타이머 초기화를 위해 ID 저장

      isLoading: () => get().loading,

      setLoading: (loading, delay = 200) => {
        const { timerId } = get();

        // 기존 타이머가 있으면 기존 타이머 취소
        // 같은 요청or 연속된 요청에 로딩 상태가 바뀌는 문제 방지
        if (timerId) clearTimeout(timerId);

        if (loading) {
          // 요청 시작: delay 후에 loading true
          const newTimerId = setTimeout(() => {
            set(state => {
              state.loading = true;
              state.timerId = null; // 타이머 초기화
            });
          }, delay);

          set(state => {
            state.timerId = newTimerId;
          });
        } else {
          // 요청 종료: 바로 false
          set(state => {
            state.loading = false;
            state.timerId = null;
          });
        }
      }
    }))
  )
);
