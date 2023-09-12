
enum EmployeeStatus {
  Active = 'active',
  Inactive = 'inactive',
  UnpaidLeave = 'unpaid_leave',
}

enum PaymentType {
  Internal = 'internal',
  External = 'external',
}

class Employee {
  
  constructor(
    public name:string,
    public  surname: string,
    public salary:number,
    public paymentInformation: PaymentType,
    public status: EmployeeStatus,
    public department: Department| null,
  ) {}
}

class PrevEmployee {

  constructor(
    public name:string,
    public  surname: string,
    public salary:number,
    public bankAccountNumber: number,

    ) {}
}

class Department {
  private employees: Employee[] = [];
  public budget: { debit: number; credit: number } = { debit: 0, credit: 0 };

  constructor(
    public name: string,
    public domain: string,
    budget: { debit: number; credit: number } = { debit: 0, credit: 0 },
  ) {
    this.budget = budget;
  }


  addEmployee(employee: Employee):void {
    this.employees.push(employee);
    this.budget.debit += employee.salary;

  }

  removeEmployee(employee: Employee): void {
    const index = this.employees.indexOf(employee);
    if (index !== -1) {
      this.employees.splice(index, 1);
      this.budget.debit -= employee.salary;
    }
  }

  calculateBalance(): number {
    return this.budget.debit - this.budget.credit;
  }

  convertToEmployee(prevEmployee: PrevEmployee): Employee {
    const newEmployee = new Employee(
      prevEmployee.name,
      prevEmployee.surname,
      prevEmployee.salary,
      PaymentType.Internal,
      EmployeeStatus.Active,
      this
    );
    this.addEmployee(newEmployee);
    return newEmployee;
  }

  getEmployees(): Employee[] {
    return this.employees;
  }


}

class Accounting extends Department {
 
  constructor(public name: string, public domain: string, budget: { debit: number; credit: number } = { debit: 0, credit: 0 }) {
    super(name, domain, budget);
  }

  //Method to add an Employee or Department to the balance 
  addToBalance(item: Employee | Department): void {
    if (item instanceof Employee) {
      // Employees receive salaries only actively, only through internal payments
      if (item.status === EmployeeStatus.Active && item.paymentInformation === PaymentType.Internal) {
        this.budget.debit += item.salary;
      }
    } else if (item instanceof Department) {
      this.budget.debit += item.calculateBalance(); // Add the department balance to the budget
    }
  }


  // Method for de-balancing Employee or Department
  removeFromBalance(item: Employee | Department): void {
    if (item instanceof Employee) {
    // Employees receive salaries only Active, only through internal payments
      if (item.status === EmployeeStatus.Active && item.paymentInformation === PaymentType.Internal) {
       this.budget.credit += item.salary;
      }
    } else if (item instanceof Department) {
     this.budget.credit += item.calculateBalance(); // Remove the department's balance from the budget
    }
  }

  // Method for paying salaries for all staff
  paySalaries(): void {
   this.getEmployees().forEach((employee) => {
     if (employee.status === EmployeeStatus.Active) {
      if (employee.paymentInformation === PaymentType.Internal) {
        // Employees are paid only through internal payments
        this.removeFromBalance(employee);
        employee.status = EmployeeStatus.Inactive;
      } else if (employee.paymentInformation === PaymentType.External) {
        // PrevEmployees get paid only through external payments
        this.addToBalance(employee);
        employee.status = EmployeeStatus.Inactive;
      }
     }
   });
  }
}

class Company{
  private departments:Department[] = [];
  private prevEmployees:PrevEmployee[] = [];
  

  constructor(public name: string) {}

  addDepartment(department: Department):void {
    this.departments.push(department);
  }

  hirePrevEmployee(prevEmployee: PrevEmployee):void{
    this.prevEmployees.push(prevEmployee);
  }

  addEmployeeToDepartment(employee: Employee, department: Department): void {
    department.addEmployee(employee);
  }
}
