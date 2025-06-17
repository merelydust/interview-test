import { useState } from "react";
import {
  SchoolActionKind,
  useSchool,
  useSchoolDispatch,
} from "./school-context";
import infinitasLogo from "/infinitas-logo.svg";
import "./App.css";

function App() {
  const school = useSchool();
  const schoolDispatch = useSchoolDispatch();

  const [studentEditingId, setUserEditingId] = useState<string | null>(null);
  const [updatedStudentName, setUpdatedStudentName] = useState<string>("");

  const [teacherEditingId, setTeacherEditingId] = useState<string | null>(null);
  const [newAssignedStudentId, setNewAssignedStudentId] = useState<
    string | null
  >(null);


  const [isTeacherError, setIsTeacherError] = useState<boolean>(false);
  const [isStudentError, setIsStudentError] = useState<boolean>(false);
  const [isAssignmentError, setIsAssignmentError] = useState<boolean>(false);

  const [assignmentName, setAssignmentName] = useState<string>("");
  const [assignmentTeacher, setAssignmentTeacher] = useState<string>("");
  const [assignmentStudent, setAssignmentStudent] = useState<string>("");

  const [reportDate, setReportDate] = useState<string>("");

  const handleTeacherSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const teacherName = target.teacher.value;

    // non-empty check
    if (teacherName.trim().length < 1) {
      setIsTeacherError(true);
      return;
    }

    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_TEACHER,
      payload: { name: teacherName, id, students: [] },
    });

    target.reset();
  };

  const handleStudentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const studentName = target.student.value;

    // non-empty check
    if (studentName.trim().length < 1) {
      setIsStudentError(true);
      return;
    }

    const id = crypto.randomUUID();
    schoolDispatch?.({
      type: SchoolActionKind.ADD_STUDENT,
      payload: { name: studentName, id },
    });

    target.reset();
  };

  const handleUpdateStudent = () => {
    if (studentEditingId) {
      schoolDispatch?.({
        type: SchoolActionKind.UPDATE_STUDENT,
        payload: { name: updatedStudentName, id: studentEditingId },
      });
    }

    setUserEditingId(null);
    setUpdatedStudentName("");
  };

  const handleAssignStudent = () => {
    if (teacherEditingId && newAssignedStudentId) {
      schoolDispatch?.({
        type: SchoolActionKind.ASSIGN_STUDENT_TO_TEACHER,
        payload: {
          teacherId: teacherEditingId,
          studentId: newAssignedStudentId,
        },
      });
    }

    setTeacherEditingId(null);
    setNewAssignedStudentId(null);
  };

  const handleAssignmentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // non-empty check
    if (assignmentName.trim() === ""
     || assignmentTeacher.trim() === ""
     || assignmentStudent.trim() === "") {
      setIsAssignmentError(true);
      return;
    }

    schoolDispatch?.({
      type: SchoolActionKind.ADD_ASSIGNMENT,
      payload: {
        id: crypto.randomUUID(),
        name: assignmentName,
        teacherId: assignmentTeacher,
        studentId: assignmentStudent,
        created_at: new Date().toISOString(),
      }
    })
  }

  const handleGradeAssignment = (id: string, grade: "Pass" | "Fail") => {
    schoolDispatch?.({
      type: SchoolActionKind.GRADE_ASSIGNMENT,
      payload: {
        id,
        grade,
      }
    })
  }


  return (
    <div className="App">
      <div>
        <a href="/" target="_blank">
          <img src={infinitasLogo} className="logo" alt="Infinitas logo" />
        </a>
      </div>
      <h1>IL Interview</h1>
      <div className="section">
        <h2>Teacher</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.teachers.map((teacher) => {
              return (
                <tr key={teacher.id}>
                  <td>{teacher.id}</td>
                  <td>{teacher.name}</td>
                  <td>
                    <ul>
                      {teacher.students.map((s) => (
                        <li>
                          {school?.students.map((s1) =>
                            s === s1.id ? s1.name : ""
                          )}
                        </li>
                      ))}
                    </ul>
                    {teacher.id === teacherEditingId ? (
                      <>
                        <select
                          value={newAssignedStudentId || ""}
                          onChange={(e) =>
                            setNewAssignedStudentId(e.target.value)
                          }
                        >
                          <option value={""}></option>
                          {school?.students.map((student) => (
                            <option value={student.id}>{student.name}</option>
                          ))}
                        </select>
                        <button onClick={handleAssignStudent}>Assign</button>
                      </>
                    ) : (
                      <button onClick={() => setTeacherEditingId(teacher.id)}>
                        Assign student
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleTeacherSubmit}>
          <label htmlFor="teacher">Teacher</label>
          <input type="text" id="teacher" name="teacher" onChange={() => setIsTeacherError(false)} />
          <button type="submit">Add Teacher</button>
        </form>
        {isTeacherError && <div className="error">Invalid Input</div>}
      </div>
      <div className="section">
        <h2>Students</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {school?.students.map((student) => {
              return (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    {student.id === studentEditingId ? (
                      <>
                        <input
                          type="text"
                          value={updatedStudentName}
                          onChange={(e) =>
                            setUpdatedStudentName(e.target.value)
                          }
                        ></input>
                        <button onClick={handleUpdateStudent}>Done</button>
                      </>
                    ) : (
                      <button onClick={() => setUserEditingId(student.id)}>
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr></hr>
        <form onSubmit={handleStudentSubmit}>
          <label htmlFor="student" >Student</label>
          <input type="text" id="student" name="student" onChange={() => setIsStudentError(false)}/>
          <button type="submit">Add Student</button>
        </form>
        {isStudentError && <div className="error">Invalid Input</div>}
      </div>
      <div className="section">
        <h2>Assignment</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>TeacherId</th>
              <th>StudentId</th>
              <th>Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              school?.assignments.map(a => (
                <tr>
                  <td>{a.name}</td>
                  <td>{a.teacherId}</td>
                  <td>{a.studentId}</td>
                  <td>{a.grade || ""}</td>
                  <td>
                    {
                      !a.grade &&
                        <>
                          <button onClick={() => handleGradeAssignment(a.id, "Pass")}>Pass</button>
                          <button onClick={() => handleGradeAssignment(a.id, "Fail")}>Fail</button>
                        </>
                    }
                  </td>
                </tr>)
              )
            }
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAssignmentSubmit} style={{marginTop: 80}}>
        <input
          type="text"
          placeholder="Assignment Name"
          value={assignmentName}
          onChange={e => setAssignmentName(e.target.value)}
        />
        <select value={assignmentTeacher} onChange={e => setAssignmentTeacher(e.target.value)}>
          <option>Select Teacher</option>
          {
            school?.teachers.map(t => 
              <option value={t.id}>{t.name}</option>
            )
          }
        </select>
          <select value={assignmentStudent} onChange={e => setAssignmentStudent(e.target.value)}>
          <option value="">Select Students</option>
          {
            school?.students.map(s => 
              <option value={s.id}>{s.name}</option>
            )
          }
        </select>
        <button type="submit">Submit</button>
      </form>
      <hr style={{margin: 40}} />
      <div className="section">
        <h2>Report</h2>
        <label htmlFor="report-date">Date </label>
        <input
          id="report-date"
          placeholder="YYYY-MM-DD"
          value={reportDate}
          onChange={e => setReportDate(e.target.value)}
        />
        {
          reportDate.trim().length > 0 &&
            <div style={{marginTop: 20}}>
              <span>{school?.assignments.filter(a => a.grade === "Pass" && a.created_at?.startsWith(reportDate)).length}</span>
              <span> student(s) passed on this day.</span>
            </div>
        }
      </div>
    </div>
  );
}

export default App;
