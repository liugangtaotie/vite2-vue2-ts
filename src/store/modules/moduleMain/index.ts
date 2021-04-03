import { MutationTree, ActionTree, Module } from "vuex";
import { moduleMainState } from "./types";
import { RootState } from "../types";

const state: moduleMainState = {
  loading: false,
};

// 传入的泛型可以通过查看源代码得知。
const mutations: MutationTree<moduleMainState> = {
  SHOW_LOADING(state: any) {
    state.loading = true;
  },
  HIDE_LOADING(state: any) {
    state.loading = false;
  },
};

const actions: ActionTree<moduleMainState, RootState> = {};

export const moduleMain: Module<moduleMainState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
};
