import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import "./Projects.css";
import { IoMdClose } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useProjects } from "../../context/ProjectsContext";

interface ProjectRequest {
  project_name: string;
  description: string;
  start_date: string;
  end_date: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  owner_id: number;
  start_date: string;
  end_date: string;
}

export const Projects: React.FC = () => {
  const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [project_id, setProjectId] = useState<number>(0);
  const { projects, dispatch } = useProjects();

  useEffect(() => {
    const GETProjects = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://127.0.0.1:8000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response) {
          // setProjects(response.data);
          dispatch({ type: "SET_PROJECTS", payload: response.data });
        }
      } catch (error) {
        console.log(error);
      }
    };

    GETProjects();
  }, []);

  function handleForm() {
    if (isEditing == true && isFormVisible == true) {
      setIsEditing(false);
      setProjectRequest({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
      });
    }
    setIsFormVisible(!isFormVisible);
  }

  const { getToken } = useAuth();

  async function handleCreateOrEditProject(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (
      !projectRequest.project_name ||
      !projectRequest.description ||
      !projectRequest.start_date ||
      !projectRequest.end_date
    ) {
      toast.error("Please fill all the fields!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setLoading(false);
      return;
    }

    try {
      const token = getToken();

      if (isEditing) {
        const response = await axios.put(
          `http://127.0.0.1:8000/projects/${project_id}`,
          {
            project_name: projectRequest.project_name,
            description: projectRequest.description,
            start_date: projectRequest.start_date,
            end_date: projectRequest.end_date,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response) {
          dispatch({ type: "EDIT_PROJECT", payload: response.data.project });
          setProjectRequest({
            project_name: "",
            description: "",
            start_date: "",
            end_date: "",
          });
          handleForm();
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            pauseOnFocusLoss: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setIsEditing(false);
          return;
        }
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/projects",
        {
          project_name: projectRequest.project_name,
          description: projectRequest.description,
          start_date: projectRequest.start_date,
          end_date: projectRequest.end_date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setProjectRequest({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
      });
      dispatch({ type: "CREATE_PROJECT", payload: response.data.project });
      handleForm();
    } catch (error: any) {
      console.log(error);
      // toast.error(error.response.data.detail || "Something went wrong!", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   pauseOnFocusLoss: false,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      // });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  // Edit the Project
  const handleEditProject = (project: Project) => {
    setIsEditing(true);
    setProjectId(project.id);
    setProjectRequest({
      project_name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
    });

    setIsFormVisible(true);
  };

  const handleDeleteProject = async (project_id: number) => {
    const token = getToken();
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/projects/${project_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        dispatch({ type: "DELETE_PROJECT", payload: project_id });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="projects-title">Projects</h1>
      {isFormVisible && (
        <form onSubmit={handleCreateOrEditProject} className="add-project-form">
          <h3>{isEditing ? "Edit Project" : "Create Project"}</h3>
          <IoMdClose className="add-project-close-icon" onClick={handleForm} />
          <input
            type="text"
            placeholder="Project Name"
            onChange={(e) =>
              setProjectRequest({
                ...projectRequest,
                project_name: e.target.value,
              })
            }
            value={projectRequest.project_name}
            maxLength={35}
          />
          <textarea
            placeholder="Project Description"
            onChange={(e) =>
              setProjectRequest({
                ...projectRequest,
                description: e.target.value,
              })
            }
            value={projectRequest.description}
            maxLength={100}
          />
          <input
            type="date"
            placeholder="start date"
            onChange={(e) =>
              setProjectRequest({
                ...projectRequest,
                start_date: e.target.value,
              })
            }
            value={projectRequest.start_date}
          />
          <input
            type="date"
            placeholder="end date"
            onChange={(e) =>
              setProjectRequest({ ...projectRequest, end_date: e.target.value })
            }
            value={projectRequest.end_date}
          />

          <button type="submit" disabled={loading}>
            {loading ? (
              <ClipLoader color="#3498db" loading={loading} size={20} />
            ) : isEditing ? (
              "Edit Project"
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      )}

      {loading ? (
        <ClipLoader />
      ) : (
        <div className="projects-page-container">
          <div className="projects-container">
            <div className="add-project-button">
              <button onClick={handleForm}>Add Project</button>
            </div>
            <div className="projects-table">
              <table className="projects-table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects &&
                    projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{project.description}</td>
                        <td>{project.status}</td>
                        <td>{project.owner_id}</td>
                        <td>{project.start_date}</td>
                        <td>{project.end_date}</td>
                        <td>
                          <div className="icons">
                            <div
                              className="edit-icon"
                              onClick={() => handleEditProject(project)}
                            >
                              <MdEdit />
                            </div>
                            <div
                              className="delete-icon"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <FaTrash />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};
