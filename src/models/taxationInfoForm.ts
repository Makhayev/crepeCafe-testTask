type disabledGroups =
  | "disabledGroupOne"
  | "disabledGroupTwo"
  | "disabledGroupTwoIndefinite"
  | "disabledGroupThree"
  | "disabledGroupThreeIndefinite";

type socialStatus =
  | "pensionerByAge"
  | "pensionerOther"
  | "student"
  | disabledGroups
  | "astanaHubMFCA"
  | "OPPV"
  | "multipleChildren";

export interface TaxationInfoForm {
  salary: number;
  year: "2021" | "2022" | "2023";
  isStaffMember: boolean;
  isResident: boolean;
  is14MRP?: boolean;
  is882MRP?: boolean;
  socialStatuses?: socialStatus[];
}
