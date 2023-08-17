import { TypeProjectFilter } from '../interfaces/Project.interface';
import React, { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';

type ProjectFilterAction =
  | { type: 'CHANGE_CATEGORY'; payload: string }
  | { type: 'CHANGE_RECRUITING_STATE'; payload: string }
  | { type: 'CHANGE_SEARCH_VALUE'; payload: string };

interface ProjectFilterProviderProps {
  children: ReactNode;
}

const initialState: TypeProjectFilter = { category: 'all', recruitment: 'all', searchValue: '' };
const ProjectFilterStateContext = createContext<TypeProjectFilter>(initialState);

type ProjectFilterDispatch = Dispatch<ProjectFilterAction>;
const ProjectFilterDispatchContext = createContext<ProjectFilterDispatch | undefined>(undefined);

const projectFilterReducer = (
  projectFilter: TypeProjectFilter,
  action: ProjectFilterAction
): TypeProjectFilter => {
  switch (action.type) {
    case 'CHANGE_CATEGORY':
      return { ...projectFilter, category: action.payload, searchValue: '' };

    case 'CHANGE_RECRUITING_STATE':
      return { ...projectFilter, recruitment: action.payload };

    case 'CHANGE_SEARCH_VALUE':
      return { ...projectFilter, searchValue: action.payload, category: 'all' };
    default:
      return projectFilter;
  }
};

export function ProjectFilterProvider({ children }: ProjectFilterProviderProps) {
  const [projectFilterState, dispatch] = useReducer(projectFilterReducer, initialState);

  return (
    <ProjectFilterDispatchContext.Provider value={dispatch}>
      <ProjectFilterStateContext.Provider value={projectFilterState}>
        {children}
      </ProjectFilterStateContext.Provider>
    </ProjectFilterDispatchContext.Provider>
  );
}

export function useProjectFilterState() {
  const state = useContext(ProjectFilterStateContext);
  if (!state) throw new Error('ProjectFilterStateProvider not found');
  return state;
}

export function useProjectFilterDispatch() {
  const dispatch = useContext(ProjectFilterDispatchContext);
  if (!dispatch) throw new Error('ProjectFilterDispatchProvider not found');
  return dispatch;
}
