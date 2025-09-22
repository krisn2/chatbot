import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: null, // { email, name }
});

export const projectsState = atom({
  key: 'projectsState',
  default: [],
});

export const agentsState = atom({
  key: 'agentsState',
  default: {}, // { projectId: [agents] }
});

export const activeChatState = atom({
  key: 'activeChatState',
  default: null, // { agentId, messages: [] }
});

export const chatLoadingState = atom({
  key: 'chatLoadingState',
  default: false,
});

export const viewState = atom({
  key: 'viewState',
  default: 'login', // 'login', 'register', 'dashboard', 'chat'
});
