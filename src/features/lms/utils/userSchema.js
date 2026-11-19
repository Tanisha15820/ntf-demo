import usersData from "../../../data/users.json";

export const GENDER_OPTIONS = ["Male", "Female", "Other"];
export const MARITAL_OPTIONS = [
  "Single",
  "Married",
  "Unmarried",
  "Divorced",
  "Widowed",
];
export const YES_NO_OPTIONS = ["Yes", "No"];
export const STATUS_OPTIONS = ["Active", "Inactive"];

export const USER_COLUMNS = [
  { label: "SNo", key: "sno" },
  { label: "Pay Code", key: "payCode" },
  { label: "Card No", key: "cardNo" },
  { label: "Emp Name", key: "empName" },
  { label: "Father Name", key: "fatherName" },
  { label: "DOB", key: "dob" },
  { label: "Joining Date", key: "joiningDate" },
  { label: "Leaving Date", key: "leavingDate" },
  { label: "Company Name", key: "companyName" },
  { label: "Department", key: "department" },
  { label: "SubDepartment", key: "subDepartment" },
  { label: "Line", key: "line" },
  { label: "Machine", key: "machine" },
  { label: "Shift", key: "shift" },
  { label: "Plant", key: "plant" },
  { label: "Plant Location", key: "plantLocation" },
  { label: "Grade", key: "grade" },
  { label: "Designation", key: "designation" },
  { label: "Category", key: "category" },
  { label: "Gender", key: "gender" },
  { label: "Blood Group", key: "bloodGroup" },
  { label: "Marital Status", key: "maritalStatus" },
  { label: "Email", key: "email" },
  { label: "Number", key: "number" },
  { label: "isDojo", key: "isDojo" },
  { label: "FirstOfDate", key: "firstOfDate" },
  { label: "skillLevel", key: "skillLevel" },
  { label: "Salary", key: "salary" },
];

export const USER_DATE_KEYS = ["dob", "joiningDate", "leavingDate", "firstOfDate"];

export const EMPTY_USER_FORM = {
  ...USER_COLUMNS.reduce((form, column) => ({ ...form, [column.key]: "" }), {}),
  status: "Active",
  active: true,
  password: "",
};

export const USER_FORM_FIELDS = [
  {
    label: "Employee Name",
    key: "empName",
    placeholder: "Enter employee name",
  },
  { label: "Status", key: "status", type: "select", options: STATUS_OPTIONS },
  { label: "Pay Code", key: "payCode", placeholder: "Enter pay code" },
  { label: "Card No", key: "cardNo", placeholder: "Enter card number" },
  { label: "Father Name", key: "fatherName", placeholder: "Enter father name" },
  { label: "DOB", key: "dob", type: "date" },
  { label: "Joining Date", key: "joiningDate", type: "date" },
  { label: "Leaving Date", key: "leavingDate", type: "date" },
  { label: "Company Name", key: "companyName", placeholder: "Enter company name" },
  { label: "Department", key: "department", type: "select", options: [] },
  { label: "Sub Department", key: "subDepartment", type: "select", options: [] },
  { label: "Line", key: "line", type: "select", options: [] },
  { label: "Machine", key: "machine", type: "select", options: [] },
  { label: "Shift", key: "shift", type: "select", options: [] },
  { label: "Plant", key: "plant", placeholder: "Enter plant" },
  { label: "Plant Location", key: "plantLocation", type: "select", options: [] },
  { label: "Grade", key: "grade", placeholder: "Enter grade" },
  { label: "Designation", key: "designation", placeholder: "Enter designation" },
  { label: "Category", key: "category", placeholder: "Enter category" },
  { label: "Gender", key: "gender", type: "select", options: GENDER_OPTIONS },
  { label: "Blood Group", key: "bloodGroup", placeholder: "Enter blood group" },
  {
    label: "Marital Status",
    key: "maritalStatus",
    type: "select",
    options: MARITAL_OPTIONS,
  },
  { label: "Email", key: "email", type: "email", placeholder: "Enter email address" },
  { label: "Number", key: "number", placeholder: "Enter contact number" },
  { label: "Is Dojo", key: "isDojo", type: "select", options: YES_NO_OPTIONS },
  { label: "First Of Date", key: "firstOfDate", type: "date" },
  { label: "Skill Level", key: "skillLevel", placeholder: "Enter skill level" },
  { label: "Salary", key: "salary", type: "number", placeholder: "Enter salary" },
  {
    label: "Password",
    key: "password",
    type: "password",
    placeholder: "Enter password",
  },
];

export const hasUserShape = (users) =>
  Array.isArray(users) &&
  (users.length === 0 || Object.prototype.hasOwnProperty.call(users[0], "empName"));

export const SEED_EMPLOYEES = usersData.map((u) => ({
  ...u,
  id: String(u.id),
  isDojo: u.isDojo === true || u.isDojo === "Yes" ? "Yes" : "No",
  salary: u.salary != null ? String(u.salary) : "",
}));
