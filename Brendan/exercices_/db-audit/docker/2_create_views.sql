CREATE OR REPLACE VIEW v_studentsGrades AS
SELECT
    s.stuName AS lastName,
    s.stuFirstName AS firstName,
    c.courName AS course,
    e.evaDate AS date,
    e.evaGrade AS grade
FROM
    t_student s
    JOIN t_evaluation e ON e.idStudent = s.idStudent
    JOIN t_course c ON c.idCourse = e.idCourse;