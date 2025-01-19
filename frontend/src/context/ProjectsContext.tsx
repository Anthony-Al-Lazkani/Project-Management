import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

interface Children {
  children: ReactNode;
}

interface Project {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface State {
  projects: Project[];
}

type Action =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "CREATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: number }
  | { type: "EDIT_PROJECT"; payload: Project };

const ProjectsReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
      };

    case "CREATE_PROJECT":
      return {
        ...state,
        projects: [action.payload, ...state.projects],
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects : state.projects.filter((project) => project.id !== action.payload),
      };

      case "EDIT_PROJECT":
      return {
        ...state, 
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project
        ),
      };

    default:
      return state;
  }
};

interface ProjectsContextType {
  projects: Project[];
  dispatch: React.Dispatch<Action>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export const ProjectsProvider: React.FC<Children> = ({ children }) => {
  const [state, dispatch] = useReducer(ProjectsReducer, { projects: [] });
  return (
    <ProjectsContext.Provider value={{ projects: state.projects, dispatch }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
