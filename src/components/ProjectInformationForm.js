import React from 'react';

const ProjectInformationForm = ({ projectInfo, setProjectInfo }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo({
      ...projectInfo,
      [name]: value,
    });
  };

  return (
    <div className="project-info-form">
      <label>
        Project Title:
        <input
          type="text"
          name="title"
          value={projectInfo.title}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Designer's Name:
        <input
          type="text"
          name="designer"
          value={projectInfo.designer}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Department:
        <input
          type="text"
          name="department"
          value={projectInfo.department}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Date:
        <input
          type="text"
          name="date"
          value={projectInfo.date}
          readOnly
        />
      </label>
    </div>
  );
};

export default ProjectInformationForm;
