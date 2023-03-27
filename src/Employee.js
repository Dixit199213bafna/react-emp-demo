import React, { useState, useEffect } from 'react';
import { getEmployee } from './getEmployeeService';

// # You are provided with an incomplete <Employee /> component.
// # You are not allowed to add any additional HTML elements.
// # You are not allowed to use refs.
// ## Requirements
/* The employee has to work for 30 days in the month. The employee is paid at the end of the month based on the number of days worked. In a month, he can only avail max 5 days off work. If the employee does not avail any days off work, he is paid 10% bonus on the base salary. e.g If the employee has taken 5 days off, then the employee would be paid only for 25 days. If the employee has not availed any days off work, then he would be paid 10% bonus .

At the end, the total salary paid for all employees need to be calculated and displayed. */

// Considerations
// # 1) Using getEmployee function you can load the employee list.
// # 2) Manage Loading State.
// # 3) Leave (offwork) increment button disabled, if leave is more then 5.
// # 4) Leave (offwork) decrement button disabled, if leave is less then 0.
// # 5) If leave (off work) count is 0 then apply bonus as 10% on Basic Salary.
// Video Demo Link :  https://www.loom.com/share/793d5b9ff8584ba58770bb42798e36d9

const EmployeeData = ({
  id,
  name,
  basicSalary,
  bonus,
  deductionAmount,
  leaveDays,
  totalSalary,
  incrementLeaves,
  decrementLeaves,
}) => {
  return (
    <tr key={id}>
      <td>{name}</td>
      <td>₹ {basicSalary}</td>
      <td>₹ {bonus}</td>
      <td>
        <button onClick={() => decrementLeaves(id)} disabled={leaveDays === 0}>
          -
        </button>
        {leaveDays}
        <button onClick={() => incrementLeaves(id)} disabled={leaveDays === 5}>
          +
        </button>
      </td>
      <td>{deductionAmount}</td>

      <td>{totalSalary}</td>
    </tr>
  );
};

const Employee = () => {
  const [employees, setEmployess] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const getEmployeeData = async () => {
      setLoading(true);
      const response = await getEmployee();
      const newEmployeeData = response.map((emp) => {
        return {
          ...emp,
          bonus: emp.basicSalary * 0.1,
          deductionAmount: 0,
          leaveDays: 0,
          totalSalary: emp.basicSalary + emp.basicSalary * 0.1,
        };
      });
      setLoading(false);
      setEmployess(newEmployeeData);
    };
    getEmployeeData();
  }, []);
  const incrementLeaves = (id) => {
    const newData = employees.map((emp) => {
      if (emp.id === id && emp.leaveDays <= 5) {
        const leaveDays = emp.leaveDays + 1;
        const deductionAmount = emp.deductionAmount + emp.basicSalary / 30;
        const deductBonus = emp.leaveDays ? 0 : emp.bonus;
        const totalSalary =
          emp.totalSalary - emp.basicSalary / 30 - deductBonus;
        return {
          ...emp,
          leaveDays,
          deductionAmount,
          totalSalary,
        };
      }
      return emp;
    });
    setEmployess(newData);
  };
  const decrementLeaves = (id) => {
    const newData = employees.map((emp) => {
      if (emp.id === id && emp.leaveDays > 0) {
        const leaveDays = emp.leaveDays - 1;
        const deductionAmount = leaveDays
          ? emp.deductionAmount - emp.basicSalary / 30
          : 0;
        let totalSalary = emp.totalSalary + emp.basicSalary / 30;
        if (leaveDays === 0) {
          totalSalary += emp.bonus;
        }
        return {
          ...emp,
          leaveDays,
          deductionAmount,
          totalSalary,
        };
      } else if (emp.leaveDays === 0) {
        const totalSalary = emp.basicSalary + emp.bonus;
        return {
          ...emp,
          totalSalary,
        };
      }
      return emp;
    });
    setEmployess(newData);
  };
  const totalAllSalary = employees.reduce(
    (acc, emp) => acc + emp.totalSalary,
    0
  );
  return (
    <div>
      <h2 className="title">Employee Salary Calculator</h2>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <>
          <table border="1" className="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Basic Salary</th>
                <th>Bonus</th>
                <th>Leave Days</th>
                <th>Deduction Amount</th>
                <th>Total Salary</th>
              </tr>
            </thead>
            <tbody align="center">
              {employees.map(
                ({
                  id,
                  name,
                  basicSalary,
                  bonus,
                  deductionAmount,
                  leaveDays,
                  totalSalary,
                }) => (
                  <EmployeeData
                    id={id}
                    name={name}
                    basicSalary={basicSalary}
                    bonus={bonus}
                    deductionAmount={deductionAmount}
                    leaveDays={leaveDays}
                    totalSalary={totalSalary}
                    decrementLeaves={decrementLeaves}
                    incrementLeaves={incrementLeaves}
                  />
                )
              )}
              {/* EmployeeData will see here */}
            </tbody>
          </table>

          <div className="total">
            {' '}
            <strong>Total:</strong> ₹ {totalAllSalary}
          </div>
        </>
      )}
    </div>
  );
};

export default Employee;
