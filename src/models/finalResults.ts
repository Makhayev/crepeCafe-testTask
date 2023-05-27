export interface FinalResults {
  employeeTaxes: {
    taxName: string;
    taxValue: number;
  }[];
  employerTaxes: {
    taxName: string;
    taxValue: number;
  }[];
  finalResult: number;
}
