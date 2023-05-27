import { FinalResults, TaxationInfoForm } from "@/src/models";

const taxRate = {
  2021: {
    MRP: 2917,
    maxOPV: 212500,
    maxVOSMS: 8500,
    maxCO: 10413,
    maxOOSMS: 8500,
    OOSMSrate: 0.02,
    OPPVrate: 0.05,
    OPVrate: 0.1,
    VOSMSrate: 0.02,
    COrate: 0.0315,
  },
  2022: {
    MRP: 3063,
    maxOPV: 300000,
    maxVOSMS: 12000,
    maxCO: 14700,
    maxOOSMS: 18000,
    OOSMSrate: 0.03,
    OPPVrate: 0.05,
    OPVrate: 0.1,
    VOSMSrate: 0.02,
    COrate: 0.0315,
  },
  2023: {
    MRP: 3450,
    maxOPV: 350000,
    maxVOSMS: 14000,
    maxCO: 17150,
    maxOOSMS: 21000,
    OOSMSrate: 0.03,
    OPPVrate: 0.05,
    OPVrate: 0.1,
    VOSMSrate: 0.02,
    COrate: 0.0315,
  },
};

export const calculateTaxes = ({
  salary,
  year,
  is14MRP,
  is882MRP,
  socialStatuses,
  isStaffMember,
  isResident,
}: TaxationInfoForm): FinalResults => {
  let VOSMS = 0;
  let IPN = 0;
  salary = parseInt(String(salary).replace(" ", ""));
  const employeeTaxes = [];
  if (
    !(
      socialStatuses?.includes("pensionerByAge") ||
      socialStatuses?.includes("pensionerOther") ||
      !isResident
    )
  ) {
    employeeTaxes.push({
      taxName: "ОПВ",
      taxValue: Math.min(salary * taxRate[year].OPVrate, taxRate[year].maxOPV),
    });
  }
  if (
    !(
      socialStatuses?.includes("pensionerByAge") ||
      !isResident ||
      socialStatuses?.includes("student") ||
      socialStatuses?.includes("pensionerOther") ||
      socialStatuses?.includes("multipleChildren") ||
      socialStatuses?.some((status) => status.includes("disabled"))
    )
  ) {
    VOSMS = Math.min(salary * taxRate[year].VOSMSrate, taxRate[year].maxVOSMS);
    employeeTaxes.push({ taxName: "ВОСМС", taxValue: VOSMS });
  }
  if (
    !(
      (socialStatuses?.includes("astanaHubMFCA") && isResident) ||
      socialStatuses?.includes("disabledGroupTwoIndefinite") ||
      socialStatuses?.includes("disabledGroupThreeIndefinite") ||
      (is882MRP && isResident)
    )
  ) {
    if (
      !isResident ||
      socialStatuses?.includes("pensionerByAge") ||
      socialStatuses?.includes("pensionerOther")
    ) {
      IPN = salary * 0.1;
      if (is14MRP && isResident) {
        IPN -= taxRate[year].MRP * 14 * 0.1;
      }
    } else if (
      socialStatuses?.includes("disabledGroupOne") ||
      socialStatuses?.includes("disabledGroupTwo") ||
      socialStatuses?.includes("disabledGroupThree")
    ) {
      IPN = salary * 0.09;
      if (is14MRP) {
        IPN -= taxRate[year].MRP * 14 * 0.1;
      }
    } else {
      IPN = (salary * 0.9 - VOSMS) * 0.1;
      if (is14MRP) {
        IPN = IPN - taxRate[year].MRP * 14 * 0.1;
      }
      if (salary < 25 * taxRate[year].MRP) {
        IPN *= 0.1;
      }
    }
    if (!isResident && !isStaffMember) {
      IPN *= 2;
    }
    if (IPN > 0) {
      employeeTaxes.push({ taxName: "ИПН", taxValue: IPN });
    }
  }
  const employerTaxes = [];
  if (
    !(
      !isStaffMember ||
      !isResident ||
      socialStatuses?.includes("pensionerByAge")
    )
  ) {
    employerTaxes.push({
      taxName: "СО",
      taxValue: Math.min(
        salary *
          (socialStatuses?.includes("pensionerOther")
            ? 0.035
            : taxRate[year].COrate),
        taxRate[year].maxCO
      ),
    });
  }
  if (
    !(
      !isStaffMember ||
      !isResident ||
      socialStatuses?.includes("pensionerByAge") ||
      socialStatuses?.includes("student") ||
      socialStatuses?.includes("pensionerOther") ||
      socialStatuses?.includes("multipleChildren") ||
      socialStatuses?.some((status) => status.includes("disabled"))
    )
  ) {
    employerTaxes.push({
      taxName: "ООСМС",
      taxValue: Math.min(
        salary * taxRate[year].OOSMSrate,
        taxRate[year].maxOOSMS
      ),
    });
  }

  if (
    socialStatuses?.includes("OPPV") &&
    !(
      socialStatuses?.includes("pensionerOther") ||
      socialStatuses?.includes("pensionerByAge") ||
      !isResident ||
      !isStaffMember
    )
  ) {
    employerTaxes.push({
      taxName: "ОППВ",
      taxValue: salary * taxRate[year].OPPVrate,
    });
  }

  const finalResult =
    salary - employeeTaxes.reduce((acc, tax) => acc + tax.taxValue, 0);

  return {
    employeeTaxes,
    employerTaxes,
    finalResult,
  } as FinalResults;
};
