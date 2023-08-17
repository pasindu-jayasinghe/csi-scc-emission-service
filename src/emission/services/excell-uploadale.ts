
export abstract class ExcellUploadable{
//  abstract addFromExcell(unit: Unit, project: Project, user: User, data: any, variable_mapping: any[],year: number);
  //abstract excellBulkUpload(unit: Unit, project: Project, user: User, data: any, variable_mapping: any[],year: number, ownership: string, isMobile: boolean);
  abstract downlodExcellBulkUploadVariableMapping();
  abstract excellBulkUpload( data: any, variable_mapping: any[],year: number);

}